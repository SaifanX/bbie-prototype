'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Building2, AlertTriangle, Layers, Zap, Shield, Cpu, ExternalLink, ArrowUpRight, ArrowDownRight, Radio, Fingerprint, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatNumber = (num: number | null) => {
  return num !== null ? new Intl.NumberFormat('en-IN').format(num) : '0';
};

export default function DashboardClient({ 
  totalBusinesses, 
  activeRecords, 
  pendingReviews, 
  recentEvents,
  dirtyRecords,
  activeCount = 0,
  dormantCount = 0,
  closedCount = 0,
  anomalyCount = 0
}: any) {
  const [isSystemInitialized, setIsSystemInitialized] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);

  const DISPLAY_DIRTY = dirtyRecords || [];

  return (
    <div className="p-10 space-y-10 min-h-screen relative overflow-y-auto">
      
      {/* Cinematic Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 z-10 relative"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={cn("absolute inset-0 rounded-full blur-[4px] animate-pulse", isSystemInitialized ? "bg-emerald-500" : "bg-amber-500")} />
              <div className={cn("relative w-2 h-2 rounded-full", isSystemInitialized ? "bg-emerald-500" : "bg-amber-500")} />
            </div>
            <span className={cn("text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-sm", isSystemInitialized ? "text-emerald-500" : "text-amber-500")}>
              {isSystemInitialized ? "Updating Information" : "Waiting for Update"}
            </span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">Business<br/>Registry</h1>
          <p className="text-slate-500 font-medium max-w-lg">The main place to see and verify business information across the country.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="glass-card px-8 py-4 text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all border-white/5 bg-white/[0.02]">
            Log Version 4.2
          </button>
          {!isSystemInitialized && (
            <Link 
              href="/simulator"
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 group"
            >
              <span className="flex items-center gap-3">
                 Start Updating <Radio size={16} className="group-hover:animate-pulse" />
              </span>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 z-10 relative">
        <MetricCard 
          title="Total Businesses" 
          value={formatNumber(totalBusinesses)} 
          icon={<Building2 size={20} />} 
          color="indigo" 
          trend="+12% from last month"
          isUp={true}
        />
        <MetricCard 
          title="Active" 
          value={formatNumber(activeCount)} 
          icon={<Zap size={20} />} 
          color="emerald" 
          trend="High confidence"
        />
        <MetricCard 
          title="Dormant" 
          value={formatNumber(dormantCount)} 
          icon={<Activity size={20} />} 
          color="amber" 
          trend="Requires scan"
        />
        <MetricCard 
          title="Closed" 
          value={formatNumber(closedCount)} 
          icon={<Shield size={20} />} 
          color="rose" 
          trend="Verified exit"
        />
        <MetricCard 
          title="Pending Review" 
          value={formatNumber(pendingReviews)} 
          icon={<Layers size={20} />} 
          color="blue" 
          trend="Human in loop"
        />
        <MetricCard 
          title="Anomalies" 
          value={formatNumber(anomalyCount)} 
          icon={<AlertTriangle size={20} />} 
          color="orange" 
          trend="Critical priority"
          isDown={anomalyCount > 0}
        />
      </div>

      {/* Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10 relative">
        <div className="lg:col-span-2 glass-card p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Resolution Confidence Distribution</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">AI Match Accuracy over time</p>
            </div>
            <div className="flex gap-2">
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                 <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Target: 98%</span>
               </div>
            </div>
          </div>
          
          <div className="h-48 w-full flex items-end gap-2 px-2">
            {[45, 67, 89, 45, 67, 98, 76, 54, 89, 92, 95, 88, 91, 94, 96].map((val, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ delay: 0.5 + (i * 0.05), duration: 1 }}
                className={cn(
                  "flex-1 rounded-t-sm transition-colors",
                  val > 90 ? "bg-indigo-500" : val > 70 ? "bg-indigo-500/60" : "bg-indigo-500/30"
                )}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
             <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg Confidence</span>
                  <span className="text-xl font-black text-white">92.4%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">False Positives</span>
                  <span className="text-xl font-black text-emerald-500">0.02%</span>
                </div>
             </div>
             <button className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2">
               Full Report <ArrowRight size={12} />
             </button>
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col gap-6 border-orange-500/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Active Anomalies</h3>
            <AlertTriangle className="text-orange-500" size={20} />
          </div>
          
          <div className="space-y-4">
            <AnomalyItem 
              type="Duplicate PAN" 
              entity="Ravi Trading Co." 
              severity="high" 
            />
            <AnomalyItem 
              type="Address Mismatch" 
              entity="Gopal Sweets" 
              severity="medium" 
            />
            <AnomalyItem 
              type="Status Conflict" 
              entity="Blue Star Ind." 
              severity="medium" 
            />
          </div>
          
          <button className="w-full py-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-[10px] font-black text-orange-500 uppercase tracking-widest hover:bg-orange-500/20 transition-all mt-auto">
            Review All Anomalies
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="z-10 relative">
        <div className="flex flex-col gap-6 pb-20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl border flex items-center justify-center",
                totalBusinesses === 0 ? "bg-amber-500/10 border-amber-500/20" : "bg-indigo-500/10 border-indigo-500/20"
              )}>
                 {totalBusinesses === 0 ? <AlertTriangle className="text-amber-500" size={20} /> : <Building2 className="text-indigo-400" size={20} />}
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                  {totalBusinesses === 0 ? "Pending Identity Resolution" : "Business Review Feed"}
                </h2>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  {totalBusinesses === 0 ? "30+ Fragmented Signals Detected" : "Server Location: KA-01"}
                </span>
              </div>
            </div>
            {totalBusinesses === 0 && (
              <Link 
                href="/simulator"
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-2 group"
              >
                Initialize Cleanup <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {(totalBusinesses === 0 ? dirtyRecords : recentEvents)?.map((event: any, i: number) => (
              <ResolutionCard 
                key={event.id}
                event={event}
                isDirty={totalBusinesses === 0}
                delay={0.1 + (i * 0.05)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResolutionCard({ event, delay, isDirty }: any) {
  const source = event.source_records || event;
  const score = Math.round((event.match_score || 0.45) * 100);
  const businessName = source.entity_name || '';
  
  // Navigate to search with pre-filled query and correct filter
  const searchUrl = `/search?q=${encodeURIComponent(businessName)}&filter=${isDirty ? 'unresolved' : 'resolved'}`;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "glass-card flex flex-col gap-6 group cursor-pointer transition-all relative overflow-hidden",
        isDirty ? "border-amber-500/10 grayscale-[0.5]" : "hover:border-indigo-500/40"
      )}
    >
      <Link href={searchUrl} className="p-6 flex flex-col h-full w-full gap-6">
        <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/[0.02] transition-colors pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
             <div className={cn("w-1.5 h-1.5 rounded-full", isDirty ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]" : "bg-indigo-500 shadow-[0_0_8px_#6366f1]")} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
               {isDirty ? "RAW SOURCE" : "VERIFIED"}
             </span>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm transition-all", 
            isDirty 
              ? "bg-amber-500/10 border-amber-500/30 shadow-amber-500/5" 
              : "bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/5"
          )}>
            {isDirty && <AlertTriangle size={12} className="text-amber-500 animate-pulse" />}
            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", isDirty ? "text-amber-500" : "text-indigo-400")}>
              {isDirty ? "UNRESOLVED" : `${score}% MATCH`}
            </span>
          </div>
        </div>
        
        <div className="relative z-10">
          <h4 className={cn(
            "font-black truncate text-base uppercase tracking-tight transition-colors leading-none",
            isDirty ? "text-slate-400" : "text-white group-hover:text-indigo-400"
          )}>
             {source.entity_name}
          </h4>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[9px] font-black px-2 py-0.5 rounded bg-white/5 text-slate-500 border border-white/5 uppercase tracking-tighter">
              {(source.department || 'GOVT_SOURCE').replace('_', ' ')}
            </span>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              {isDirty ? "Received Data" : "System Record"}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
          <div className="flex-1 max-w-[120px]">
             <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: isDirty ? "15%" : `${score}%` }}
                 transition={{ delay: delay + 0.2, duration: 1 }}
                 className={cn("h-full", isDirty ? "bg-amber-600/40" : "bg-gradient-to-r from-indigo-600 to-indigo-400")} 
               />
             </div>
          </div>
          {isDirty ? (
            <div className="flex items-center gap-2">
               <Radio size={12} className="text-amber-500/50" />
               <span className="text-[9px] font-black text-amber-500/60 uppercase tracking-widest">Fragmented Signal</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">View Details</span>
              <ExternalLink size={14} className="text-indigo-400" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
function MetricCard({ title, value, icon, color, trend, isUp, isDown }: any) {
  const colorMap: any = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 flex flex-col gap-4 border-white/5 hover:border-white/10 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", colorMap[color])}>
          {icon}
        </div>
        {isUp && <ArrowUpRight className="text-emerald-500 opacity-50" size={16} />}
        {isDown && <ArrowDownRight className="text-rose-500 opacity-50" size={16} />}
      </div>
      <div>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h3>
        <div className="text-3xl font-black text-white tracking-tighter mt-1">{value}</div>
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-2">{trend}</p>
      </div>
    </motion.div>
  );
}

function AnomalyItem({ type, entity, severity }: any) {
  return (
    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          severity === 'high' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-orange-500 shadow-[0_0_8px_#f97316]'
        )} />
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white uppercase tracking-tight">{type}</span>
          <span className="text-[9px] font-medium text-slate-500 uppercase truncate max-w-[120px]">{entity}</span>
        </div>
      </div>
      <ArrowRight size={12} className="text-slate-600 group-hover:text-white transition-colors" />
    </div>
  );
}
