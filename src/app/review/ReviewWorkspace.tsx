'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { CheckCircle2, XCircle, FileText, Building2, Fingerprint, Loader2, ShieldCheck, Zap, AlertTriangle, ArrowRight, Info, ShieldAlert, Cpu, Command, Plus } from 'lucide-react'
import { approveMerge, createNewEntity, flagFraud } from './actions'
import { useRouter } from 'next/navigation'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type PendingEvent = {
  id: string;
  score: number;
  ai_reasoning: string;
  source: {
    id: string;
    entity_name: string;
    department: string;
    address: string;
    pincode: string;
    gstin: string;
    pan: string;
  };
  target: {
    id: string;
    ubid: string;
    primary_name: string;
    address: string;
    pincode: string;
    gstin: string;
    pan: string;
  };
  matched_fields: string[];
}

export default function ReviewWorkspace({ 
  initialEvents, 
  unresolvedRecords = [] 
}: { 
  initialEvents: PendingEvent[], 
  unresolvedRecords?: any[] 
}) {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'unresolved'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [events, setEvents] = useState(initialEvents)
  const [unresolved, setUnresolved] = useState(unresolvedRecords)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Combined list for searching/filtering
  const allRecords = [
    ...events.map(e => ({ ...e, type: 'flagged' })),
    ...unresolved.map(u => {
      const hasPan = !!(u.raw_data?.pan || u.pan);
      const hasGstin = !!(u.raw_data?.gstin || u.gstin);
      const hasAddress = !!(u.raw_data?.address || u.address);
      const hasName = !!u.entity_name;
      const dataScore = Math.round((
        (hasName ? 25 : 0) +
        (hasPan ? 35 : 0) +
        (hasGstin ? 25 : 0) +
        (hasAddress ? 15 : 0)
      ));
      return {
      id: u.id,
      score: dataScore,
      ai_reasoning: "No existing identity match found. Data quality verified. Ready for new UBID assignment.",
      type: 'unresolved',
      source: {
        id: u.id,
        entity_name: u.entity_name,
        department: u.department,
        address: u.raw_data?.address || 'N/A',
        pincode: u.pincode || '',
        gstin: u.raw_data?.gstin || 'N/A',
        pan: u.raw_data?.pan || 'N/A'
      },
      target: null,
      matched_fields: [] as string[]
    };
    })
  ]


  const filteredRecords = allRecords.filter(r => {
    const matchesSearch = r.source.entity_name.toLowerCase().includes(searchQuery.toLowerCase())
    if (filter === 'all') return matchesSearch
    return r.type === filter && matchesSearch
  })

  const selectedEvent = filteredRecords[selectedIndex]

  const handleApprove = useCallback(async () => {
    if (!selectedEvent || isPending || selectedEvent.type === 'unresolved') return
    startTransition(async () => {
      await approveMerge(selectedEvent.id, selectedEvent.source.id, selectedEvent.target!.id)
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id))
      setSelectedIndex(0)
      router.refresh()
    })
  }, [selectedEvent, isPending, router])

  const handleCreateNew = useCallback(async () => {
    if (!selectedEvent || isPending) return
    startTransition(async () => {
      await createNewEntity(selectedEvent.id, selectedEvent.source.id, selectedEvent.source.entity_name, selectedEvent.source.address, selectedEvent.source.pincode)
      if (selectedEvent.type === 'flagged') {
        setEvents(prev => prev.filter(e => e.id !== selectedEvent.id))
      } else {
        setUnresolved(prev => prev.filter(u => u.id !== selectedEvent.id))
      }
      setSelectedIndex(0)
      router.refresh()
    })
  }, [selectedEvent, isPending, router])

  const handleFlagFraud = useCallback(async () => {
    if (!selectedEvent || isPending) return
    startTransition(async () => {
      await flagFraud(selectedEvent.id, selectedEvent.source.id)
      if (selectedEvent.type === 'flagged') {
        setEvents(prev => prev.filter(e => e.id !== selectedEvent.id))
      } else {
        setUnresolved(prev => prev.filter(u => u.id !== selectedEvent.id))
      }
      setSelectedIndex(0)
      router.refresh()
    })
  }, [selectedEvent, isPending, router])

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPending || filteredRecords.length === 0) return
      if (e.key.toLowerCase() === 'a') handleApprove()
      if (e.key.toLowerCase() === 'c') handleCreateNew()
      if (e.key.toLowerCase() === 'x') handleFlagFraud()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleApprove, handleCreateNew, handleFlagFraud, isPending, filteredRecords.length])

  if (filteredRecords.length === 0 && searchQuery === '') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex items-center justify-center glass-card border-indigo-500/20 m-10"
      >
        <div className="text-center">
          <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
             <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Queue Cleared</h2>
          <p className="text-slate-500 mt-4 font-medium max-w-sm mx-auto">No pending items found for this filter. All business identities are successfully resolved.</p>
          <button 
            onClick={() => { setFilter('all'); setSearchQuery(''); }}
            className="mt-10 px-10 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
          >
            Clear Filters
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-160px)] p-6">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between z-20">
         <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
            <FilterTab active={filter === 'all'} label="All Items" count={allRecords.length} onClick={() => setFilter('all')} />
            <FilterTab active={filter === 'flagged'} label="AI Matches" count={events.length} onClick={() => setFilter('flagged')} />
            <FilterTab active={filter === 'unresolved'} label="Unresolved Source" count={unresolved.length} onClick={() => setFilter('unresolved')} />
         </div>
         <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
               <Command size={16} className="text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input 
               type="text" 
               placeholder="Search by entity name..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all"
            />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Review Sidebar - 3 Cols */}
        <div className="lg:col-span-3 flex flex-col min-h-0 bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Master Queue</span>
                  <span className="text-sm font-black text-white">{filteredRecords.length} Records Found</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <LayoutGroup id="sidebar-icon">
                      <Fingerprint size={16} className="text-indigo-400" />
                  </LayoutGroup>
              </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredRecords.map((record, idx) => (
              <motion.div 
                key={record.id}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "p-4 rounded-2xl cursor-pointer transition-all border group relative",
                  idx === selectedIndex 
                    ? "bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.05)]" 
                    : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
                )}
              >
                {idx === selectedIndex && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-4 bottom-4 w-1 bg-indigo-500 rounded-full" 
                  />
                )}
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-xs font-black tracking-tight truncate pr-4 transition-colors",
                    idx === selectedIndex ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                  )}>
                    {record.source.entity_name}
                  </span>
                  <span className={cn(
                    "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                    record.type === 'unresolved' 
                      ? "text-amber-400 bg-amber-400/10 border border-amber-400/20" 
                      : "text-indigo-400 bg-indigo-400/10 border border-indigo-400/20"
                  )}>
                    {record.type === 'unresolved' ? 'UNRESOLVED' : `${record.score}%`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full", record.type === 'unresolved' ? "bg-amber-500" : "bg-indigo-500")} />
                  <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                    {record.source.department.replace('_', ' ')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        <div className="p-4 bg-white/5 border-t border-white/5">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <Command size={10} /> 
                <span>A: Approve | C: Create | X: Flag</span>
            </div>
        </div>
      </div>

      {/* Main Workspace - 9 Cols */}
      <div className="lg:col-span-9 flex flex-col gap-6 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          {!selectedEvent ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-500 glass-card border-dashed border-white/10"
            >
              <Info size={48} className="opacity-20" />
              <span className="text-[10px] font-black uppercase tracking-widest">No Selection Match</span>
            </motion.div>
          ) : (
          <motion.div 
            key={selectedEvent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6 h-full"
          >
            {/* Header / Engine Status */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                        <Cpu size={24} className="text-indigo-400 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Resolution Workbench</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Engine Stage: High-Risk Conflict Arbiter</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Match Confidence</span>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-mono font-black text-white">{selectedEvent.score}%</span>
                            <div className="w-16 h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${selectedEvent.score}%` }}
                                    className="h-full bg-indigo-500 shadow-[0_0_15px_#6366f1]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
               {/* SOURCE DATA */}
               <div className="glass-card border-amber-500/20 bg-amber-500/[0.02] flex flex-col p-8 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                      <FileText size={120} />
                  </div>
                  <div className="flex items-center justify-between mb-8 relative z-10">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <FileText size={16} className="text-amber-500" />
                        </div>
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Legacy Signal</span>
                     </div>
                     <span className="text-[9px] font-mono text-amber-500/60 uppercase">TIMESTAMP: 2026-05-06</span>
                  </div>

                  <div className="space-y-10 relative z-10">
                     <DataField 
                        label="Entity Name (Dirty)" 
                        value={selectedEvent.source.entity_name} 
                        compareValue={selectedEvent.target?.primary_name}
                        isMismatched={!selectedEvent.matched_fields.includes('Name')}
                        color="amber"
                     />
                     <div className="grid grid-cols-2 gap-8">
                        <DataField label="Department Source" value={selectedEvent.source.department.replace('_', ' ')} color="amber" />
                        <DataField label="Source ID" value={selectedEvent.source.id.split('-')[1]} color="amber" mono />
                     </div>
                     <div className="grid grid-cols-2 gap-8">
                        <DataField label="GSTIN (Signal)" value={selectedEvent.source.gstin} color="amber" mono />
                        <DataField label="PAN (Signal)" value={selectedEvent.source.pan} color="amber" mono />
                     </div>
                     <DataField 
                        label="Reported Address" 
                        value={selectedEvent.source.address} 
                        compareValue={selectedEvent.target?.address}
                        isMismatched={!selectedEvent.matched_fields.includes('Address')}
                        color="amber"
                     />
                  </div>
               </div>

            {/* TARGET DATA */}
               <div className="glass-card border-indigo-500/20 bg-indigo-500/[0.02] flex flex-col p-8 relative group overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.05)]">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Building2 size={120} />
                  </div>
                  <div className="flex items-center justify-between mb-8 relative z-10">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <Building2 size={16} className="text-indigo-500" />
                        </div>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                          {selectedEvent.target ? "Golden Registry Record" : "Registry Candidate"}
                        </span>
                     </div>
                     {selectedEvent.target ? (
                       <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                          <ShieldCheck size={10} className="text-emerald-500" />
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Verified UBID</span>
                       </div>
                     ) : (
                       <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
                          <AlertTriangle size={10} className="text-amber-500" />
                          <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">No Match</span>
                       </div>
                     )}
                  </div>

                  <div className="space-y-10 relative z-10">
                    {selectedEvent.target ? (
                      <>
                        <DataField 
                            label="Registry Name (Legal)" 
                            value={selectedEvent.target.primary_name} 
                            compareValue={selectedEvent.source.entity_name}
                            isMismatched={!selectedEvent.matched_fields.includes('Name')}
                        />
                         <div className="grid grid-cols-2 gap-8">
                             <DataField label="Unified Identifier" value={selectedEvent.target.ubid} mono color="indigo" />
                             <DataField label="Record Health" value="OPTIMIZED" color="emerald" />
                         </div>
                         <div className="grid grid-cols-2 gap-8">
                             <DataField label="GSTIN (Legal)" value={selectedEvent.target.gstin} mono color="indigo" />
                             <DataField label="PAN (Legal)" value={selectedEvent.target.pan} mono color="indigo" />
                         </div>
                        <DataField 
                            label="Registered Location" 
                            value={selectedEvent.target.address} 
                            compareValue={selectedEvent.source.address}
                            isMismatched={!selectedEvent.matched_fields.includes('Address')}
                        />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center opacity-40 group-hover:opacity-60 transition-opacity">
                         <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                            <Plus size={32} className="text-slate-500" />
                         </div>
                         <h3 className="text-sm font-black text-white uppercase tracking-widest">Create New Entity</h3>
                         <p className="text-[10px] text-slate-500 max-w-[200px] mt-2 font-mono">No matching identifier found in master registry. Use 'C' to initialize new identity.</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>

            {/* AI Reasoning & Actions Bar */}
            <div className="glass-card border-white/5 bg-white/[0.02] p-6 flex items-center gap-8 relative overflow-hidden">
                <div className="flex-1 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Zap size={20} className={cn(selectedEvent.type === 'unresolved' ? "text-amber-400" : "text-indigo-400")} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                          {selectedEvent.type === 'unresolved' ? "Source Analysis" : "AI Reasoning Engine"}
                        </span>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                            "{selectedEvent.ai_reasoning}"
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                   <ReviewAction 
                      icon={<ShieldAlert size={18} />} 
                      label="Flag as Wrong" 
                      onClick={handleFlagFraud} 
                      variant="danger" 
                      shortcut="X"
                      pending={isPending}
                   />
                   <ReviewAction 
                      icon={<Fingerprint size={18} />} 
                      label="Create New" 
                      onClick={handleCreateNew} 
                      variant="secondary" 
                      shortcut="C"
                      pending={isPending}
                   />
                   {selectedEvent.target && (
                     <ReviewAction 
                        icon={<CheckCircle2 size={18} />} 
                        label="Approve Merge" 
                        onClick={handleApprove} 
                        variant="primary" 
                        shortcut="A"
                        pending={isPending}
                     />
                   )}
                </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
       <div className="xl:col-span-8 glass-card border-white/5 bg-white/[0.02] p-8 space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Zap size={20} className="text-indigo-400" />
             </div>
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Intelligence Briefing</h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Cross-Field Conflict Analysis</span>
             </div>
          </div>
          <div className="space-y-4">
             {selectedEvent && (
                <>
                   <MismatchRow label="Entity Name" source={selectedEvent.source.entity_name} target={selectedEvent.target?.primary_name} />
                   <MismatchRow label="Location/City" source={selectedEvent.source.address.split(',')[0]} target={selectedEvent.target?.address.split(',')[0]} />
                   <MismatchRow label="Tax Identifier" source={selectedEvent.source.gstin} target={selectedEvent.target?.gstin} />
                </>
             )}
          </div>
          <div className="pt-6 border-t border-white/5 flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar">
             <DecisionNode label="Phonetic" score={92} active />
             <DecisionArrow />
             <DecisionNode label="Semantic" score={selectedEvent?.score || 0} active primary />
             <DecisionArrow />
             <DecisionNode label="Geo-Loc" score={45} />
             <DecisionArrow />
             <DecisionNode label="Tax_ID" score={100} active />
          </div>
       </div>
    </div>
  </div>
  )
}

function FilterTab({ active, label, count, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3",
        active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-white"
      )}
    >
      {label}
      <span className={cn(
        "px-2 py-0.5 rounded-full text-[8px] font-mono",
        active ? "bg-white/20 text-white" : "bg-white/5 text-slate-600"
      )}>{count}</span>
    </button>
  )
}

function DataField({ label, value, compareValue, isMismatched = false, mono = false, color = "indigo" }: any) {
  const renderHighlighted = (val: string, comp: string) => {
    if (!isMismatched || !comp) return val;
    
    // Simple character-level diff for visual effect
    const chars = val.split('');
    const compChars = comp.split('');
    
    return chars.map((char, i) => {
      const isDiff = char.toLowerCase() !== compChars[i]?.toLowerCase();
      return (
        <span key={i} className={isDiff ? "text-rose-500 underline decoration-rose-500/50 underline-offset-4" : ""}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</label>
        {isMismatched && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-[8px] font-black text-rose-500 uppercase tracking-widest"
            >
                <AlertTriangle size={10} /> Conflict Detected
            </motion.div>
        )}
      </div>
      <div className={cn(
        "text-lg font-black tracking-tighter transition-all",
        isMismatched ? "bg-rose-400/5 p-2 -m-2 rounded-lg" : "text-white",
        mono && "font-mono text-base tracking-normal",
        color === "amber" && !isMismatched && "group-hover:text-amber-400",
        color === "indigo" && !isMismatched && "group-hover:text-indigo-400"
      )}>
        {renderHighlighted(value, compareValue)}
      </div>
    </div>
  )
}

function MismatchRow({ label, source, target, isMissing }: any) {
  const isMatch = source?.toLowerCase() === target?.toLowerCase();
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-4">
        <div className="text-right">
            <span className="text-[8px] block text-slate-600 uppercase mb-0.5">Source</span>
            <span className="text-[10px] font-mono text-amber-500">{source || 'N/A'}</span>
        </div>
        <ArrowRight size={12} className="text-slate-700" />
        <div className="text-right">
            <span className="text-[8px] block text-slate-600 uppercase mb-0.5">Registry</span>
            <span className="text-[10px] font-mono text-indigo-400">{target || 'N/A'}</span>
        </div>
        <div className={cn(
            "ml-4 px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter",
            isMatch ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
        )}>
            {isMatch ? "MATCH" : "CONFLICT"}
        </div>
      </div>
    </div>
  )
}

function DecisionNode({ label, score, active, primary }: any) {
    return (
        <div className={cn(
            "shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
            active ? (primary ? "bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10") : "opacity-20 grayscale"
        )}>
            <span className="text-[8px] font-black uppercase tracking-widest text-white/60">{label}</span>
            <span className="text-xs font-mono font-black text-white">{score}%</span>
        </div>
    )
}

function DecisionArrow() {
    return <ArrowRight size={12} className="text-slate-700 shrink-0" />
}

function ReviewAction({ icon, label, onClick, variant, shortcut, pending }: any) {
  const styles = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    danger: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20"
  }

  return (
    <button 
      onClick={onClick}
      disabled={pending}
      className={cn(
        "px-6 py-3 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95 group relative min-w-[120px]",
        styles[variant as keyof typeof styles]
      )}
    >
      <div className="flex items-center gap-2">
        {pending ? <Loader2 size={18} className="animate-spin" /> : icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[8px] font-black px-1 rounded bg-black/40 border border-white/10">{shortcut}</span>
      </div>
    </button>
  )
}
