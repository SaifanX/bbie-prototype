'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { CheckCircle2, XCircle, FileText, Building2, Fingerprint, Loader2, ShieldCheck, Zap, AlertTriangle, ArrowRight, Info, ShieldAlert, Cpu, Command, Plus } from 'lucide-react'
import { approveMerge, createNewEntity, flagFraud } from './actions'
import { useRouter } from 'next/navigation'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import GlobalActionHistory from '@/components/GlobalActionHistory'
import { addHistoryEntry } from '@/utils/history'

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
  const [filter, setFilter] = useState<'all' | 'flagged' | 'unresolved'>('flagged')
  const [searchQuery, setSearchQuery] = useState('')
  const [events, setEvents] = useState(initialEvents)
  const [unresolved, setUnresolved] = useState(unresolvedRecords)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    setEvents(initialEvents);
    setUnresolved(unresolvedRecords);
  }, [initialEvents, unresolvedRecords]);

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
      addHistoryEntry({ recordId: selectedEvent.source.id, businessId: selectedEvent.target!.id, entityName: selectedEvent.source.entity_name, status: 'resolved' });
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id))
      setSelectedIndex(0)
      router.refresh()
    })
  }, [selectedEvent, isPending, router])

  const handleCreateNew = useCallback(async () => {
    if (!selectedEvent || isPending) return
    startTransition(async () => {
      await createNewEntity(selectedEvent.id, selectedEvent.source.id, selectedEvent.source.entity_name, selectedEvent.source.address, selectedEvent.source.pincode)
      addHistoryEntry({ recordId: selectedEvent.source.id, businessId: selectedEvent.source.id, entityName: selectedEvent.source.entity_name, status: 'new_entity' });
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
      addHistoryEntry({ recordId: selectedEvent.source.id, businessId: null, entityName: selectedEvent.source.entity_name, status: 'triage' });
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
        className="flex-1 flex flex-col items-center justify-center bg-[#121215] border border-zinc-800 m-10 p-10 rounded-3xl gap-8 shadow-xl"
      >
        <div className="text-center">
          <div className="w-24 h-24 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-orange-500/10">
             <CheckCircle2 size={48} className="text-orange-500" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Queue Cleared</h2>
          <p className="text-zinc-500 mt-4 font-medium max-w-sm mx-auto">No pending items found for this filter. All business identities are successfully resolved.</p>
          <button 
            onClick={() => { setFilter('all'); setSearchQuery(''); }}
            className="mt-10 px-10 py-4 bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
          >
            Clear Filters
          </button>
        </div>
        <div className="w-full max-w-xl mt-6">
          <GlobalActionHistory />
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen md:h-[calc(100vh-160px)] p-4 sm:p-6 selection:bg-orange-500/30 overflow-y-auto md:overflow-hidden">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between z-20 shrink-0">
         <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto custom-scrollbar w-full md:w-auto">
            <FilterTab active={filter === 'all'} label="All Items" count={allRecords.length} onClick={() => setFilter('all')} />
            <FilterTab active={filter === 'flagged'} label="AI Matches" count={events.length} onClick={() => setFilter('flagged')} />
            <FilterTab active={filter === 'unresolved'} label="Unresolved Source" count={unresolved.length} onClick={() => setFilter('unresolved')} />
         </div>
         <div className="relative w-full md:w-96 group shrink-0">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
               <Command size={16} className="text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input 
               type="text" 
               placeholder="Search by entity name..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 focus:bg-zinc-800 transition-all truncate"
            />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
        {/* Review Sidebar - 3 Cols */}
        <div className="lg:col-span-3 flex flex-col min-h-[300px] md:min-h-0 bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl shrink-0 lg:shrink">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
              <div className="flex flex-col">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Master Queue</span>
                  <span className="text-sm font-black text-white">{filteredRecords.length} Records Found</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-zinc-800">
                  <LayoutGroup id="sidebar-icon">
                      <Fingerprint size={16} className="text-orange-500" />
                  </LayoutGroup>
              </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar max-h-[400px] md:max-h-none">
            {filteredRecords.map((record, idx) => (
              <motion.div 
                key={record.id}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "p-4 rounded-2xl cursor-pointer transition-all border group relative",
                  idx === selectedIndex 
                    ? "bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/5" 
                    : "bg-transparent border-transparent hover:bg-zinc-900 hover:border-zinc-800"
                )}
              >
                {idx === selectedIndex && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-4 bottom-4 w-1 bg-orange-500 rounded-full" 
                  />
                )}
                <div className="flex justify-between items-start mb-2 gap-2">
                  <span className={cn(
                    "text-xs font-black tracking-tight truncate transition-colors",
                    idx === selectedIndex ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                  )}>
                    {record.source.entity_name}
                  </span>
                  <span className={cn(
                    "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0",
                    record.type === 'unresolved' 
                      ? "text-orange-400 bg-orange-500/10 border border-orange-500/20" 
                      : "text-orange-500 bg-orange-500/10 border border-orange-500/20"
                  )}>
                    {record.type === 'unresolved' ? 'UNRESOLVED' : `${record.score}%`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full", record.type === 'unresolved' ? "bg-orange-400" : "bg-orange-500")} />
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest truncate">
                    {record.source.department.replace('_', ' ')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        <div className="p-4 bg-zinc-900 border-t border-zinc-800 shrink-0">
            <div className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                <Command size={10} className="shrink-0" /> 
                <span className="truncate">A: Approve | C: Create | X: Flag</span>
            </div>
        </div>
      </div>

      {/* Main Workspace - 9 Cols */}
      <div className="lg:col-span-9 flex flex-col gap-6 min-h-0 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          {!selectedEvent ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-500 bg-[#121215] border border-dashed border-zinc-800 rounded-3xl p-8"
            >
              <Info size={48} className="opacity-20" />
              <span className="text-[10px] font-black uppercase tracking-widest text-center">No Selection Match</span>
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                        <Cpu size={24} className="text-orange-500 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tighter">Resolution Workbench</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
                            <span className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-widest truncate">Engine Stage: High-Risk Conflict Arbiter</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6 self-end sm:self-auto">
                    <div className="text-right">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Match Confidence</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xl sm:text-2xl font-mono font-black text-white">{selectedEvent.score}%</span>
                            <div className="w-16 h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${selectedEvent.score}%` }}
                                    className="h-full bg-orange-500 shadow-lg shadow-orange-500/50"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
               {/* SOURCE DATA */}
               <div className="bg-zinc-950 border border-zinc-800 rounded-3xl flex flex-col p-6 sm:p-8 relative group overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                      <FileText size={120} />
                  </div>
                  <div className="flex items-center justify-between mb-8 relative z-10 gap-2">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
                            <FileText size={16} className="text-orange-500" />
                        </div>
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest truncate">Legacy Signal</span>
                     </div>
                     <span className="text-[8px] sm:text-[9px] font-mono text-orange-500/60 uppercase shrink-0">TIMESTAMP: 2026-05-06</span>
                  </div>

                  <div className="space-y-8 relative z-10 flex-1">
                     <DataField 
                        label="Entity Name (Dirty)" 
                        value={selectedEvent.source.entity_name} 
                        compareValue={selectedEvent.target?.primary_name}
                        isMismatched={!selectedEvent.matched_fields.includes('Name')}
                        color="amber"
                     />
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                        <DataField label="Department Source" value={selectedEvent.source.department.replace('_', ' ')} color="amber" />
                        <DataField label="Source ID" value={selectedEvent.source.id.split('-')[1]} color="amber" mono />
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
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
               <div className="bg-[#121215] border border-zinc-800 rounded-3xl flex flex-col p-6 sm:p-8 relative group overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                      <Building2 size={120} />
                  </div>
                  <div className="flex items-center justify-between mb-8 relative z-10 gap-2">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
                            <Building2 size={16} className="text-orange-500" />
                        </div>
                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest truncate">
                          {selectedEvent.target ? "Golden Registry Record" : "Registry Candidate"}
                        </span>
                     </div>
                     {selectedEvent.target ? (
                       <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded shrink-0">
                          <ShieldCheck size={10} className="text-orange-500" />
                          <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Verified UBID</span>
                       </div>
                     ) : (
                       <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded shrink-0">
                          <AlertTriangle size={10} className="text-orange-400" />
                          <span className="text-[8px] font-black text-orange-400 uppercase tracking-widest">No Match</span>
                       </div>
                     )}
                  </div>

                  <div className="space-y-8 relative z-10 flex-1">
                    {selectedEvent.target ? (
                      <>
                        <DataField 
                            label="Registry Name (Legal)" 
                            value={selectedEvent.target.primary_name} 
                            compareValue={selectedEvent.source.entity_name}
                            isMismatched={!selectedEvent.matched_fields.includes('Name')}
                        />
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                             <DataField label="Unified Identifier" value={selectedEvent.target.ubid} mono color="indigo" />
                             <DataField label="Record Health" value="OPTIMIZED" color="emerald" />
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
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
                      <div className="flex flex-col items-center justify-center py-20 text-center opacity-40 group-hover:opacity-60 transition-opacity px-4">
                         <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                            <Plus size={32} className="text-zinc-500" />
                         </div>
                         <h3 className="text-sm font-black text-white uppercase tracking-widest">Create New Entity</h3>
                         <p className="text-[10px] text-zinc-500 max-w-[200px] mt-2 font-mono">No matching identifier found in master registry. Use 'C' to initialize new identity.</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>

            {/* AI Reasoning & Actions Bar */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden shadow-xl">
                <div className="flex-1 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                        <Zap size={20} className="text-orange-500" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
                          {selectedEvent.type === 'unresolved' ? "Source Analysis" : "AI Reasoning Engine"}
                        </span>
                        <p className="text-xs text-zinc-300 font-medium leading-relaxed italic">
                            "{selectedEvent.ai_reasoning}"
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto shrink-0">
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
       <div className="xl:col-span-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl overflow-hidden">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Zap size={20} className="text-orange-500" />
             </div>
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest truncate">Intelligence Briefing</h3>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest truncate block">Cross-Field Conflict Analysis</span>
             </div>
          </div>
          <div className="space-y-4 overflow-x-auto custom-scrollbar">
             {selectedEvent && (
                <>
                   <MismatchRow label="Entity Name" source={selectedEvent.source.entity_name} target={selectedEvent.target?.primary_name} />
                   <MismatchRow label="Location/City" source={selectedEvent.source.address.split(',')[0]} target={selectedEvent.target?.address.split(',')[0]} />
                   <MismatchRow label="Tax Identifier" source={selectedEvent.source.gstin} target={selectedEvent.target?.gstin} />
                </>
             )}
          </div>
          <div className="pt-6 border-t border-zinc-800 flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar">
             <DecisionNode label="Phonetic" score={92} active />
             <DecisionArrow />
             <DecisionNode label="Semantic" score={selectedEvent?.score || 0} active primary />
             <DecisionArrow />
             <DecisionNode label="Geo-Loc" score={45} />
             <DecisionArrow />
             <DecisionNode label="Tax_ID" score={100} active />
          </div>
       </div>
       <div className="xl:col-span-4 flex flex-col min-h-0">
          <GlobalActionHistory />
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
        active ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-zinc-500 hover:text-white"
      )}
    >
      {label}
      <span className={cn(
        "px-2 py-0.5 rounded-full text-[8px] font-mono",
        active ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-400"
      )}>{count}</span>
    </button>
  )
}

function DataField({ label, value, compareValue, isMismatched = false, mono = false, color = "indigo" }: any) {
  const renderHighlighted = (val: string, comp: string) => {
    if (!isMismatched || !comp) return val;
    
    const chars = val.split('');
    const compChars = comp.split('');
    
    return chars.map((char, i) => {
      const isDiff = char.toLowerCase() !== compChars[i]?.toLowerCase();
      return (
        <span key={i} className={isDiff ? "text-red-500 underline decoration-red-500/50 underline-offset-4" : ""}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</label>
        {isMismatched && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-[8px] font-black text-red-500 uppercase tracking-widest"
            >
                <AlertTriangle size={10} /> Conflict Detected
            </motion.div>
        )}
      </div>
      <div className={cn(
        "text-lg font-black tracking-tighter transition-all",
        isMismatched ? "bg-red-500/10 p-2 -m-2 rounded-lg text-red-400" : "text-white",
        mono && "font-mono text-base tracking-normal",
        color === "amber" && !isMismatched && "group-hover:text-orange-400",
        color === "indigo" && !isMismatched && "group-hover:text-orange-500"
      )}>
        {renderHighlighted(value, compareValue)}
      </div>
    </div>
  )
}

function MismatchRow({ label, source, target, isMissing }: any) {
  const isMatch = source?.toLowerCase() === target?.toLowerCase();
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700">
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-4">
        <div className="text-right">
            <span className="text-[8px] block text-zinc-500 uppercase mb-0.5">Source</span>
            <span className="text-[10px] font-mono text-orange-400">{source || 'N/A'}</span>
        </div>
        <ArrowRight size={12} className="text-zinc-600" />
        <div className="text-right">
            <span className="text-[8px] block text-zinc-500 uppercase mb-0.5">Registry</span>
            <span className="text-[10px] font-mono text-orange-500">{target || 'N/A'}</span>
        </div>
        <div className={cn(
            "ml-4 px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter",
            isMatch ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
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
            active ? (primary ? "bg-orange-500 border-orange-400 shadow-lg shadow-orange-500/20" : "bg-zinc-900 border-zinc-800") : "opacity-20 grayscale"
        )}>
            <span className="text-[8px] font-black uppercase tracking-widest text-white/60">{label}</span>
            <span className="text-xs font-mono font-black text-white">{score}%</span>
        </div>
    )
}

function DecisionArrow() {
    return <ArrowRight size={12} className="text-zinc-700 shrink-0" />
}

function ReviewAction({ icon, label, onClick, variant, shortcut, pending }: any) {
  const styles = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20",
    secondary: "bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
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
        <span className="text-[8px] font-black px-1 rounded bg-black/40 border border-zinc-800">{shortcut}</span>
      </div>
    </button>
  )
}
