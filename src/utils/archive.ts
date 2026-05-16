import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Moves a record from source_records to source_records_archive upon successful resolution.
 */
export async function archiveSourceRecord(sourceRecordId: string, businessId: string | null, resolved: boolean = true) {
  // 1. Fetch from source_records
  const { data: record, error: fetchError } = await supabaseAdmin
    .from('source_records')
    .select('*')
    .eq('id', sourceRecordId)
    .single();

  if (fetchError || !record) {
    console.warn(`Record ${sourceRecordId} not found in source_records for archiving.`);
    return false;
  }

  // 2. Insert into source_records_archive
  const archivePayload = {
    ...record,
    business_id: businessId,
    resolved,
    archived_at: new Date().toISOString()
  };

  const { error: insertError } = await supabaseAdmin
    .from('source_records_archive')
    .insert(archivePayload);

  if (insertError) {
    console.error(`Failed to insert record ${sourceRecordId} into source_records_archive:`, insertError);
    throw new Error(`Archival insert failed: ${insertError.message}`);
  }

  // 3. Delete from source_records
  const { error: deleteError } = await supabaseAdmin
    .from('source_records')
    .delete()
    .eq('id', sourceRecordId);

  if (deleteError) {
    console.error(`Failed to delete record ${sourceRecordId} from source_records:`, deleteError);
    throw new Error(`Archival delete failed: ${deleteError.message}`);
  }

  return true;
}

/**
 * Moves a record back from source_records_archive to source_records upon Revert/Undo.
 */
export async function restoreSourceRecord(sourceRecordId: string) {
  // 1. Fetch from source_records_archive
  const { data: archived, error: fetchError } = await supabaseAdmin
    .from('source_records_archive')
    .select('*')
    .eq('id', sourceRecordId)
    .single();

  if (fetchError || !archived) {
    // If not in archive, it might still be in source_records (e.g. triage case)
    // Just reset business_id and resolved
    await supabaseAdmin
      .from('source_records')
      .update({ business_id: null, resolved: false })
      .eq('id', sourceRecordId);
    return true;
  }

  // 2. Insert back into source_records
  const { archived_at, ...rest } = archived;
  const restorePayload = {
    ...rest,
    business_id: null,
    resolved: false
  };

  const { error: insertError } = await supabaseAdmin
    .from('source_records')
    .insert(restorePayload);

  if (insertError) {
    console.error(`Failed to restore record ${sourceRecordId} to source_records:`, insertError);
    throw new Error(`Restore insert failed: ${insertError.message}`);
  }

  // 3. Delete from source_records_archive
  const { error: deleteError } = await supabaseAdmin
    .from('source_records_archive')
    .delete()
    .eq('id', sourceRecordId);

  if (deleteError) {
    console.error(`Failed to delete record ${sourceRecordId} from source_records_archive:`, deleteError);
    throw new Error(`Restore delete failed: ${deleteError.message}`);
  }

  return true;
}
