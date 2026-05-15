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
import ForensicTimeline from '@/components/ForensicTimeline';
import RelationshipGraph from '@/components/RelationshipGraph';

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

  // Prepare graph data for this specific business
  const graphData = {
    nodes: [
      { id: business.id, name: business.name, group: 'business' },
      ...linkedRecords.map(r => ({ id: r.id, name: r.entity_name, group: 'source' }))
    ],
    links: linkedRecords.map(r => ({ source: r.id, target: business.id }))
  };
  
  const handleExport = () => {
    window.print();
  };
  
  return (
    <div className="p-10 space-y-10 min-h-screen relative overflow-y-auto print:p-0 print:bg-white print:text-black bg-[#08080a] text-slate-100">
      
      {/* Cinematic Background Element - Hide on print */}
      <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none print:hidden">
        <Building2 size={400} className="text-orange-500" />
      </div>

      {/* Navigation - Hide on print */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 z-10 relative print:hidden"
      >
        <Link 
          href="/search"
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Directory / Business Profile</span>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest mt-1">ID: {business.ubid}</span>
        </div>
      </motion.div>

      {/* Print Header - Show only on print */}
      <div className="hidden print:block border-b-2 border-black pb-8 mb-10">
        <h1 className="text-4xl font-bold uppercase tracking-tighter">Bharat Business Intelligence Engine</h1>
        <p className="text-sm font-bold uppercase tracking-widest mt-2">Forensic Identity Audit Report - {business.ubid}</p>
        <div className="mt-4 text-xs font-mono">Issued: {new Date().toLocaleString()} | Forensic Integrity Verified</div>
      </div>

      {/* Main Profile Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 print:hidden">
              <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ff6b00]" />
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Verified Identity</span>
              </div>
              {score > 90 && (
                <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
                  <ShieldCheck size={12} className="text-orange-400" />
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">High Confidence</span>
                </div>
              )}
            </div>
            <h1 className="text-6xl font-black text-white print:text-black uppercase tracking-tighter leading-[0.9] italic">
              {business.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-400 print:text-black font-medium">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-orange-500" />
                <span className="uppercase tracking-tight">{business.address || 'Address Not Provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fingerprint size={18} className="text-orange-500" />
                <span className="font-mono">PAN: {business.pan || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 print:grid-cols-3">
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
          className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group print:border-2 print:border-black"
        >
          <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors pointer-events-none print:hidden" />
          <div className="relative w-40 h-40 rounded-full flex items-center justify-center mb-6">
            <svg className="w-full h-full -rotate-90 transform">
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle 
                cx="80" cy="80" r="70" 
                fill="transparent" 
                stroke="#ff6b00" 
                strokeWidth="8" 
                strokeDasharray="440" 
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * score / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white print:text-black tracking-tighter">{score}%</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Match Score</span>
            </div>
          </div>
          <h3 className="text-sm font-black text-white print:text-black uppercase tracking-widest mb-2">Identity Confidence</h3>
          <p className="text-xs text-slate-500 font-medium">Resolution based on {linkedRecords.length} government data signals.</p>
        </motion.div>
      </div>

      {/* Forensic Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 z-10 relative">
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white print:text-black uppercase tracking-tighter flex items-center gap-3">
             <Fingerprint size={24} className="text-orange-500" /> Forensic Trail
          </h2>
          <div className="glass-card p-8 border-white/5 print:border-black print:border-2 bg-black/40">
             <ForensicTimeline events={resolution ? [resolution] : []} />
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white print:text-black uppercase tracking-tighter flex items-center gap-3">
             <Layers size={24} className="text-orange-500" /> Relational Web
          </h2>
          <div className="glass-card h-[400px] border-white/5 relative overflow-hidden print:border-black print:border-2 print:h-[300px] bg-black/40">
             <RelationshipGraph data={graphData} />
          </div>
        </div>
      </div>

      {/* Detailed Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative print:block">
        
        {/* Linked Records - 7 Cols */}
        <div className="lg:col-span-7 space-y-6 print:mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white print:text-black uppercase tracking-tighter flex items-center gap-3">
              <Layers size={24} className="text-orange-500" /> Source Lineage
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {linkedRecords.map((record, i) => (
              <motion.div 
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex items-center justify-between group hover:bg-orange-500/[0.04] transition-all print:border-black print:border print:bg-transparent bg-black/20"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 print:text-black">
                    <Database size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-orange-500 print:text-black uppercase tracking-[0.2em]">Source Record</span>
                    <h4 className="text-sm font-black text-white print:text-black uppercase tracking-tight mt-0.5">{record.entity_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-500 print:text-black border border-white/5 print:border-black uppercase">{record.department.replace('_', ' ')}</span>
                      <span className="text-[9px] font-mono text-slate-600">ID: {record.source_id}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity Timeline - 5 Cols */}
        <div className="lg:col-span-5 space-y-6 print:mt-10">
          <h2 className="text-xl font-black text-white print:text-black uppercase tracking-tighter flex items-center gap-3">
             <TrendingUp size={24} className="text-orange-500" /> Event Stream
          </h2>
          <div className="glass-card p-8 border-white/5 print:border-black print:border-2 bg-black/40">
            <ActivityTimeline events={activityEvents} />
          </div>
        </div>

      </div>

      {/* Action Footer - Hide on print */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 pb-20 print:hidden"
      >
        <div className="flex flex-col">
          <h3 className="text-lg font-black text-white uppercase tracking-tighter">Forensic Audit Hub</h3>
          <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Verify and export the forensic truth of this identity.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExport}
            className="px-8 py-4 glass-card text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all border-white/5"
          >
            Export Audit Certificate
          </button>
          <button className="px-10 py-4 bg-orange-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-2xl shadow-orange-500/20 active:scale-95 flex items-center gap-3">
            Re-Verify Identity <Fingerprint size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function QuickInfoCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="glass-card p-5 border-white/5 flex flex-col gap-3 group hover:border-white/10 transition-all print:border-black print:border print:bg-transparent bg-black/20">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 print:text-black group-hover:text-orange-500 transition-colors">
        {icon}
      </div>
      <div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="text-lg font-black text-white print:text-black uppercase tracking-tight mt-0.5">{value}</div>
      </div>
    </div>
  );
}
