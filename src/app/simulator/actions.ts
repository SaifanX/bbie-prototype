'use server'

import { createClient } from '@supabase/supabase-js';
import { calculateMatch } from '@/utils/matcher';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function resolveRecord(recordId: string) {
  // 1. Fetch the raw record
  const { data: record, error: fetchError } = await supabase
    .from('source_records')
    .select('*')
    .eq('id', recordId)
    .single();

  if (fetchError || !record) return { error: 'Record not found' };

  // 2. Query potential matches (in a real app, this would be a vector search or broad filter)
  const { data: potentialMatches } = await supabase
    .from('businesses')
    .select('*');

  let bestMatch = null;
  let highestScore = 0;

  // 3. Run Matching Engine
  if (potentialMatches) {
    for (const business of potentialMatches) {
      const match = calculateMatch(record, business);
      if (match.score > highestScore) {
        highestScore = match.score;
        bestMatch = { business, match };
      }
    }
  }

  // 4. Decision: Create New, Link Existing, or Flag for Review
  if (highestScore > 0.85 && bestMatch) {
    // Link to existing
    await supabase
      .from('source_records')
      .update({ business_id: bestMatch.business.id })
      .eq('id', recordId);
    
    return { 
      action: 'LINKED', 
      to: bestMatch.business.legal_name || bestMatch.business.primary_name, 
      score: highestScore,
      reasoning: bestMatch.match.reasoning.join('. ')
    };
  } else if (highestScore > 0.60 && bestMatch) {
    // Flag for Human Review
    const { error: eventError } = await supabase
      .from('resolution_events')
      .insert({
        source_record_id: recordId,
        potential_business_id: bestMatch.business.id,
        match_score: highestScore,
        status: 'pending',
        ai_reasoning: `Partial match detected (${Math.round(highestScore * 100)}%). ${bestMatch.match.reasoning.join('. ')}. Requires human validation.`
      });

    if (eventError) console.error("Error creating review event:", eventError);

    return {
      action: 'REVIEW_REQUIRED',
      to: bestMatch.business.legal_name || bestMatch.business.primary_name,
      score: highestScore,
      reasoning: "Ambiguous match detected. Escalating to Verification Workspace."
    };
  } else {
    // Create new Golden Record
    const { data: newBusiness, error: createError } = await supabase
      .from('businesses')
      .insert({
        primary_name: record.entity_name,
        pan: record.pan,
        activity_status: 'active',
        confidence_score: 1.0,
        last_activity_at: new Date().toISOString(),
        ubid: `BBIE-${Math.floor(Math.random() * 9000) + 1000}-NEW`
      })
      .select()
      .single();

    if (createError) {
      console.error("Create Biz Error:", createError);
      return { error: 'Failed to create business' };
    }

    // Link raw record
    await supabase
      .from('source_records')
      .update({ business_id: newBusiness.id })
      .eq('id', recordId);

    return { 
      action: 'CREATED_NEW', 
      id: newBusiness.id,
      score: 1.0,
      reasoning: 'No existing match found with >60% confidence. Establishing new Golden Record.'
    };
  }
}
