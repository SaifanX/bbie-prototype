'use server'

import { supabase } from '@/utils/supabase'
import { revalidatePath } from 'next/cache'



import { inferStatus } from '@/utils/inference'

export async function approveMerge(eventId: string, sourceRecordId: string, targetBusinessId: string) {
  // 1. Fetch current source record details for batch matching
  const { data: currentSource } = await supabase
    .from('source_records')
    .select('entity_name, pincode, raw_data')
    .eq('id', sourceRecordId)
    .single();

  // 2. Resolve the current event - Using 'approved' as it is a valid enum value
  await supabase
    .from('resolution_events')
    .update({ status: 'approved', resolved_at: new Date().toISOString(), resolved_by: 'human_reviewer' })
    .eq('id', eventId)

  await supabase
    .from('source_records')
    .update({ business_id: targetBusinessId, resolved: true })
    .eq('id', sourceRecordId)

  // 2.5 MASTER DATA ENRICHMENT: Update business if source has more info
  if (currentSource && currentSource.raw_data) {
    const { data: currentBusiness } = await supabase
      .from('businesses')
      .select('pan, gstin')
      .eq('id', targetBusinessId)
      .single();

    if (currentBusiness) {
      const updates: any = {};
      if (!currentBusiness.pan && currentSource.raw_data.pan) updates.pan = currentSource.raw_data.pan;
      if (!currentBusiness.gstin && currentSource.raw_data.gstin) updates.gstin = currentSource.raw_data.gstin;
      
      if (Object.keys(updates).length > 0) {
        await supabase.from('businesses').update(updates).eq('id', targetBusinessId);
      }
    }
  }

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
        .select('id, entity_name, pincode')
        .in('id', siblingSourceIds)
        .eq('entity_name', currentSource.entity_name)
        .eq('pincode', currentSource.pincode || ''); // Multi-factor anchor

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

  // 4. DETERMINISTIC HARVESTING: Link activity events by PAN/GSTIN
  const { data: business } = await supabase
    .from('businesses')
    .select('pan, gstin')
    .eq('id', targetBusinessId)
    .single();

  if (business) {
    const { data: linkedEvents } = await supabase
      .from('activity_events')
      .select('*')
      .or(`pan.eq.${business.pan},gstin.eq.${business.gstin}`)
      .is('business_id', null);

    if (linkedEvents && linkedEvents.length > 0) {
      const eventIds = linkedEvents.map(e => e.id);
      await supabase
        .from('activity_events')
        .update({ business_id: targetBusinessId })
        .in('id', eventIds);
      
      const health = inferStatus(linkedEvents);
      await supabase
        .from('businesses')
        .update({ 
          activity_status: health.status,
          confidence_score: 1.0, 
          last_activity_at: linkedEvents[0].event_date 
        })
        .eq('id', targetBusinessId)
    }
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

  // BATCH RESOLUTION: Only auto-resolve if Name AND Pincode match
  const { data: similarRecords } = await supabase
    .from('source_records')
    .select('id')
    .eq('entity_name', sourceName)
    .eq('pincode', newBusiness.pincode || '') // Multi-factor anchor
    .is('business_id', null);

  if (similarRecords && similarRecords.length > 0) {
    const ids = similarRecords.map(r => r.id);
    await supabase
      .from('source_records')
      .update({ business_id: newBusiness.id, resolved: true })
      .in('id', ids);

    await supabase
      .from('resolution_events')
      .update({ 
        status: 'approved',
        resolved_at: new Date().toISOString(), 
        resolved_by: 'batch_resolver' 
      })
      .in('source_record_id', ids);
  }

  // DETERMINISTIC HARVESTING: Link activity events by PAN/GSTIN
  if (newBusiness.pan || newBusiness.gstin) {
    const { data: linkedEvents } = await supabase
      .from('activity_events')
      .select('*')
      .or(`pan.eq.${newBusiness.pan},gstin.eq.${newBusiness.gstin}`)
      .is('business_id', null);

    if (linkedEvents && linkedEvents.length > 0) {
      const eventIds = linkedEvents.map(e => e.id);
      await supabase
        .from('activity_events')
        .update({ business_id: newBusiness.id })
        .in('id', eventIds);
      
      const health = inferStatus(linkedEvents);
      await supabase
        .from('businesses')
        .update({ 
          activity_status: health.status,
          last_activity_at: linkedEvents[0].event_date,
          confidence_score: 1.0
        })
        .eq('id', newBusiness.id);
    }
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
