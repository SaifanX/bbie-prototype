import { supabase } from './supabase';
import { generateEmbedding, generateMatchVerdict } from './gemini';
import { calculateMatch } from './matcher';

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

  // 2. Generate Dense Semantic Embedding (Name + Address + Pincode)
  const denseString = `${record.entity_name} | ${record.address || ''} | ${record.pincode || ''}`;
  const embedding = await generateEmbedding(denseString);

  // 3. Perform Vector Similarity Search
  const { data: matches, error: matchError } = await supabase.rpc('match_businesses', {
    query_embedding: embedding,
    match_threshold: 0.8, // 80% semantic similarity threshold (Sniper Scope)
    match_count: 5
  });

  let bestMatch = null;
  let highestScore = 0;

  if (matches && matches.length > 0) {
    // 4. BATCH FETCH CANDIDATES: Solve N+1 Scalability Trap
    const candidateIds = matches.map((m: any) => m.id);
    const { data: candidateBusinesses } = await supabase
      .from('businesses')
      .select('*')
      .in('id', candidateIds);

    if (candidateBusinesses) {
      for (const business of candidateBusinesses) {
        const result = calculateMatch(
          { 
            primary_name: record.entity_name, 
            registered_address: record.address,
            pan: record.pan,
            gstin: record.gstin,
            pincode: record.pincode
          },
          { 
            primary_name: business.primary_name, 
            registered_address: business.registered_address,
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

  // 5. Generate Forensic Verdict & Finalize
  let verdict = "";
  let status: 'resolved' | 'triage' | 'new_entity' = 'triage';

  if (highestScore > 0.85) {
    // High Confidence Match
    verdict = await generateMatchVerdict(record.entity_name, bestMatch.primary_name, Math.round(highestScore * 100));
    status = 'resolved';
    
    // Update Record
    await supabase.from('source_records').update({
      business_id: bestMatch.id,
      resolved: true
    }).eq('id', recordId);

  } else if (highestScore > 0.4) {
    // Ambiguous Match -> Send to Triage (Manual Review)
    verdict = await generateMatchVerdict(record.entity_name, bestMatch.primary_name, Math.round(highestScore * 100));
    status = 'triage';
  } else {
    // No match found -> Potentially a new entity
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
