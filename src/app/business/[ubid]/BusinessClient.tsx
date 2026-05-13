'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  ShieldCheck, 
  History, 
  Layers, 
  Database, 
  ArrowLeft, 
  ExternalLink, 
  Fingerprint,
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import ActivityTimeline from '@/components/ActivityTimeline';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface BusinessClientProps {
  business: any;
  linkedRecords: any[];
  activityEvents: any[];
  resolution: any;
}

export default function BusinessClient({ 
  business, 
  linkedRecords, 
  activityEvents, 
  resolution 
}: BusinessClientProps) {
  
  const score = resolution ? Math.round(resolution.match_score * 100) : 0;
  
  return (
    <div className="p-10 space-y-10 min-h-screen relative overflow-y-auto">
      
      {/* Cinematic Background Element */}
      <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
        <Building2 size={400} className="text-indigo-500" />
      </div>

      {/* Navigation & Breadcrumbs */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 z-10 relative"
      >
        <Link 
          href="/"
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Directory / Business Profile</span>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">ID: {business.ubid}</span>
        </div>
      </motion.div>

      {/* Main Profile Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified Identity</span>
              </div>
              {score > 90 && (
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2">
                  <ShieldCheck size={12} className="text-indigo-400" />
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">High Confidence</span>
                </div>
              )}
            </div>
            <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-[0.9]">
              {business.entity_name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-indigo-400" />
                <span>{business.address || 'Address Not Provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fingerprint size={18} className="text-indigo-400" />
                <span className="font-mono">PAN: {business.pan || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <QuickInfoCard icon={<Database size={18} />} label="Total Sources" value={linkedRecords.length} />
            <QuickInfoCard icon={<History size={18} />} label="Events Logged" value={activityEvents.length} />
            <QuickInfoCard icon={<Zap size={18} />} label="Last Updated" value={new Date(business.updated_at).toLocaleDateString()} />
          </div>
        </motion.div>

        {/* Resolution Radar/Score */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
          <div className="relative w-40 h-40 rounded-full flex items-center justify-center mb-6">
            <svg className="w-full h-full -rotate-90 transform">
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle 
                cx="80" cy="80" r="70" 
                fill="transparent" 
                stroke="#6366f1" 
                strokeWidth="8" 
                strokeDasharray="440" 
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * score / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white tracking-tighter">{score}%</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Match Score</span>
            </div>
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Identity Confidence</h3>
          <p className="text-xs text-slate-500 font-medium">Resolution based on {linkedRecords.length} distinct government data signals.</p>
        </motion.div>
      </div>

      {/* Detailed Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative">
        
        {/* Linked Records - 7 Cols */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Layers size={24} className="text-indigo-500" /> Source Lineage
            </h2>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Linked Records</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {linkedRecords.map((record, i) => (
              <motion.div 
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex items-center justify-between group hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <Database size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Source Record</span>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight mt-0.5">{record.entity_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-500 uppercase">{record.department.replace('_', ' ')}</span>
                      <span className="text-[9px] font-mono text-slate-600">ID: {record.source_id}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Synched</span>
                   </div>
                   <span className="text-[10px] font-medium text-slate-500">{new Date(record.last_scanned).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity Timeline - 5 Cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <TrendingUp size={24} className="text-indigo-500" /> Event Intelligence
            </h2>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Active Stream</span>
            </div>
          </div>
          
          <div className="glass-card p-8 border-white/5">
            <ActivityTimeline events={activityEvents} />
          </div>

          <div className="glass-card p-6 border-amber-500/10 bg-amber-500/5">
            <div className="flex gap-4">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">System Notice</h4>
                <p className="text-[11px] text-amber-500/70 font-medium leading-relaxed">
                  Any discrepancies in historical data are flagged for manual review by the identity resolution engine.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 pb-20"
      >
        <div className="flex flex-col">
          <h3 className="text-lg font-black text-white uppercase tracking-tighter">Business Action Hub</h3>
          <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Request updates or dispute resolution results.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-8 py-4 glass-card text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all">
            Export Certificate
          </button>
          <button className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 flex items-center gap-3">
            Recalculate Identity <Zap size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function QuickInfoCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="glass-card p-5 border-white/5 flex flex-col gap-3 group hover:border-white/10 transition-all">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
        {icon}
      </div>
      <div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="text-lg font-black text-white uppercase tracking-tight mt-0.5">{value}</div>
      </div>
    </div>
  );
}
