'use server';

import { createClient } from '@supabase/supabase-js';
import { processRecord, ResolutionResult } from '@/utils/engine';
import { supabase } from '@/utils/supabase';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    .limit(50);

  if (error) throw error;
  return data;
}

/**
 * Fully reverses a resolved record — deletes the business if it was newly
 * created (and has no other linked records), resets source_record to
 * unresolved, and removes resolution events.
 */
export async function revertRecord(sourceRecordId: string, businessId: string | null) {
  // 1. Reset the source record
  await supabaseAdmin
    .from('source_records')
    .update({ business_id: null, resolved: false })
    .eq('id', sourceRecordId);

  // 2. Delete the business only if it has no other linked source records
  if (businessId) {
    const { data: others } = await supabaseAdmin
      .from('source_records')
      .select('id')
      .eq('business_id', businessId);

    if (!others || others.length === 0) {
      await supabaseAdmin.from('businesses').delete().eq('id', businessId);
    }
  }

  // 3. Remove resolution events for this record
  await supabaseAdmin
    .from('resolution_events')
    .delete()
    .eq('source_record_id', sourceRecordId);

  return { success: true };
}
