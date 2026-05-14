'use client'

import { useState } from 'react';
import { motion } from 'framer-motion'
import { Activity, BarChart3, PieChart, TrendingUp, Download, Database, Globe, Calendar, AlertTriangle, Share2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import ActivityTimeline from '@/components/ActivityTimeline';
import ForensicTimeline from '@/components/ForensicTimeline';
import RelationshipGraph from '@/components/RelationshipGraph';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function IntelligenceClient({ stats }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'anomalies' | 'graph' | 'learning'>('overview');
  const [appliedRecs, setAppliedRecs] = useState<number[]>([]);

  const handleApply = (index: number) => {
    setAppliedRecs([...appliedRecs, index]);
  };

  const graphData = stats.graphData || { nodes: [], links: [] };

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
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Business Intelligence Engine</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Command Center</h1>
          <p className="text-slate-500 mt-2 font-medium">Cross-departmental monitoring and anomaly detection engine.</p>
        </div>
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
           <TabButton active={activeTab === 'overview'} label="Overview" icon={<BarChart3 size={14} />} onClick={() => setActiveTab('overview')} />
           <TabButton active={activeTab === 'anomalies'} label="Anomalies" icon={<AlertTriangle size={14} />} onClick={() => setActiveTab('anomalies')} />
           <TabButton active={activeTab === 'graph'} label="Graph Explorer" icon={<Share2 size={14} />} onClick={() => setActiveTab('graph')} />
           <TabButton active={activeTab === 'learning'} label="Learning Hub" icon={<Globe size={14} />} onClick={() => setActiveTab('learning')} />
        </div>
      </div>

      {activeTab === 'overview' && (
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
              <LegendItem color="bg-indigo-500" label="IDENTIFIER MATCHES" value={`${stats.matchBreakdown?.idPercent || 0}%`} />
              <LegendItem color="bg-emerald-500" label="FUZZY MATCHES" value={`${stats.matchBreakdown?.fuzzyPercent || 0}%`} />
              <LegendItem color="bg-amber-500" label="UNRESOLVED" value={`${stats.matchBreakdown?.unresolvedPercent || 0}%`} />
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
                 <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Source Distribution</p>
                 <div className="h-64 flex items-end justify-between gap-4 glass-card p-6 border-white/5">
                   {Object.entries(stats.deptStats || {}).map(([dept, count]: any) => (
                     <div key={dept} className="flex flex-col items-center gap-2 flex-1 group h-full">
                       <div className="relative w-full flex-1 flex flex-col justify-end">
                         <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${((count as number) / 30) * 100}%` }}
                           className="w-full bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-lg transition-all"
                         />
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
      )}

      {activeTab === 'learning' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 z-10 relative"
        >
          <div className="glass-card p-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                  <Globe size={32} className="text-emerald-500" /> AI Optimization Hub
                </h2>
                <p className="text-slate-500 font-medium mt-2">The system is learning from {stats.learningInsights?.totalFeedbackPoints || 0} reviewer decisions.</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Learning Status: ACTIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {stats.learningInsights?.recommendations.map((rec: any, i: number) => {
                const isApplied = appliedRecs.includes(i);
                return (
                  <div key={i} className={cn(
                    "glass-card border-white/5 p-8 transition-all relative overflow-hidden",
                    isApplied ? "border-emerald-500/50 bg-emerald-500/5" : "hover:border-emerald-500/30 bg-white/[0.02]"
                  )}>
                    {isApplied && (
                      <div className="absolute top-0 right-0 p-2 bg-emerald-500 text-black text-[8px] font-black uppercase tracking-widest">
                        Optimized
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        {rec.impact} Impact
                      </span>
                      <TrendingUp size={20} className={cn(isApplied ? "text-emerald-400" : "text-emerald-500")} />
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">Adjust {rec.field} Weight</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-500 uppercase font-black tracking-tighter">Current</span>
                        <span className={cn("text-xl font-mono font-bold", isApplied ? "text-emerald-400 line-through opacity-50" : "text-slate-400")}>
                          {rec.currentWeight}
                        </span>
                      </div>
                      <div className="h-px w-8 bg-slate-700" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-emerald-500 uppercase font-black tracking-tighter">
                          {isApplied ? 'Active' : 'Suggested'}
                        </span>
                        <span className="text-2xl font-mono font-black text-emerald-400">{rec.suggestedWeight}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{rec.reasoning}</p>
                    <button 
                      disabled={isApplied}
                      onClick={() => handleApply(i)}
                      className={cn(
                        "w-full mt-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                        isApplied 
                          ? "bg-emerald-500 text-white border-emerald-500 cursor-default" 
                          : "bg-white/5 hover:bg-emerald-500 hover:text-white border-white/10 hover:border-emerald-500"
                      )}
                    >
                      {isApplied ? 'Optimization Applied' : 'Apply Optimization'}
                    </button>
                  </div>
                );
              })}
              
              {(!stats.learningInsights?.recommendations || stats.learningInsights.recommendations.length === 0) && (
                <div className="lg:col-span-3 py-20 flex flex-col items-center justify-center text-center">
                  <Activity size={48} className="text-slate-700 mb-6 animate-pulse" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Awaiting sufficient feedback data to suggest optimizations...</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}


      {activeTab === 'anomalies' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-10 z-10 relative"
        >
          <div className="mb-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <AlertTriangle size={32} className="text-amber-500" /> High-Risk Anomaly Hub
            </h2>
            <p className="text-slate-500 font-medium mt-2">Active scanning for inconsistent data and suspicious entity behavior.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnomalyCard 
              type="INCONSISTENT_ADDRESS" 
              count={stats.anomalyStats?.address_mismatch || 0} 
              severity="medium"
              description="Entities reporting conflicting locations across different government datasets."
            />
            <AnomalyCard 
              type="SUSPICIOUS_INACTIVITY" 
              count={stats.anomalyStats?.suspicious_inactivity || 0} 
              severity="high"
              description="Businesses with zero verified compliance events in the last 18 months."
            />
            <AnomalyCard 
              type="IDENTIFIER_COLLISION" 
              count={stats.anomalyStats?.identifier_collision || 0} 
              severity="high"
              description="Shared PAN or GSTIN identifiers detected across distinct legal entities."
            />
          </div>
        </motion.div>
      )}

      {activeTab === 'graph' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card h-[700px] z-10 relative overflow-hidden"
        >
          <RelationshipGraph data={graphData} />
        </motion.div>
      )}
    </div>
  );
}

function TabButton({ active, label, icon, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3",
        active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-white"
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function AnomalyCard({ type, count, severity, description }: any) {
  return (
    <div className="glass-card border-white/5 p-6 hover:border-amber-500/30 transition-all group">
       <div className="flex justify-between items-start mb-6">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border",
            severity === 'high' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
          )}>
             <AlertTriangle size={20} />
          </div>
          <span className="text-3xl font-black text-white tracking-tighter">{count}</span>
       </div>
       <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2 group-hover:text-amber-500 transition-colors">{type.replace('_', ' ')}</h4>
       <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{description}</p>
    </div>
  )
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
