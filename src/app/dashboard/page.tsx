import { supabase } from '@/utils/supabase';
import DashboardClient from '../DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
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
    .eq('resolved', false)
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
    .eq('status', 'rejected');

  const { data: anomalyList } = await supabase
    .from('resolution_events')
    .select(`
      id,
      status,
      feedback,
      source_records (
        entity_name
      )
    `)
    .eq('status', 'rejected')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: scoreStream } = await supabase
    .from('resolution_events')
    .select('match_score')
    .order('created_at', { ascending: false })
    .limit(15);

  const { count: unresolvedCount } = await supabase
    .from('source_records')
    .select('*', { count: 'exact', head: true })
    .eq('resolved', false);

  return (
    <DashboardClient 
      totalBusinesses={totalBusinesses}
      activeRecords={activeRecords}
      pendingReviews={pendingReviews}
      recentEvents={recentEvents}
      dirtyRecords={dirtyRecords}
      unresolvedCount={unresolvedCount}
      activeCount={activeCount}
      dormantCount={dormantCount}
      closedCount={closedCount}
      anomalyCount={anomalyCount}
      anomalyList={anomalyList || []}
      scoreStream={scoreStream?.map(s => Math.round((s.match_score || 0.45) * 100)) || []}
    />
  );
}
