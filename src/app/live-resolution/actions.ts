'use server';

import { createClient } from '@supabase/supabase-js';
import { processRecord, ResolutionResult } from '@/utils/engine';
import { supabase } from '@/utils/supabase';
import { restoreSourceRecord } from '@/utils/archive';
import { revalidatePath } from 'next/cache';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Server Action to trigger the BBIE Intelligence Engine for a single record.
 */
export async function runResolution(recordId: string): Promise<ResolutionResult> {
  try {
    const result = await processRecord(recordId);
    revalidatePath('/');
    revalidatePath('/search');
    revalidatePath('/dashboard');
    revalidatePath('/review');
    return result;
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
 * Ensures there are records ready for the Judge Evaluation Demo.
 * If unresolved records are low, unresolves a curated batch of records for seamless continuous demos.
 */
export async function prepareJudgeDemoRecords() {
  const { data: unresolved } = await supabase
    .from('source_records')
    .select('id, entity_name')
    .eq('resolved', false)
    .limit(25);

  if (unresolved && unresolved.length >= 5) {
    return unresolved;
  }

  const { data: recordsToReset } = await supabaseAdmin
    .from('source_records')
    .select('id, entity_name')
    .limit(20);

  if (recordsToReset && recordsToReset.length > 0) {
    const ids = recordsToReset.map(r => r.id);
    await supabaseAdmin
      .from('source_records')
      .update({ resolved: false, business_id: null })
      .in('id', ids);
    return recordsToReset;
  }

  return [];
}

/**
 * Fully reverses a resolved record — restores from archive if needed, deletes the business if it was newly
 * created (and has no other linked records), resets source_record to
 * unresolved, and removes resolution events.
 */
export async function revertRecord(sourceRecordId: string, businessId: string | null) {
  // 1. Restore the source record from archive vault
  await restoreSourceRecord(sourceRecordId);

  // 2. Delete the business only if it has no other linked source records in either staging or archive
  if (businessId) {
    const { data: othersStaging } = await supabaseAdmin
      .from('source_records')
      .select('id')
      .eq('business_id', businessId);

    const { data: othersArchive } = await supabaseAdmin
      .from('source_records_archive')
      .select('id')
      .eq('business_id', businessId);

    const totalLinked = (othersStaging?.length || 0) + (othersArchive?.length || 0);

    if (totalLinked === 0) {
      await supabaseAdmin.from('businesses').delete().eq('id', businessId);
    }
  }

  // 3. Remove resolution events for this record
  await supabaseAdmin
    .from('resolution_events')
    .delete()
    .eq('source_record_id', sourceRecordId);

  revalidatePath('/');
  revalidatePath('/search');
  revalidatePath('/dashboard');
  revalidatePath('/review');
  return { success: true };
}
