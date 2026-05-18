import { Users, AlertOctagon, ShieldAlert, Cpu, Zap, Fingerprint } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import ReviewWorkspace from './ReviewWorkspace';

export const dynamic = 'force-dynamic';

export default async function HumanReviewPage() {

  const { data: rawEvents } = await supabase
    .from('resolution_events')
    .select('id, match_score, ai_reasoning, source_record_id, potential_business_id')
    .eq('status', 'pending');

  const { data: allSources } = await supabase
    .from('source_records')
    .select('*');

  const { data: allBusinesses } = await supabase
    .from('businesses')
    .select('*');

  const pendingEvents = (rawEvents || []).map(event => {
    const source = (allSources || []).find(s => s.id === event.source_record_id);
    const business = (allBusinesses || []).find(b => b.id === event.potential_business_id);

    if (!source) return null;

    return {
      id: event.id,
      score: Math.round((event.match_score || 0.45) * 100),
      ai_reasoning: event.ai_reasoning || "AI Arbitration required for ambiguous field alignment.",
      source: {
        id: source.id,
        entity_name: source.entity_name || 'Unknown Entity',
        department: source.department || 'GOVT_SOURCE',
        address: source.address || source.raw_data?.address || 'Address Pending',
        pincode: source.pincode || '',
        gstin: source.gstin || source.raw_data?.gstin || 'N/A',
        pan: source.pan || source.raw_data?.pan || 'N/A'
      },
      target: business ? {
        id: business.id,
        ubid: business.ubid || 'UBID-PENDING',
        primary_name: business.name || 'Unknown Business',
        address: business.address || 'Address Pending',
        pincode: business.pincode || '',
        gstin: business.gstin || 'N/A',
        pan: business.pan || 'N/A'
      } : null,
      matched_fields: ['Tax_ID']
    };
  }).filter(Boolean) as any[];

  const { data: unresolvedRecords } = await supabase
    .from('source_records')
    .select('*')
    .eq('resolved', false);

  return (
    <div className="p-10 min-h-screen w-full bg-[#09090b] text-zinc-100 flex flex-col gap-10 relative overflow-y-auto selection:bg-orange-500/30">
      
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] pointer-events-none">
        <Users size={400} className="text-orange-500" />
      </div>

      <div className="flex justify-between items-end z-10 border-b border-zinc-800 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Fingerprint size={14} className="text-orange-500" />
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em]">Protocol.Human_Verification</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">Review Workspace</h1>
          <p className="text-zinc-500 font-bold max-w-lg mt-2 uppercase text-[11px] tracking-widest opacity-80">
            Manual adjudication of identity resolution conflicts.
          </p>
        </div>
        
        <div className="bg-orange-500/10 border border-orange-500/20 px-8 py-5 rounded-[24px] flex items-center gap-6 shadow-xl shadow-orange-500/10">
           <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Queue Load</span>
              <span className="text-2xl font-black text-orange-500 italic tracking-tighter">
                {pendingEvents.length} CONFLICTS
              </span>
           </div>
           <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <AlertOctagon size={24} className="text-orange-500 animate-pulse" />
           </div>
        </div>
      </div>
 
      <div className="flex-1 min-h-0 z-10">
        <ReviewWorkspace initialEvents={pendingEvents} unresolvedRecords={unresolvedRecords || []} />
      </div>
    </div>
  );
}
