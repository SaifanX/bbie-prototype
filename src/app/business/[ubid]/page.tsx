import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';
import BusinessClient from './BusinessClient';

export const dynamic = 'force-dynamic';

export default async function BusinessDetail({ params }: { params: { ubid: string } }) {
  const { ubid } = params;

  // 1. Fetch Primary Business Data
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('ubid', ubid)
    .single();

  if (!business) {
    notFound();
  }

  // 2. Fetch Linked Source Records
  const { data: linkedRecords } = await supabase
    .from('source_records')
    .select('*')
    .eq('business_id', business.id);

  // 3. Fetch Activity Events
  const { data: activityEvents } = await supabase
    .from('activity_events')
    .select('*')
    .eq('business_id', business.id)
    .order('event_date', { ascending: false });

  // 4. Fetch Resolution Confidence Breakdown
  const { data: resolution } = await supabase
    .from('resolution_events')
    .select('*')
    .eq('potential_business_id', business.id)
    .limit(1)
    .single();

  return (
    <BusinessClient 
      business={business}
      linkedRecords={linkedRecords || []}
      activityEvents={activityEvents || []}
      resolution={resolution}
    />
  );
}
