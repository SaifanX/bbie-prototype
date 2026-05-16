'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { archiveSourceRecord } from '@/utils/archive'

// Use service role key to bypass RLS for write operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

export async function createNewEntity(
  _eventId: string,
  sourceRecordId: string,
  sourceName: string,
  sourceAddress: string,
  sourcePincode: string = ''
) {
  const ubid = generateUBID(sourceName);

  // 1. Insert into businesses
  const { data: newBusiness, error: bizError } = await supabaseAdmin
    .from('businesses')
    .insert({
      ubid,
      name: sourceName,
      address: sourceAddress || 'Address Pending',
      pincode: sourcePincode,
      status: 'active',
    })
    .select('id')
    .single();

  if (bizError || !newBusiness) {
    console.error('Failed to create business:', bizError);
    throw new Error(`Failed to create entity: ${bizError?.message}`);
  }

  // 2. Archive source record
  await archiveSourceRecord(sourceRecordId, newBusiness.id, true);

  revalidatePath('/review');
  revalidatePath('/dashboard');
  revalidatePath('/');
  return { success: true, ubid };
}

export async function approveMerge(
  eventId: string,
  sourceRecordId: string,
  targetBusinessId: string
) {
  // 1. Archive source record linked to the existing business
  await archiveSourceRecord(sourceRecordId, targetBusinessId, true);

  // 2. Update resolution event status if it exists
  if (eventId && eventId !== sourceRecordId) {
    await supabaseAdmin
      .from('resolution_events')
      .update({ status: 'approved', resolved_at: new Date().toISOString(), resolved_by: 'human_reviewer' })
      .eq('id', eventId);
  }

  revalidatePath('/review');
  revalidatePath('/dashboard');
  revalidatePath('/');
  return { success: true };
}

export async function flagFraud(_eventId: string, sourceRecordId: string) {
  // Archive source record as resolved (rejected) so it leaves the active queue
  await archiveSourceRecord(sourceRecordId, null, true);

  revalidatePath('/review');
  revalidatePath('/');
  return { success: true };
}
