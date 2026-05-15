'use server';

import { processRecord, ResolutionResult } from '@/utils/engine';
import { supabase } from '@/utils/supabase';

/**
 * Server Action to trigger the BBIE Intelligence Engine for a single record.
 */
export async function runResolution(recordId: string): Promise<ResolutionResult> {
  try {
    return await processRecord(recordId);
  } catch (error) {
    console.error(`Resolution Failed for ${recordId}:`, error);
    throw new Error("Engine process failure");
  }
}

/**
 * Fetches the latest unresolved records.
 */
export async function getUnresolvedRecords() {
  const { data, error } = await supabase
    .from('source_records')
    .select('id, entity_name')
    .eq('resolved', false)
    .limit(10); // Limit for the visual demo

  if (error) throw error;
  return data;
}
