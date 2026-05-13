import { Users, AlertOctagon, ShieldAlert, Cpu } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import ReviewWorkspace from './ReviewWorkspace';
import { calculateMatch } from '@/utils/matcher';

export const dynamic = 'force-dynamic';

export default async function HumanReviewPage() {


  const { data: rawEvents, error } = await supabase
    .from('resolution_events')
    .select(`
      id,
      match_score,
      ai_reasoning,
      source_records!inner (
        id,
        entity_name,
        department,
        raw_data
      ),
      businesses!potential_business_id (
        id,
        ubid,
        primary_name,
        registered_address,
        gstin,
        pan
      )
    `)
    .eq('status', 'pending');

  if (error) {
    console.error("Error fetching resolution events:", error);
  }

  const { data: unresolvedRecords } = await supabase
    .from('source_records')
    .select('id, entity_name, department, raw_data')
    .is('business_id', null);

  const pendingEvents = (rawEvents || []).map((event: any) => {
    const sourceData = {
      entity_name: event.source_records.entity_name,
      pan: event.source_records.raw_data?.pan || null,
      gstin: event.source_records.raw_data?.gstin || null,
      registered_address: event.source_records.raw_data?.address || null
    };

    const targetData = {
      primary_name: event.businesses.primary_name,
      pan: event.businesses.pan || null,
      gstin: event.businesses.gstin || null,
      registered_address: event.businesses.registered_address || null
    };

    const matchInfo = calculateMatch(sourceData, targetData);

    return {
      id: event.id,
      score: Math.round(matchInfo.score * 100),
      ai_reasoning: matchInfo.reasoning.join(". ") || event.ai_reasoning,
      matched_fields: matchInfo.matchedFields,
      source: {
        id: event.source_records.id,
        entity_name: event.source_records.entity_name,
        department: event.source_records.department,
        address: event.source_records.raw_data?.address || 'Address not extracted',
        gstin: event.source_records.raw_data?.gstin || 'N/A',
        pan: event.source_records.raw_data?.pan || 'N/A',
      },
      target: {
        id: event.businesses.id,
        ubid: event.businesses.ubid,
        primary_name: event.businesses.primary_name,
        address: event.businesses.registered_address,
        gstin: event.businesses.gstin || 'N/A',
        pan: event.businesses.pan || 'N/A',
      }
    };
  });

  return (
    <div className="p-10 space-y-10 min-h-screen relative overflow-y-auto">
      
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 p-10 opacity-5 pointer-events-none">
        <Users size={300} className="text-amber-500" />
      </div>

      <div className="flex justify-between items-end z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={14} className="text-amber-500" />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Manual Data Verification</span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Verification Workspace</h1>
          <p className="text-slate-500 font-medium">Resolve business identity mismatches identified by the Verification Engine.</p>
        </div>
        
        <div className="glass-card bg-amber-500/5 border-amber-500/20 px-6 py-3 flex items-center gap-4">
           <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Queue Status</span>
              <span className="text-xl font-black text-amber-500">{(pendingEvents.length + (unresolvedRecords?.length || 0))} PENDING</span>
           </div>
           <AlertOctagon size={24} className="text-amber-500 animate-pulse" />
        </div>
      </div>
 
      <div className="flex-1 min-h-0 z-10">
        <ReviewWorkspace initialEvents={pendingEvents} unresolvedRecords={unresolvedRecords || []} />
      </div>
    </div>
  );
}
