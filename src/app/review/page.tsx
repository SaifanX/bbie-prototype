import { Users, AlertOctagon, ShieldAlert, Cpu, Zap, Fingerprint } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import ReviewWorkspace from './ReviewWorkspace';
import { calculateMatch } from '@/utils/matcher';

export const dynamic = 'force-dynamic';

export default async function HumanReviewPage() {


  const { data: rawEvents } = await supabase
    .from('resolution_events')
    .select(`
      id,
      match_score,
      ai_reasoning,
      source_record_id,
      potential_business_id
    `)
    .eq('status', 'pending');


  const { data: unresolvedRecords } = await supabase
    .from('source_records')
    .select('id, entity_name, department, pincode, raw_data')
    .is('business_id', null);

  const pendingEvents: any[] = [];


  return (
    <div className="p-10 min-h-screen w-full bg-[#08080a] text-slate-100 flex flex-col gap-10 relative overflow-y-auto">
      
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] pointer-events-none">
        <Users size={400} className="text-orange-500" />
      </div>

      <div className="flex justify-between items-end z-10 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Fingerprint size={14} className="text-orange-500" />
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em]">Protocol.Human_Verification</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">Review Workspace</h1>
          <p className="text-slate-500 font-bold max-w-lg mt-2 uppercase text-[11px] tracking-widest opacity-80">
            Manual adjudication of identity resolution conflicts.
          </p>
        </div>
        
        <div className="bg-orange-600/5 border border-orange-600/20 px-8 py-5 rounded-[24px] flex items-center gap-6 backdrop-blur-3xl shadow-[0_20px_50px_rgba(234,88,12,0.1)]">
           <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Queue Load</span>
              <span className="text-2xl font-black text-orange-500 italic tracking-tighter">
                {(pendingEvents.length + (unresolvedRecords?.length || 0))} CONFLICTS
              </span>
           </div>
           <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center border border-orange-600/20">
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
