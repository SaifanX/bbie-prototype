'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Building2, AlertTriangle, Layers, Zap, Shield, Cpu, ExternalLink, ArrowUpRight, ArrowDownRight, Radio, Fingerprint, ArrowRight, Database, Disc } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import GlobalActionHistory from '@/components/GlobalActionHistory';

const formatNumber = (num: number | null) => {
  return num !== null ? new Intl.NumberFormat('en-IN').format(num) : '0';
};

export default function DashboardClient({ 
  totalBusinesses, 
  activeRecords, 
  pendingReviews, 
  recentEvents,
  dirtyRecords,
  unresolvedCount = 0,
  activeCount = 0,
  dormantCount = 0,
  closedCount = 0,
  anomalyCount = 0,
  anomalyList = [],
  scoreStream = []
}: any) {
  const isSystemInitialized = totalBusinesses > 0;
  const fragmentCount = unresolvedCount;
  
  const avgConfidence = scoreStream.length > 0 
    ? (scoreStream.reduce((a: number, b: number) => a + b, 0) / scoreStream.length).toFixed(1)
    : "0.0";

  return (
    <div className="p-10 space-y-10 min-h-screen relative overflow-y-auto bg-[#09090b] text-zinc-100 selection:bg-orange-500/30">
      
      {/* Cinematic Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 z-10 relative border-b border-zinc-800 pb-10"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={cn("relative w-2 h-2 rounded-full", isSystemInitialized ? "bg-orange-500" : "bg-orange-900")} />
            </div>
            <span className={cn("text-[10px] font-black uppercase tracking-[0.4em]", isSystemInitialized ? "text-orange-500" : "text-orange-700")}>
              {isSystemInitialized ? "Registry Operational" : "Cold Start: Signals Detected"}
            </span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">Master<br/><span className="text-orange-500">Registry</span></h1>
          <p className="text-zinc-400 font-medium max-w-lg mt-4">Unified business intelligence across {formatNumber(fragmentCount)} fragmented data signals.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-zinc-950 px-8 py-4 text-xs font-black text-zinc-500 uppercase tracking-widest border border-zinc-800 rounded-2xl flex items-center gap-2 shadow-lg">
            <Disc size={14} className="text-orange-500 animate-spin-slow" /> System Sync: 100%
          </div>
          {!isSystemInitialized && (
            <Link 
              href="/live-resolution"
              className="px-10 py-4 bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-500 transition-all active:scale-95 group shadow-lg shadow-orange-500/20"
            >
              <span className="flex items-center gap-3">
                 Fire Resolution Engine <Radio size={16} />
              </span>
            </Link>
          )}
        </div>
      </motion.div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 z-10 relative">
        <MetricCard 
          title="Master Entities" 
          value={formatNumber(totalBusinesses)} 
          icon={<Building2 size={20} />} 
          color="orange" 
          trend={isSystemInitialized ? "Verified Identities" : "Awaiting Engine Run"}
        />
        <MetricCard 
          title="Source Fragments" 
          value={formatNumber(fragmentCount)} 
          icon={<Database size={20} />} 
          color="grey" 
          trend="Total Input Signals"
        />
        <MetricCard 
          title="Active Status" 
          value={formatNumber(activeCount)} 
          icon={<Zap size={20} />} 
          color="orange" 
          trend="Live Operations"
        />
        <MetricCard 
          title="Anomaly Flags" 
          value={formatNumber(anomalyCount)} 
          icon={<AlertTriangle size={20} />} 
          color="grey" 
          trend="Identity Conflicts"
        />
        <MetricCard 
          title="Triage Queue" 
          value={formatNumber(pendingReviews)} 
          icon={<Layers size={20} />} 
          color="orange" 
          trend="Pending Validation"
        />
        <MetricCard 
          title="System Trust" 
          value={isSystemInitialized ? `${avgConfidence}%` : "0.0%"} 
          icon={<Shield size={20} />} 
          color="grey" 
          trend="Engine Confidence"
        />
      </div>

      {/* Global Action History Banner */}
      <div className="z-10 relative">
        <GlobalActionHistory />
      </div>

      {/* Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10 relative">
        <div className="lg:col-span-2 bg-[#121215] border border-zinc-800 rounded-3xl p-8 flex flex-col gap-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Resolution Confidence Stream</h3>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mt-1">Real-time match accuracy from recent events</p>
            </div>
            <div className="flex gap-2">
               <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-orange-500/5 border border-orange-500/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                 <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Global Confidence Index</span>
               </div>
            </div>
          </div>
          
          <div className="h-48 w-full flex items-end gap-1.5 px-2">
            {scoreStream.length > 0 ? scoreStream.map((val: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ delay: 0.1 + (i * 0.05), duration: 0.5 }}
                className={cn(
                  "flex-1 rounded-t-sm transition-all",
                  val > 85 ? "bg-orange-500" : val > 60 ? "bg-orange-900" : "bg-orange-950"
                )}
              />
            )) : (
              <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center opacity-10">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Waiting for Stream Ingestion</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
             <div className="flex items-center gap-8">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Master Link Rate</span>
                   <span className="text-2xl font-black text-white mt-1">
                     {isSystemInitialized ? ((activeRecords / (activeRecords + fragmentCount)) * 100).toFixed(1) : "0.0"}%
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Avg Confidence</span>
                   <span className="text-2xl font-black text-orange-500 mt-1">{avgConfidence}%</span>
                </div>
             </div>
             <Link href="/live-resolution" className="px-6 py-2.5 rounded-lg border border-orange-500/30 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2">
               Open Resolution Workshop <ArrowRight size={14} />
             </Link>
          </div>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-8 flex flex-col gap-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">System Anomalies</h3>
            <AlertTriangle className="text-orange-500" size={20} />
          </div>
          
          <div className="space-y-4">
            {anomalyList.length > 0 ? (
              anomalyList.map((anomaly: any) => (
                <AnomalyItem 
                  key={anomaly.id}
                  type={anomaly.feedback || "Identity Conflict"} 
                  entity={anomaly.source_records?.entity_name || "Unknown Entity"} 
                  severity="high" 
                />
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-10 h-full">
                <Shield size={48} className="mb-4 text-orange-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white leading-loose">Integrity Matrix Clean<br/>No Active Conflicts</p>
              </div>
            )}
          </div>
          
          <button className="w-full py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all mt-auto">
            Audit Integrity Logs
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="z-10 relative">
        <div className="flex flex-col gap-6 pb-20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                 {isSystemInitialized ? <Building2 className="text-orange-500" size={24} /> : <Database className="text-orange-500" size={24} />}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  {isSystemInitialized ? "Verified Master Registry" : "Detected Business Fragments"}
                </h2>
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  {isSystemInitialized ? `Synchronizing ${formatNumber(totalBusinesses)} identities` : `${formatNumber(fragmentCount)} records awaiting resolution`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {(isSystemInitialized ? recentEvents : dirtyRecords)?.map((event: any, i: number) => (
              <ResolutionCard 
                key={event.id}
                event={event}
                isDirty={!isSystemInitialized}
                delay={0.1 + (i * 0.05)}
              />
            ))}
            {(!dirtyRecords?.length && !recentEvents?.length) && (
              <div className="col-span-full py-32 bg-[#121215] border border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center opacity-10 shadow-xl">
                 <Disc size={64} className="mb-6 animate-spin-slow" />
                 <p className="text-xs font-black uppercase tracking-[0.5em]">Awaiting Data Ingestion</p>
              </div>
            )}
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
  
  const searchUrl = `/search?q=${encodeURIComponent(businessName)}&filter=${isDirty ? 'unresolved' : 'resolved'}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "bg-[#121215] border border-zinc-800 rounded-3xl flex flex-col gap-6 group cursor-pointer transition-all relative overflow-hidden shadow-lg",
        isDirty ? "border-orange-500/10 bg-orange-500/[0.01]" : "hover:border-orange-500/40"
      )}
    >
      <Link href={searchUrl} className="p-6 flex flex-col h-full w-full gap-6">
        <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/[0.02] transition-colors pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
             <div className={cn("w-1.5 h-1.5 rounded-full", "bg-orange-500")} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
               {isDirty ? "UNRESOLVED" : "LINKED IDENTITY"}
             </span>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded border transition-all", 
            isDirty 
              ? "bg-orange-500/10 border-orange-500/20" 
              : "bg-orange-500/5 border-orange-500/10"
          )}>
            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", isDirty ? "text-orange-500" : "text-orange-400")}>
              {isDirty ? "AWAITING RESOLUTION" : `${score}% CONFIDENCE`}
            </span>
          </div>
        </div>
        
        <div className="relative z-10">
          <h4 className={cn(
            "font-black truncate text-base uppercase tracking-tight transition-colors leading-none",
            isDirty ? "text-zinc-100" : "text-white group-hover:text-orange-500"
          )}>
             {source.entity_name}
          </h4>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-[9px] font-black px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800 uppercase tracking-tighter">
              {(source.department || 'GOVT_SOURCE').replace('_', ' ')}
            </span>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
              {isDirty ? "Sync Pending" : "Unified Profile"}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-zinc-800 flex items-center justify-between relative z-10">
          <div className="flex-1 max-w-[120px]">
             <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isDirty ? "0%" : `${score}%` }}
                  transition={{ delay: delay + 0.2, duration: 1 }}
                  className="h-full bg-orange-500" 
                />
             </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">View Dossier</span>
            <ArrowRight size={14} className="text-orange-500" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function MetricCard({ title, value, icon, color, trend }: any) {
  const isOrange = color === 'orange';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 flex flex-col gap-5 group relative overflow-hidden shadow-lg"
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
         {React.cloneElement(icon as React.ReactElement, { size: 64 } as any)}
      </div>

      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center border", 
        isOrange ? "text-orange-500 bg-orange-500/10 border-orange-500/20" : "text-zinc-500 bg-zinc-900 border-zinc-800"
      )}>
        {icon}
      </div>
      <div>
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{title}</h3>
        <div className="text-4xl font-black text-white tracking-tighter mt-1.5 italic">{value}</div>
        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-3 flex items-center gap-2">
           <Disc size={10} className={isOrange ? "text-orange-500" : "text-zinc-800"} /> {trend}
        </p>
      </div>
    </motion.div>
  );
}

function AnomalyItem({ type, entity, severity }: any) {
  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between group hover:bg-orange-500/[0.02] hover:border-orange-500/20 transition-all shadow-md">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          severity === 'high' ? 'bg-orange-600' : 'bg-orange-900'
        )} />
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white uppercase tracking-tight">{type}</span>
          <span className="text-[9px] font-medium text-zinc-500 uppercase truncate max-w-[150px]">{entity}</span>
        </div>
      </div>
      <ArrowRight size={12} className="text-zinc-700 group-hover:text-orange-500 transition-colors" />
    </div>
  );
}
