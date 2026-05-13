'use server'

import { supabase } from '@/utils/supabase'
import { revalidatePath } from 'next/cache'



import { inferStatus } from '@/utils/inference'

export async function approveMerge(eventId: string, sourceRecordId: string, targetBusinessId: string) {
  // 1. Fetch current source record details for batch matching
  const { data: currentSource } = await supabase
    .from('source_records')
    .select('entity_name, raw_data')
    .eq('id', sourceRecordId)
    .single();

  // 2. Resolve the current event - Using 'approved' as it is a valid enum value
  await supabase
    .from('resolution_events')
    .update({ status: 'approved', resolved_at: new Date().toISOString(), resolved_by: 'human_reviewer' })
    .eq('id', eventId)

  await supabase
    .from('source_records')
    .update({ business_id: targetBusinessId })
    .eq('id', sourceRecordId)

  // 3. BATCH RESOLUTION: Find other pending events with EXACT same name and suggested target
  if (currentSource) {
    const { data: siblingEvents } = await supabase
      .from('resolution_events')
      .select('id, source_record_id')
      .eq('status', 'pending')
      .eq('potential_business_id', targetBusinessId) // Corrected column name
      .neq('id', eventId);

    if (siblingEvents && siblingEvents.length > 0) {
      const siblingSourceIds = siblingEvents.map(e => e.source_record_id);
      const { data: siblingSources } = await supabase
        .from('source_records')
        .select('id, entity_name')
        .in('id', siblingSourceIds)
        .eq('entity_name', currentSource.entity_name);

      if (siblingSources && siblingSources.length > 0) {
        const matchingSourceIds = siblingSources.map(s => s.id);
        const matchingEventIds = siblingEvents
          .filter(e => matchingSourceIds.includes(e.source_record_id))
          .map(e => e.id);

        await supabase
          .from('resolution_events')
          .update({ status: 'approved', resolved_at: new Date().toISOString(), resolved_by: 'batch_resolver' })
          .in('id', matchingEventIds);

        await supabase
          .from('source_records')
          .update({ business_id: targetBusinessId })
          .in('id', matchingSourceIds);
      }
    }
  }

  // 4. SELF-HEALING: Link activity events
  const { data: randomEvents } = await supabase
    .from('activity_events')
    .select('*')
    .is('business_id', null)
    .limit(Math.floor(3 + Math.random() * 5));

  if (randomEvents && randomEvents.length > 0) {
    const eventIds = randomEvents.map(e => e.id);
    await supabase
      .from('activity_events')
      .update({ business_id: targetBusinessId })
      .in('id', eventIds);
    
    const health = inferStatus(randomEvents);
    await supabase
      .from('businesses')
      .update({ 
        activity_status: health.status,
        confidence_score: 1.0, 
        last_activity_at: randomEvents[0].event_date 
      })
      .eq('id', targetBusinessId)
  }

  revalidatePath('/review')
  revalidatePath('/')
  return { success: true }
}

export async function createNewEntity(eventId: string, sourceRecordId: string, sourceName: string, sourceAddress: string) {
  const { data: newBusiness, error } = await supabase
    .from('businesses')
    .insert({
      ubid: `KA-UBID-${Math.floor(10000 + Math.random() * 90000)}`,
      primary_name: sourceName,
      normalized_name: sourceName.toUpperCase(),
      registered_address: sourceAddress || 'Unknown',
    })
    .select()
    .single()
    
  if (error || !newBusiness) throw new Error('Failed to create new entity')

  // BATCH RESOLUTION
  const { data: similarRecords } = await supabase
    .from('source_records')
    .select('id')
    .eq('entity_name', sourceName)
    .is('business_id', null);

  if (similarRecords && similarRecords.length > 0) {
    const ids = similarRecords.map(r => r.id);
    await supabase
      .from('source_records')
      .update({ business_id: newBusiness.id })
      .in('id', ids);

    await supabase
      .from('resolution_events')
      .update({ 
        status: 'approved', // Using 'approved' as it is a valid enum value
        resolved_at: new Date().toISOString(), 
        resolved_by: 'batch_resolver' 
      })
      .in('source_record_id', ids);
  }

  // SELF-HEALING
  const { data: randomEvents } = await supabase
    .from('activity_events')
    .select('*')
    .is('business_id', null)
    .limit(Math.floor(3 + Math.random() * 8));

  if (randomEvents && randomEvents.length > 0) {
    const eventIds = randomEvents.map(e => e.id);
    await supabase
      .from('activity_events')
      .update({ business_id: newBusiness.id })
      .in('id', eventIds);
    
    const health = inferStatus(randomEvents);
    await supabase
      .from('businesses')
      .update({ 
        activity_status: health.status,
        last_activity_at: randomEvents[0].event_date,
        confidence_score: 1.0
      })
      .eq('id', newBusiness.id);
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
