'use client'

import { motion } from 'framer-motion'
import { FileText, ShieldCheck, AlertTriangle, Zap, Building2, Calendar } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface TimelineEvent {
  id: string;
  event_type: string;
  event_date: string;
  department: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
}

export default function ForensicTimeline({ events }: { events: TimelineEvent[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="p-10 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-950">
         <Calendar size={48} className="text-zinc-700 mx-auto mb-4" />
         <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">No activity events recorded</p>
      </div>
    )
  }

  return (
    <div className="relative pl-8 space-y-10 selection:bg-orange-500/30">
      {/* The Line */}
      <div className="absolute left-3 top-2 bottom-2 w-px bg-zinc-800" />

      {events.map((event, idx) => (
        <motion.div 
          key={event.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative group"
        >
          {/* The Dot */}
          <div className={cn(
            "absolute -left-[25px] w-4 h-4 rounded-full border-4 border-black z-10 transition-transform group-hover:scale-125",
            event.severity === 'high' ? "bg-red-500" : 
            event.severity === 'medium' ? "bg-orange-500" : "bg-orange-600"
          )} />

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl hover:bg-orange-500/[0.04] transition-all hover:border-orange-500/20 shadow-md">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center border",
                    event.severity === 'high' ? "bg-red-500/10 border-red-500/20 text-red-500" : 
                    "bg-orange-500/10 border-orange-500/20 text-orange-400"
                  )}>
                    {event.event_type.includes('FILING') ? <FileText size={16} /> : 
                     event.event_type.includes('INSPECTION') ? <ShieldCheck size={16} /> : <Zap size={16} />}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest italic">{event.event_type.replace('_', ' ')}</h4>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">{event.department}</span>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                    {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <span className="text-[8px] font-mono text-zinc-600 block">{new Date(event.event_date).toLocaleTimeString()}</span>
               </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              "{event.description}"
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
