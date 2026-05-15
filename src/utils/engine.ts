import { supabase } from './supabase';
import { generateEmbedding, generateMatchVerdict } from './gemini';
import { calculateMatch } from './matcher';

async function logStep(message: string, stage: string, severity: 'info' | 'warn' | 'error' = 'info') {
  await supabase.from('system_logs').insert({
    message,
    stage,
    severity
  });
}

function sparseMask(text: string): string {
  if (!text) return '';
  return text.split(' ').map(word => {
    if (word.length <= 2) return word;
    return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
  }).join(' ');
}

export interface ResolutionResult {
  sourceId: string;
  matchedBusinessId: string | null;
  score: number;
  verdict: string;
  status: 'resolved' | 'triage' | 'new_entity';
}

/**
 * Orchestrates the resolution of a single source record.
 * This is the core "Intelligence" loop of BBIE.
 */
export async function processRecord(recordId: string): Promise<ResolutionResult> {
  // 1. Fetch the raw record
  const { data: record, error: fetchError } = await supabase
    .from('source_records')
    .select('*')
    .eq('id', recordId)
    .single();

  if (fetchError || !record) {
    throw new Error(`Record ${recordId} not found`);
  }

  await logStep(`Ingesting record: ${record.entity_name} [${record.department}]`, 'ingestion');

  // --- TIER 1: DIRECT IDENTIFIER MATCH (SQL) ---
  if (record.pan || record.gstin) {
    await logStep(`Tier 1 Check: Searching by identifiers (PAN/GSTIN)...`, 'comparison');
    const { data: directMatches } = await supabase
      .from('businesses')
      .select('*')
      .or(`pan.eq.${record.pan},gstin.eq.${record.gstin}`)
      .limit(1);

    if (directMatches && directMatches.length > 0) {
      const bestMatch = directMatches[0];
      await logStep(`Direct Match Found: ${bestMatch.name} via ${record.pan ? 'PAN' : 'GSTIN'}`, 'decision');
      
      const verdict = `Direct match confirmed via unique identifier tracking. Linking to existing identity ${bestMatch.name}.`;
      
      // Update Record
      await supabase.from('source_records').update({
        business_id: bestMatch.id,
        resolved: true
      }).eq('id', recordId);

      await supabase.from('resolution_events').insert({
        source_record_id: recordId,
        potential_business_id: bestMatch.id,
        match_score: 1.0,
        status: 'approved',
        ai_reasoning: verdict
      });

      return { sourceId: recordId, matchedBusinessId: bestMatch.id, score: 1.0, verdict, status: 'resolved' };
    }
  }

  // --- TIER 2: HEURISTIC MATCH (Vector + Similarity) ---
  await logStep(`Tier 2 Check: Initializing Semantic Vector Search...`, 'comparison');
  const denseString = `${record.entity_name} | ${record.address || ''} | ${record.pincode || ''}`;
  const embedding = await generateEmbedding(denseString);

  const { data: matches, error: matchError } = await supabase.rpc('match_businesses', {
    query_embedding: embedding,
    match_threshold: 0.6, 
    match_count: 5
  });

  let bestMatch = null;
  let highestScore = 0;

  if (matches && matches.length > 0) {
    await logStep(`Found ${matches.length} semantic candidates. Running cross-validation...`, 'comparison');
    const candidateIds = matches.map((m: any) => m.id);
    const { data: candidateBusinesses } = await supabase
      .from('businesses')
      .select('*')
      .in('id', candidateIds);

    if (candidateBusinesses) {
      for (const business of candidateBusinesses) {
        const result = calculateMatch(
          { 
            name: record.entity_name, 
            address: record.address,
            pan: record.pan,
            gstin: record.gstin,
            pincode: record.pincode
          },
          { 
            name: business.name, 
            address: business.address,
            pan: business.pan,
            gstin: business.gstin,
            pincode: business.pincode
          }
        );

        if (result.score > highestScore) {
          highestScore = result.score;
          bestMatch = business;
        }
      }
    }
  }

  // --- TIER 3: AI ARBITRATION (Sparse Masked) ---
  let verdict = "";
  let status: 'resolved' | 'triage' | 'new_entity' = 'triage';

  if (highestScore > 0.85) {
    await logStep(`High confidence heuristic match (${(highestScore * 100).toFixed(0)}%). Finalizing...`, 'decision');
    verdict = `Heuristic alignment confirmed high probability of identity overlap with ${bestMatch.name}.`;
    status = 'resolved';
    
    await supabase.from('source_records').update({
      business_id: bestMatch.id,
      resolved: true
    }).eq('id', recordId);

  } else if (highestScore > 0.4) {
    await logStep(`Ambiguous match found (${(highestScore * 100).toFixed(0)}%). Invoking AI Arbitration...`, 'decision');
    
    // Masked reasoning for privacy
    const maskedSource = sparseMask(record.entity_name);
    const maskedTarget = sparseMask(bestMatch.name);
    
    verdict = await generateMatchVerdict(maskedSource, maskedTarget, Math.round(highestScore * 100));
    status = 'triage';
  } else {
    await logStep(`No viable candidates found. Routing to Registry Creation.`, 'decision');
    verdict = "No existing registry matches found with sufficient confidence. Tagged for entity creation.";
    status = 'new_entity';
  }

  // 6. Log the Resolution Event
  await supabase.from('resolution_events').insert({
    source_record_id: recordId,
    potential_business_id: bestMatch?.id || null,
    match_score: highestScore,
    status: status === 'resolved' ? 'approved' : 'pending',
    ai_reasoning: verdict
  });

  return {
    sourceId: recordId,
    matchedBusinessId: bestMatch?.id || null,
    score: highestScore,
    verdict,
    status
  };
}
