import { supabase } from './supabase';

export type AnomalyType = 'INCONSISTENT_ADDRESS' | 'SUSPICIOUS_INACTIVITY' | 'IDENTIFIER_COLLISION' | 'DEPT_MISMATCH';

export interface Anomaly {
  type: AnomalyType;
  severity: 'low' | 'medium' | 'high';
  description: string;
  evidence: any;
}

export async function detectAnomalies(businessId: string): Promise<Anomaly[]> {
  const anomalies: Anomaly[] = [];

  // 1. Fetch Business and all linked Source Records
  const { data: business } = await supabase
    .from('businesses')
    .select('*, source_records(*), activity_events(*)')
    .eq('id', businessId)
    .single();

  if (!business) return [];

  // Check 1: Inconsistent Address
  const sources = business.source_records || [];
  if (sources.length > 1) {
    const addresses = sources.map((s: any) => s.raw_data?.address?.toLowerCase() || '').filter(Boolean);
    const uniqueAddresses = new Set(addresses.map((a: string) => a.substring(0, 20))); // Check first 20 chars
    if (uniqueAddresses.size > 1) {
      anomalies.push({
        type: 'INCONSISTENT_ADDRESS',
        severity: 'medium',
        description: `Discrepancy detected across ${uniqueAddresses.size} government departments regarding registered location.`,
        evidence: { addresses }
      });
    }
  }

  // Check 2: Suspicious Inactivity
  const events = business.activity_events || [];
  if (events.length > 0) {
    const lastEvent = new Date(events[0].event_date);
    const eighteenMonthsAgo = new Date();
    eighteenMonthsAgo.setMonth(eighteenMonthsAgo.getMonth() - 18);

    if (lastEvent < eighteenMonthsAgo) {
      anomalies.push({
        type: 'SUSPICIOUS_INACTIVITY',
        severity: 'high',
        description: 'No verified compliance activity or inspection logs detected in the last 18 months.',
        evidence: { last_activity: events[0].event_date }
      });
    }
  } else {
    anomalies.push({
      type: 'SUSPICIOUS_INACTIVITY',
      severity: 'low',
      description: 'Business has zero recorded activity events in the intelligence timeline.',
      evidence: {}
    });
  }

  // Check 3: Identifier Collision (PAN/GSTIN shared by others)
  if (business.pan || business.gstin) {
    const { count } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .neq('id', businessId)
      .or(`pan.eq.${business.pan},gstin.eq.${business.gstin}`);

    if (count && count > 0) {
      anomalies.push({
        type: 'IDENTIFIER_COLLISION',
        severity: 'high',
        description: 'Critical: Business identifier (PAN/GSTIN) is already registered to another legal entity.',
        evidence: { duplicate_count: count }
      });
    }
  }

  return anomalies;
}
export async function getGlobalAnomalyStats() {
  // 1. Identifier Collisions: Find PANs shared by multiple UBIDs
  const { data: collisions } = await supabase
    .rpc('get_identifier_collisions'); // Using a custom RPC for performance if available, or fall back to:
  
  // Fallback if RPC isn't there:
  const { data: allBiz } = await supabase.from('businesses').select('pan, gstin');
  const panMap = new Map();
  let collisionCount = 0;
  allBiz?.forEach(b => {
    if (b.pan) {
      panMap.set(b.pan, (panMap.get(b.pan) || 0) + 1);
      if (panMap.get(b.pan) === 2) collisionCount++;
    }
  });

  // 2. Suspicious Inactivity: Dormant or Closed with 0 recent events
  const eighteenMonthsAgo = new Date();
  eighteenMonthsAgo.setMonth(eighteenMonthsAgo.getMonth() - 18);
  
  const { count: inactivityCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .or(`activity_status.eq.dormant,activity_status.eq.closed`);

  // 3. Address Mismatch: Businesses with rejected resolutions due to location
  const { count: addressMismatch } = await supabase
    .from('resolution_events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rejected')
    .ilike('feedback', '%address%');

  return {
    address_mismatch: addressMismatch || 0,
    suspicious_inactivity: inactivityCount || 0,
    identifier_collision: collisionCount || 0
  };
}
