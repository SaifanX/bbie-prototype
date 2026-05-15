'use server'

import { supabase } from '@/utils/supabase'
import { revalidatePath } from 'next/cache'



import { inferStatus } from '@/utils/inference'

export async function approveMerge(eventId: string, sourceRecordId: string, targetBusinessId: string) {
  // CRITICAL: Using a Postgres RPC for atomic transaction to prevent state corruption.
  // See docs/transactions.sql for the implementation.
  const { error } = await supabase.rpc('approve_merge_transaction', {
    p_event_id: eventId,
    p_source_record_id: sourceRecordId,
    p_target_business_id: targetBusinessId,
    p_resolver_id: 'human_reviewer'
  });

  if (error) {
    console.error("Transaction Failed:", error);
    throw new Error(`Critical: Failed to resolve event atomically. ${error.message}`);
  }

  revalidatePath('/review')
  revalidatePath('/')
  return { success: true }
}

export async function createNewEntity(eventId: string, sourceRecordId: string, sourceName: string, sourceAddress: string, sourcePincode: string = '') {
  // CRITICAL: Using a Postgres RPC for atomic transaction to prevent state corruption.
  const { data: newBusinessId, error } = await supabase.rpc('create_new_entity_transaction', {
    p_event_id: eventId,
    p_source_record_id: sourceRecordId,
    p_ubid: `KA-UBID-${Math.floor(10000 + Math.random() * 90000)}`,
    p_name: sourceName,
    p_address: sourceAddress || 'Unknown',
    p_pincode: sourcePincode
  });
    
  if (error || !newBusinessId) {
    console.error("Transaction Failed:", error);
    throw new Error(`Critical: Failed to create new entity atomically. ${error?.message || 'Unknown error'}`);
  }

  revalidatePath('/review')
  revalidatePath('/')
  return { success: true }
}

export async function flagFraud(eventId: string, sourceRecordId: string) {
  await supabase
    .from('resolution_events')
    .update({ status: 'rejected', resolved_at: new Date().toISOString(), resolved_by: 'human_reviewer' })
    .eq('id', eventId)

  revalidatePath('/review')
  revalidatePath('/')
  
  return { success: true }
}
