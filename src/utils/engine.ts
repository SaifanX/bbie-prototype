import { createClient } from '@supabase/supabase-js';
import { generateEmbedding, generateMatchVerdict } from './gemini';
import { calculateMatch } from './matcher';

// Read-only anon client for SELECT queries
import { supabase } from './supabase';

// Admin client for all WRITE operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function logStep(message: string, stage: string, severity: 'info' | 'warn' | 'error' = 'info') {
  // Fire-and-forget log — don't await, don't block resolution
  supabaseAdmin.from('system_logs').insert({ message, stage, severity }).then(() => {});
}

function sparseMask(text: string): string {
  if (!text) return '';
  return text.split(' ').map(word => {
    if (word.length <= 2) return word;
    return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
  }).join(' ');
}

function generateUBID(name: string): string {
  const prefix = name
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w.substring(0, 2))
    .join('');
  const num = Math.floor(10000 + Math.random() * 90000);
  return `KA-UBID-${prefix}-${num}`;
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

  // --- TIER 1: DIRECT IDENTIFIER MATCH ---
  if (record.pan || record.gstin) {
    await logStep(`Tier 1 Check: Searching by identifiers (PAN/GSTIN)...`, 'comparison');
    
    let query = supabase.from('businesses').select('*');
    if (record.pan) query = query.eq('pan', record.pan);
    else if (record.gstin) query = query.eq('gstin', record.gstin);
    const { data: directMatches } = await query.limit(1);

    if (directMatches && directMatches.length > 0) {
      const bestMatch = directMatches[0];
      const verdict = `Direct match confirmed via unique identifier. Linking to existing identity: ${bestMatch.name}.`;
      await logStep(`Direct Match Found: ${bestMatch.name} via ${record.pan ? 'PAN' : 'GSTIN'}`, 'decision');

      await supabaseAdmin.from('source_records').update({
        business_id: bestMatch.id,
        resolved: true
      }).eq('id', recordId);

      await supabaseAdmin.from('resolution_events').insert({
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
  
  let bestMatch: any = null;
  let highestScore = 0;

  try {
    const denseString = `${record.entity_name} | ${record.address || ''} | ${record.pincode || ''}`;
    const embedding = await generateEmbedding(denseString);

    const { data: matches } = await supabase.rpc('match_businesses', {
      query_embedding: embedding,
      match_threshold: 0.6,
      match_count: 5
    });

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
            { name: record.entity_name, address: record.address, pan: record.pan, gstin: record.gstin, pincode: record.pincode },
            { name: business.name, address: business.address, pan: business.pan, gstin: business.gstin, pincode: business.pincode }
          );
          if (result.score > highestScore) {
            highestScore = result.score;
            bestMatch = business;
          }
        }
      }
    }
  } catch (e) {
    // Vector search unavailable — proceed to new entity creation
    await logStep(`Vector search unavailable. Proceeding to entity creation.`, 'comparison', 'warn');
  }

  // --- TIER 3: DECISION ---
  let verdict = '';
  let status: 'resolved' | 'triage' | 'new_entity' = 'new_entity';

  if (highestScore > 0.85 && bestMatch) {
    await logStep(`High confidence match (${(highestScore * 100).toFixed(0)}%). Auto-merging...`, 'decision');
    verdict = `Heuristic alignment confirmed high probability of identity overlap with ${bestMatch.name}.`;
    status = 'resolved';

    await supabaseAdmin.from('source_records').update({
      business_id: bestMatch.id,
      resolved: true
    }).eq('id', recordId);

  } else if (highestScore > 0.4 && bestMatch) {
    await logStep(`Ambiguous match (${(highestScore * 100).toFixed(0)}%). Invoking AI Arbitration...`, 'decision');
    const maskedSource = sparseMask(record.entity_name);
    const maskedTarget = sparseMask(bestMatch.name);
    verdict = await generateMatchVerdict(maskedSource, maskedTarget, Math.round(highestScore * 100));
    status = 'triage';

  } else {
    // NO MATCH — Create a new business entity in the registry
    await logStep(`No viable candidates. Creating new registry entry...`, 'decision');
    
    const ubid = generateUBID(record.entity_name);
    const { data: newBusiness, error: bizError } = await supabaseAdmin
      .from('businesses')
      .insert({
        ubid,
        name: record.entity_name,
        address: record.address || record.raw_data?.address || 'Address Pending',
        pincode: record.pincode || '',
        pan: record.pan || null,
        gstin: record.gstin || null,
        status: 'active',
      })
      .select('id')
      .single();

    if (!bizError && newBusiness) {
      await supabaseAdmin.from('source_records').update({
        business_id: newBusiness.id,
        resolved: true
      }).eq('id', recordId);

      verdict = `New business identity created. UBID assigned: ${ubid}`;
      status = 'new_entity';
      bestMatch = { id: newBusiness.id };
      await logStep(`New entity registered: ${ubid}`, 'decision');
    } else {
      verdict = `Entity creation failed: ${bizError?.message}`;
      await logStep(verdict, 'decision', 'error');
    }
  }

  // Log the Resolution Event
  await supabaseAdmin.from('resolution_events').insert({
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
