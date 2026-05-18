'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  ArrowRight, 
  MapPin, 
  Fingerprint, 
  History, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  Building2,
  Zap,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityTimeline from '@/components/ActivityTimeline';

export default function SearchResultsClient({ results, filter }: { results: any[], filter: string }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (results.length === 0) {
    return (
      <div className="p-32 text-center">
        <div className="flex flex-col items-center gap-6 opacity-20">
           <AlertTriangle size={64} className="text-zinc-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.5em]">No matching identity found in current node</span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-zinc-900">
            <th className="p-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Identity Details</th>
            <th className="p-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Geographic Anchor</th>
            <th className="p-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Source Lineage</th>
            <th className="p-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">System.State</th>
            <th className="p-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {results.map((item: any) => (
            <SearchRow 
              key={item.id} 
              item={item} 
              filter={filter} 
              isExpanded={expandedId === item.id}
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SearchRow({ item, filter, isExpanded, onToggle }: any) {
  const isResolved = filter === 'resolved';
  
  return (
    <>
      <tr 
        className={`hover:bg-zinc-900/50 transition-colors group cursor-pointer ${isExpanded ? 'bg-orange-500/10' : ''}`}
        onClick={onToggle}
      >
        <td className="p-8">
          <div className="flex items-center gap-5">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isResolved ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'} group-hover:scale-110`}>
                {isResolved ? <ShieldCheck size={20} /> : <Database size={20} />}
             </div>
             <div>
               <div className={`font-black uppercase tracking-tighter text-lg italic transition-colors ${isResolved ? 'text-white group-hover:text-orange-500' : 'text-zinc-400 group-hover:text-white'}`}>
                  {isResolved ? item.name : item.entity_name}
               </div>
               <div className="text-[9px] font-mono text-zinc-500 flex items-center gap-3 mt-1 uppercase tracking-widest">
                  {isResolved ? `UBID: ${item.ubid}` : `FRAGMENT ID: ${item.id.substring(0,8)}`}
                  <span className="w-1 h-1 rounded-full bg-orange-500/40" />
                  <span className={isResolved ? "text-orange-500/80 font-black" : "text-zinc-600"}>
                    {isResolved ? "Authorized Record" : "Awaiting Resolution"}
                  </span>
               </div>
             </div>
          </div>
        </td>
        <td className="p-8">
           <div className="text-[11px] text-zinc-400 font-bold max-w-[300px] line-clamp-2 uppercase tracking-tight">
              {isResolved ? item.address : item.raw_data?.address || 'Geolocation Pending'}
           </div>
        </td>
        <td className="p-8">
          <div className="flex gap-2 flex-wrap">
            {isResolved ? (
              Array.from(new Set(item.source_records?.map((r: any) => r.department?.replace('_', ' ')) || [])).map((s: any) => (
                <span key={s} className="text-[8px] font-black px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase tracking-widest">
                   {s}
                </span>
              ))
            ) : (
              <span className="text-[8px] font-black px-2.5 py-1 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20 uppercase tracking-widest">
                 {item.department?.replace('_', ' ') || 'Govt_Source'}
              </span>
            )}
          </div>
        </td>
        <td className="p-8">
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${isResolved ? 'bg-orange-500' : 'bg-zinc-800 animate-pulse'}`} />
             <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isResolved ? 'text-orange-500' : 'text-zinc-600'}`}>
               {isResolved ? (item.status?.toUpperCase() || 'ACTIVE') : 'UNRESOLVED'}
             </span>
          </div>
        </td>
        <td className="p-8 text-right">
          <div className="flex items-center justify-end gap-4">
             {isExpanded ? <ChevronUp size={16} className="text-orange-500" /> : <ChevronDown size={16} className="text-zinc-600" />}
          </div>
        </td>
      </tr>
      
      {/* Expanded Details Row */}
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={5} className="p-0 border-none">
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden bg-zinc-950 border-b border-zinc-800"
              >
                <div className="p-12 grid grid-cols-12 gap-12">
                  {/* Left Column: Metadata */}
                  <div className="col-span-4 space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <Building2 size={12} /> Entity Metadata
                      </h4>
                      <div className="space-y-4">
                        <MetaItem icon={<Fingerprint size={14} />} label="PAN" value={isResolved ? item.pan : item.raw_data?.pan || 'NOT_PROVIDED'} />
                        <MetaItem icon={<Zap size={14} />} label="GSTIN" value={isResolved ? item.gstin : item.raw_data?.gstin || 'NOT_PROVIDED'} />
                        <MetaItem icon={<MapPin size={14} />} label="ADDRESS" value={isResolved ? item.address : item.raw_data?.address || 'NOT_PROVIDED'} />
                        <MetaItem icon={<Globe size={14} />} label="SECTOR" value={isResolved ? item.sector : item.raw_data?.sector || 'Retail'} />
                      </div>
                    </div>
                    
                    {isResolved ? (
                      <Link 
                        href={`/business/${item.ubid}`}
                        className="flex items-center justify-center gap-3 w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
                      >
                        Deep Audit Profile <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <Link 
                        href="/review"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
                      >
                        Initiate Resolution <Zap size={14} />
                      </Link>
                    )}
                  </div>

                  {/* Right Column: Activity History */}
                  <div className="col-span-8">
                    <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                      <History size={12} /> Forensic Activity Stream
                    </h4>
                    <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
                      <ActivityTimeline events={item.activity_events || []} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

function MetaItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 flex-shrink-0">
        {icon}
      </div>
      <div>
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">{label}</span>
        <span className="text-xs font-bold text-zinc-300 uppercase tracking-tight line-clamp-2">{value}</span>
      </div>
    </div>
  );
}
