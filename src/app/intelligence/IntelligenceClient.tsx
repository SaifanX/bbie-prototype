'use client'

import { motion } from 'framer-motion'
import { Activity, BarChart3, PieChart, TrendingUp, Download, Database, Globe, Calendar } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import ActivityTimeline from '@/components/ActivityTimeline';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function IntelligenceClient({ stats }: any) {
  return (
    <div className="p-10 space-y-10 min-h-screen relative overflow-y-auto">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <Activity size={300} className="text-indigo-500" />
      </div>

      <div className="flex justify-between items-end z-10 relative">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Business Reports</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Registry Reports</h1>
          <p className="text-slate-500 mt-2 font-medium">View how the business directory is growing and being updated in real-time.</p>
        </div>
        <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 active:scale-95">
          <Download size={18} /> Download Full Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative">
        
        {/* Activity Distribution - 8 Cols */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 glass-card p-8 flex flex-col"
        >
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <BarChart3 size={24} className="text-indigo-500" /> Activity Pulse
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Real-time classification of {stats.total} businesses based on event stream decay.</p>
            </div>
            <div className="glass-card bg-emerald-500/10 border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-xs font-black flex items-center gap-2">
              <TrendingUp size={14} /> LIVE ENGINE
            </div>
          </div>
          
          <div className="h-80 flex items-end justify-between gap-12 px-8 mb-4">
            <Bar height={`${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%`} label="ACTIVE" value={stats.active} active />
            <Bar height={`${stats.total > 0 ? (stats.dormant / stats.total) * 100 : 0}%`} label="DORMANT" value={stats.dormant} />
            <Bar height={`${stats.total > 0 ? (stats.closed / stats.total) * 100 : 0}%`} label="CLOSED" value={stats.closed} />
          </div>
        </motion.div>

        {/* Resolution Accuracy - 4 Cols */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 glass-card p-8 flex flex-col items-center"
        >
          <div className="w-full mb-10">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <PieChart size={24} className="text-indigo-500" /> Match Quality
            </h2>
          </div>
          
          <div className="relative w-56 h-56 rounded-full flex items-center justify-center mb-10 group">
            <div className="absolute inset-0 rounded-full border-[20px] border-white/5" />
            <svg className="w-full h-full -rotate-90 transform">
              <circle cx="112" cy="112" r="92" fill="transparent" stroke="#6366f1" strokeWidth="20" strokeDasharray="578" strokeDashoffset={578 - (578 * stats.accuracy / 100)} strokeLinecap="round" className="opacity-80 group-hover:opacity-100 transition-all duration-1000" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white tracking-tighter">{stats.accuracy}%</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Confidence</span>
            </div>
          </div>

          <div className="w-full space-y-4">
            <LegendItem color="bg-indigo-500" label="IDENTIFIER MATCHES" value="82%" />
            <LegendItem color="bg-emerald-500" label="FUZZY MATCHES" value="14%" />
            <LegendItem color="bg-amber-500" label="UNRESOLVED" value="4%" />
          </div>
        </motion.div>

        {/* Recent Activity Feed - 12 Cols */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-12 glass-card p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Calendar size={24} className="text-indigo-500" /> Global Event Stream
            </h2>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Processing Live Feed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
               <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Recent System Signals</p>
               <ActivityTimeline events={stats.recentEvents} />
            </div>
            <div className="space-y-6">
               <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Source Distribution (Records per Dept)</p>
               <div className="h-64 flex items-end justify-between gap-4 glass-card p-6 border-white/5">
                 {Object.entries(stats.deptStats || {}).map(([dept, count]: any) => (
                   <div key={dept} className="flex flex-col items-center gap-2 flex-1 group h-full">
                     <div className="relative w-full flex-1 flex flex-col justify-end">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${((count as number) / 30) * 100}%` }}
                         className="w-full bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-lg transition-all relative overflow-hidden"
                       >
                         <div className="absolute top-1 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-[8px] font-mono text-white">{count}</span>
                         </div>
                       </motion.div>
                     </div>
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter truncate w-full text-center">
                       {dept.replace('_', ' ')}
                     </span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function Bar({ height, label, value, active = false }: any) {
  return (
    <div className="flex flex-col items-center gap-4 flex-1 group">
      <div className="relative w-full flex-1 flex flex-col justify-end">
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            "w-full rounded-xl transition-all relative overflow-hidden group",
            active 
              ? "bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]" 
              : "bg-white/5 group-hover:bg-white/10"
          )}
        >
          {active && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />}
          <div className="absolute top-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-[10px] font-mono font-black text-white">{value}</span>
          </div>
        </motion.div>
      </div>
      <span className={cn(
        "text-[10px] font-black tracking-widest transition-colors",
        active ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400"
      )}>
        {label}
      </span>
    </div>
  );
}

function LegendItem({ color, label, value }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={cn("w-2 h-2 rounded-full", color)}></div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-200 transition-colors">{label}</span>
      </div>
      <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-white transition-colors">{value}</span>
    </div>
  );
}

function DeptHealthCard({ name, status, latency, warning = false }: any) {
  return (
    <div className={cn(
      "glass-card p-4 flex flex-col justify-between group hover:-translate-y-1 transition-all",
      warning ? "border-amber-500/20 bg-amber-500/5" : "border-white/5"
    )}>
      <div className="flex justify-between items-start mb-4">
         <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{name}</span>
            <div className="flex items-center gap-1.5">
              <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", warning ? "bg-amber-500" : "bg-emerald-500")} />
              <span className={cn("text-[9px] font-black uppercase", warning ? "text-amber-500" : "text-emerald-500")}>
                {status}
              </span>
            </div>
         </div>
         <Database size={12} className={cn(warning ? "text-amber-500" : "text-indigo-400")} />
      </div>
      <div className="text-right">
        <div className={cn("text-xs font-mono font-bold", warning ? "text-amber-400" : "text-indigo-400")}>{latency}</div>
      </div>
    </div>
  );
}
