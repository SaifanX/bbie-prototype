'use client'

import { motion } from 'framer-motion'
import { Zap, FileCheck, Search, RefreshCcw, Calendar, CheckCircle2 } from 'lucide-react'
import { cn } from '@/utils/cn';

interface Event {
  id: string;
  event_type: string;
  event_date: string;
  department: string;
  metadata: any;
}

export default function ActivityTimeline({ events }: { events: Event[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass-card bg-white/[0.02] border-white/5">
        <Calendar size={48} className="text-slate-700 mb-4" />
        <p className="text-slate-500 font-medium">No activity events detected for this period.</p>
      </div>
    )
  }

  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );

  return (
    <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-orange-500 before:via-orange-500/20 before:to-transparent">
      {sortedEvents.map((event, idx) => (
        <motion.div 
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="relative"
        >
          {/* Timeline Dot */}
          <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-black border-2 border-orange-500 flex items-center justify-center z-10">
             <EventIcon type={event.event_type} />
          </div>

          <div className="glass-card bg-white/[0.03] border-white/5 p-5 hover:bg-orange-500/[0.04] transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">{event.event_type.replace('_', ' ')}</span>
                 <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors uppercase tracking-tight italic">
                   {event.department.replace('_', ' ')} Update
                 </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5" suppressHydrationWarning>
                {new Date(event.event_date).toLocaleDateString('en-GB')}
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {event.metadata?.description || `Activity detected in ${event.department} systems.`}
            </p>

            {event.metadata?.confidence && (
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-orange-500" style={{ width: `${event.metadata.confidence * 100}%` }} />
                </div>
                <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{Math.round(event.metadata.confidence * 100)}% INTEGRITY</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function EventIcon({ type }: { type: string }) {
  switch (type) {
    case 'gst_filing': return <FileCheck size={12} className="text-orange-400" />
    case 'inspection': return <Search size={12} className="text-orange-400" />
    case 'utility_usage': return <Zap size={12} className="text-orange-400" />
    case 'renewal': return <RefreshCcw size={12} className="text-orange-400" />
    default: return <CheckCircle2 size={12} className="text-orange-400" />
  }
}
