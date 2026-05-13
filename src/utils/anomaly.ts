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
