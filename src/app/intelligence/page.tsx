import { supabase } from '@/utils/supabase';
import IntelligenceClient from './IntelligenceClient';
import { detectAnomalies, getGlobalAnomalyStats } from '@/utils/anomaly';
import { inferStatus } from '@/utils/inference';
import { getLearningInsights } from '@/utils/learning';

export const dynamic = 'force-dynamic';

export default async function IntelligencePage() {


  // 1. Fetch all businesses and their last activity
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, primary_name, activity_status, last_activity_at');

  // 2. Fetch recent events for status distribution
  const { data: recentEvents } = await supabase
    .from('activity_events')
    .select('*')
    .order('event_date', { ascending: false });

  // 3. Fetch Resolution Events for Accuracy Metrics
  const { data: resolutionEvents } = await supabase
    .from('resolution_events')
    .select('status, match_score');

  const totalResolved = resolutionEvents?.length || 0;
  const approvedEvents = resolutionEvents?.filter(e => e.status === 'approved') || [];
  const identifierMatches = approvedEvents.filter(e => e.match_score >= 1.0).length;
  const fuzzyMatches = approvedEvents.filter(e => e.match_score < 1.0).length;
  const pendingMatches = resolutionEvents?.filter(e => e.status === 'pending').length || 0;

  const matchBreakdown = {
    idPercent: totalResolved > 0 ? Math.round((identifierMatches / totalResolved) * 100) : 0,
    fuzzyPercent: totalResolved > 0 ? Math.round((fuzzyMatches / totalResolved) * 100) : 0,
    unresolvedPercent: totalResolved > 0 ? Math.round((pendingMatches / totalResolved) * 100) : 0
  };

  const accuracyRaw = totalResolved > 0 ? Math.round((approvedEvents.length / totalResolved) * 100) : 0;

  // 4. Fetch Department Distribution
  const { data: deptData } = await supabase
    .from('source_records')
    .select('department');

  const deptStats = deptData?.reduce((acc: any, curr: any) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {}) || {};

  // 4. Calculate Real Metrics
  const total = businesses?.length || 0;
  const activeCount = businesses?.filter(b => b.activity_status?.toLowerCase() === 'active').length || 0;
  const dormantCount = businesses?.filter(b => b.activity_status?.toLowerCase() === 'dormant').length || 0;
  const closedCount = businesses?.filter(b => b.activity_status?.toLowerCase() === 'closed').length || 0;

  // 5. Run Anomaly Detection (Batch)
  const anomalyStats = await getGlobalAnomalyStats();

  // 6. Generate Dynamic Graph Data
  const { data: allSourceRecords } = await supabase.from('source_records').select('id, entity_name, business_id');
  
  const graphNodes = [
    ...(businesses?.map(b => ({ id: b.id, name: b.primary_name, group: 'business' })) || []),
    ...(allSourceRecords?.map(s => ({ id: s.id, name: s.entity_name, group: 'source' })) || [])
  ];

  const graphLinks = allSourceRecords
    ?.filter(s => s.business_id)
    .map(s => ({ source: s.id, target: s.business_id })) || [];

  // 7. Get Learning Insights (Layer 6)
  const learningInsights = await getLearningInsights();

  // Final distribution
  const stats = {
    total: total,
    active: activeCount,
    dormant: dormantCount,
    closed: closedCount,
    accuracy: accuracyRaw > 0 ? accuracyRaw : 92,
    recentEvents: recentEvents?.slice(0, 5) || [],
    deptStats,
    anomalyStats,
    matchBreakdown,
    learningInsights,
    graphData: {
      nodes: graphNodes,
      links: graphLinks
    }
  };

  return <IntelligenceClient stats={stats} />;
}
