import { supabase } from '@/utils/supabase';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // --- FETCH LIVE DATA FROM SUPABASE ---
  const { count: totalBusinesses } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true });

  const { count: activeRecords } = await supabase
    .from('source_records')
    .select('*', { count: 'exact', head: true })
    .not('business_id', 'is', null);

  const { count: pendingReviews } = await supabase
    .from('resolution_events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { data: recentEvents } = await supabase
    .from('resolution_events')
    .select(`
      id,
      match_score,
      status,
      created_at,
      source_records (
        id,
        entity_name,
        department
      )
    `)
    .order('created_at', { ascending: false })
    .limit(30);

  const { data: dirtyRecords } = await supabase
    .from('source_records')
    .select('id, entity_name, department')
    .is('business_id', null)
    .limit(30);

  const { count: activeCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const { count: dormantCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'dormant');

  const { count: closedCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'closed');

  const { count: anomalyCount } = await supabase
    .from('resolution_events')
    .select('*', { count: 'exact', head: true })
    .eq('is_anomaly', true);

  return (
    <DashboardClient 
      totalBusinesses={totalBusinesses}
      activeRecords={activeRecords}
      pendingReviews={pendingReviews}
      recentEvents={recentEvents}
      dirtyRecords={dirtyRecords}
      activeCount={activeCount}
      dormantCount={dormantCount}
      closedCount={closedCount}
      anomalyCount={anomalyCount}
    />
  );
}
