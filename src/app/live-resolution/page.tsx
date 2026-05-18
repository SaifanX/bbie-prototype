'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, Database, CheckCircle, AlertTriangle, ChevronRight, Zap, SquareTerminal, Cpu, Globe, Share2, Fingerprint, ArrowRight, ShieldAlert, StopCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runResolution, getUnresolvedRecords } from './actions';
import { supabase } from '@/utils/supabase';
import { cn } from '@/utils/cn';
import GlobalActionHistory from '@/components/GlobalActionHistory';
import { addHistoryEntry } from '@/utils/history';

type SimulatedRecord = {
  id: string;
  original: string;
  status: 'raw' | 'processing' | 'done';
}

type SystemLog = {
  id: string;
  message: string;
  stage: string;
  severity: string;
  created_at: string;
}

export default function LiveResolutionPage() {
  const [isEngaged, setIsEngaged] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [currentData, setCurrentData] = useState<SimulatedRecord[]>([]);
  const [normalizingIndex, setNormalizingIndex] = useState<number | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [showMaskingOnly, setShowMaskingOnly] = useState(false);
  const [showMaskingModal, setShowMaskingModal] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({
    scanned: 0,
    duplicates: 0,
    resolved: 0,
    triage: 0
  });

  const [activeAnalysis, setActiveAnalysis] = useState<any>(null);
  const abortRef = useRef(false);

  // Subscribe to real-time logs and load persistent state
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('bbie_live_current_data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.length > 0) {
          setCurrentData(parsed);
          setIsDataLoaded(true);
        }
      }

      const savedStats = localStorage.getItem('bbie_live_stats');
      if (savedStats) setStats(JSON.parse(savedStats));

      supabase.from('system_logs').select('*').order('created_at', { ascending: false }).limit(50).then(({ data }) => {
        if (data) setLogs(data.reverse());
      });
    } catch (e) {
      console.error('Failed to load live resolution state:', e);
    }

    const channel = supabase
      .channel('system_logs_live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_logs' },
        (payload) => {
          setLogs(prev => [payload.new as SystemLog, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    const handleRefresh = () => {
      try {
        const savedData = localStorage.getItem('bbie_live_current_data');
        if (savedData) setCurrentData(JSON.parse(savedData));

        const savedStats = localStorage.getItem('bbie_live_stats');
        if (savedStats) setStats(JSON.parse(savedStats));
      } catch (e) {}
    };

    window.addEventListener('bbie_live_data_refresh', handleRefresh);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('bbie_live_data_refresh', handleRefresh);
    };
  }, []);

  // Save currentData to localStorage whenever it changes
  useEffect(() => {
    if (currentData.length > 0) {
      localStorage.setItem('bbie_live_current_data', JSON.stringify(currentData));
    }
  }, [currentData]);

  // Save stats to localStorage whenever it changes
  useEffect(() => {
    if (stats.scanned > 0 || stats.resolved > 0 || stats.triage > 0 || stats.duplicates > 0) {
      localStorage.setItem('bbie_live_stats', JSON.stringify(stats));
    }
  }, [stats]);

  const loadData = async () => {
    try {
      localStorage.removeItem('bbie_live_current_data');
      localStorage.removeItem('bbie_live_stats');
      localStorage.removeItem('bbie_action_history');
      window.dispatchEvent(new Event('bbie_history_change'));
      setStats({ scanned: 0, duplicates: 0, resolved: 0, triage: 0 });
      setLogs([]);

      const data = await getUnresolvedRecords();
      const formattedData: SimulatedRecord[] = data.map(r => ({
        id: r.id,
        original: r.entity_name,
        status: 'raw'
      }));

      setIsDataLoaded(true);
      setCurrentData(formattedData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const startNormalization = async () => {
    if (isEngaged || !isDataLoaded) return;
    setIsEngaged(true);
    abortRef.current = false;

    for (let i = 0; i < currentData.length; i++) {
      if (abortRef.current) break;

      const record = currentData[i];
      setNormalizingIndex(i);
      
      try {
        setActiveStage(0); await new Promise(r => setTimeout(r, 400));
        if (abortRef.current) break;
        setActiveStage(1); await new Promise(r => setTimeout(r, 400));
        if (abortRef.current) break;
        setActiveStage(2); await new Promise(r => setTimeout(r, 400));
        if (abortRef.current) break;

        const result = await runResolution(record.id);
        setActiveAnalysis(result);

        setActiveStage(3); await new Promise(r => setTimeout(r, 800));
        setActiveStage(4); await new Promise(r => setTimeout(r, 600));

        addHistoryEntry({ recordId: record.id, businessId: result.matchedBusinessId, entityName: record.original, status: result.status });

        setStats(prev => ({
          ...prev,
          scanned: prev.scanned + 1,
          resolved: result.status === 'resolved' ? prev.resolved + 1 : prev.resolved,
          triage: result.status === 'triage' ? prev.triage + 1 : prev.triage,
          duplicates: result.status === 'new_entity' ? prev.duplicates + 1 : prev.duplicates
        }));

        setCurrentData(prev => {
          const next = [...prev];
          next[i] = { ...next[i], status: 'done' };
          return next;
        });

        await new Promise(resolve => setTimeout(resolve, 600));
        setActiveAnalysis(null);
      } catch (err) {
        console.error(`Error processing ${record.original}:`, err);
      }
    }

    setIsEngaged(false);
  };

  const handleStop = () => {
    abortRef.current = true;
    setIsEngaged(false);
  };

  return (
    <div className="p-10 min-h-screen w-full bg-[#09090b] text-zinc-100 flex flex-col gap-10 relative overflow-x-hidden selection:bg-orange-500/30">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 z-10 shrink-0 border-b border-zinc-800 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-orange-500 fill-orange-500" />
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em]">System.Executive_Engine</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">Live Resolution</h1>
          <p className="text-zinc-500 font-bold max-w-lg mt-2 uppercase text-[11px] tracking-widest opacity-80">
            Real-time identity orchestration & fragmentation resolution.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
          <button 
            onClick={() => setShowMaskingModal(true)}
            className="px-6 py-5 rounded-xl bg-orange-500/10 text-orange-500 font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-orange-500 hover:text-white border border-orange-500/20 flex items-center gap-2 shadow-lg shadow-orange-500/10 active:scale-95"
          >
            <ShieldAlert size={16} />
            🛡️ LLM PII Masking Audit
          </button>
          <button 
            onClick={loadData}
            disabled={isDataLoaded || isEngaged}
            className="px-8 py-5 rounded-xl bg-zinc-900 text-zinc-400 font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-zinc-800 disabled:opacity-30 border border-zinc-800"
          >
            01. Ingest Fragments
          </button>
          {isEngaged ? (
            <button
              onClick={handleStop}
              className="px-10 py-5 rounded-xl bg-red-600/80 text-white font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-red-500 border border-red-400/20 flex items-center gap-3"
            >
              <StopCircle size={14} />
              Stop Engine
            </button>
          ) : (
            <button 
              onClick={startNormalization}
              disabled={!isDataLoaded || isEngaged}
               className="px-10 py-5 rounded-xl bg-orange-500 text-white font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-orange-600 hover:scale-[1.02] disabled:bg-zinc-900 disabled:opacity-50 active:scale-95 border border-orange-500 group relative overflow-hidden"
            >
              <span className="relative z-10">02. Execute Protocol</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        {/* Ingestion Column */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
               <Database size={12} className="text-orange-500" /> Source Records
            </h3>
            <span className="text-[10px] font-mono text-zinc-600">{currentData.length} Loaded</span>
          </div>
          
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 flex flex-col h-[650px] relative overflow-hidden group">
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 relative z-10">
                {currentData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 text-center">
                    <Database size={32} className="mb-4 text-zinc-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Awaiting Ingestion...</span>
                  </div>
                ) : currentData.map((record, i) => (
                  <motion.div 
                    key={record.id}
                    layout
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all duration-500",
                      normalizingIndex === i 
                        ? "bg-orange-500/10 border-orange-500/40" 
                        : "bg-zinc-900 border-zinc-800"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-[10px] font-black truncate w-40 uppercase tracking-tight",
                        normalizingIndex === i ? "text-orange-500" : "text-zinc-300"
                      )}>{record.original}</span>
                      <span className="text-[8px] font-mono text-zinc-600 mt-1">ID: {record.id.split('-')[0]}</span>
                    </div>
                    {record.status === 'done' ? (
                      <CheckCircle size={14} className="text-orange-500" />
                    ) : (
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        normalizingIndex === i ? "bg-orange-500" : "bg-zinc-800"
                      )} />
                    )}
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Center Analysis Column */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
             <StatBox label="Scanned" value={stats.scanned} color="text-zinc-400" />
             <StatBox label="Identified" value={stats.duplicates} color="text-orange-500" />
             <StatBox label="Resolved" value={stats.resolved} color="text-white" />
             <StatBox label="Triaged" value={stats.triage} color="text-orange-300" />
          </div>

          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-[40px] p-6 sm:p-10 relative flex flex-col items-center justify-center overflow-hidden">
             
             <AnimatePresence mode="wait">
                {activeAnalysis ? (
                  <motion.div 
                    key="analysis"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="w-full space-y-12 relative z-10"
                  >
                    <div className="flex flex-col items-center gap-8 text-center">
                       <div className="w-24 h-24 rounded-[30px] bg-orange-500/10 flex items-center justify-center border border-orange-500/20 relative group">
                          <Cpu size={40} className="text-orange-500" />
                          <div className="absolute inset-0 border border-orange-500/0 group-hover:border-orange-500/20 transition-all rounded-[30px]" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] mb-4">Core.Resolution_Arbitration</p>
                          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none italic break-all">
                            {currentData[normalizingIndex!].original}
                          </h2>
                       </div>
                    </div>

                    {/* Pipeline Visualizer */}
                    <div className="grid grid-cols-5 gap-2 sm:gap-4 px-2 sm:px-4">
                       {['Ingest', 'Shield', 'Vector', 'Align', 'Issue'].map((step, idx) => (
                         <div key={step} className="flex flex-col gap-3">
                            <div className={cn(
                              "h-2 rounded-full transition-all duration-1000 ease-out",
                               idx <= activeStage ? "bg-orange-500" : "bg-zinc-900"
                            )} />
                            <span className={cn(
                              "text-[8px] sm:text-[9px] font-black uppercase text-center tracking-[0.2em]",
                              idx <= activeStage ? "text-orange-500" : "text-zinc-700"
                            )}>{step}</span>
                         </div>
                       ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[30px] relative group overflow-hidden">
                           <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-3">
                             {activeAnalysis.status === 'new_entity' ? 'Data Quality Index' : 'Confidence Index'}
                           </span>
                           <div className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter">
                             {activeAnalysis.status === 'new_entity' 
                               ? <>{(activeAnalysis.score * 100).toFixed(0)}<span className="text-orange-500">%</span></>
                               : <>{(activeAnalysis.score * 100).toFixed(0)}<span className="text-orange-500">%</span></>}
                           </div>
                       </div>
                       <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[30px] relative group overflow-hidden">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-3">Protocol Verdict</span>
                          <div className={cn(
                            "text-xl sm:text-2xl font-black uppercase italic tracking-tighter",
                            activeAnalysis.status === 'resolved' ? 'text-orange-500' : 
                            activeAnalysis.status === 'triage' ? 'text-orange-300' : 'text-white'
                          )}>
                            {activeAnalysis.status.replace('_', ' ')}
                          </div>
                       </div>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 p-6 sm:p-8 rounded-[32px] relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                          <ShieldAlert size={64} className="text-orange-500" />
                       </div>
                       <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] block mb-4">AI Reasoning Trace</span>
                        <p className="text-xs sm:text-sm font-bold text-zinc-300 italic leading-relaxed uppercase tracking-tight">
                           "{activeAnalysis.verdict}"
                        </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                     <div className="relative inline-block mb-10">
                        <Cpu size={100} className="text-zinc-800" />
                        <div className="absolute inset-0 border-2 border-orange-500/20 rounded-full animate-spin [animation-duration:10s]" />
                     </div>
                     <p className="text-xs font-black uppercase tracking-[0.6em] text-zinc-600">Resolution_Engine_Standby</p>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

        {/* Logs + Undo Column */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-[650px]">

          {/* Global Undo History */}
          <GlobalActionHistory />

          {/* Intelligence Feed */}
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
               <SquareTerminal size={12} className="text-orange-500" /> Intelligence Feed
            </h3>
            <button 
              onClick={() => setShowMaskingOnly(!showMaskingOnly)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border flex items-center gap-1.5 active:scale-95",
                showMaskingOnly 
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20" 
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
              )}
            >
              <ShieldAlert size={10} className={showMaskingOnly ? "text-white" : "text-orange-500"} />
              {showMaskingOnly ? "AI Masking Only" : "Filter Masking"}
            </button>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 font-mono text-[10px] flex flex-col flex-1 overflow-hidden">
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                {logs.length === 0 ? (
                  <div className="text-zinc-700 animate-pulse italic mt-10 text-center tracking-[0.3em] uppercase text-[9px]">
                    Waiting for engine events...
                  </div>
                ) : logs.filter(l => !showMaskingOnly || l.stage === 'ai_masking').map((log) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log.id} 
                    className={cn(
                      "border-l-2 pl-4 py-2 transition-colors",
                      log.stage === 'ai_masking' ? "border-orange-500 bg-orange-500/10 p-3 rounded-r-xl shadow-lg shadow-orange-500/5" :
                      log.stage === 'decision' ? "border-orange-500 bg-orange-500/5" :
                      log.stage === 'comparison' ? "border-orange-800" : "border-zinc-800"
                    )}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] font-black uppercase text-orange-500/80 tracking-widest">{log.stage}</span>
                      <span className="text-[8px] text-zinc-600 font-mono">
                        {new Date(log.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <div className={cn(
                      "font-bold leading-relaxed uppercase tracking-tighter text-[11px]",
                      log.stage === 'ai_masking' ? "text-orange-200 font-mono text-[10px] whitespace-pre-wrap" :
                      log.stage === 'decision' ? "text-orange-100" : "text-zinc-500"
                    )}>
                      {log.message}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* AI Masking Audit Modal */}
      <AnimatePresence>
        {showMaskingModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-5xl max-h-[85vh] bg-[#121215] border border-zinc-800 rounded-[32px] p-8 flex flex-col gap-6 shadow-2xl overflow-hidden relative"
            >
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/10">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">LLM PII Masking Audit Ledger</h2>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Real-time verification of in-memory data sanitization prior to Gemini AI transmission</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMaskingModal(false)}
                  className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-zinc-800 active:scale-95"
                >
                  Close Audit Ledger
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pr-2">
                {logs.filter(l => l.stage === 'ai_masking').length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center opacity-40">
                    <ShieldAlert size={48} className="mb-4 text-orange-500" />
                    <p className="text-sm font-black uppercase tracking-widest text-zinc-300">No AI Masking Prompts Logged Yet</p>
                    <p className="text-xs text-zinc-500 font-medium mt-2 max-w-md">Run the resolution engine protocol to view real-time cryptographic masking prompts sent to Gemini LLM.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {logs.filter(l => l.stage === 'ai_masking').map((log, idx) => (
                      <div key={log.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-orange-500/20 transition-all group">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Zap size={12} /> Prompt Audit #{logs.filter(l => l.stage === 'ai_masking').length - idx}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                          {log.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest relative z-10">
                <span>🛡️ State-of-the-art sparse masking applied in memory</span>
                <span>🔒 Zero PII transmitted to external AI endpoints</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex flex-col relative overflow-hidden group">
       <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Activity size={28} className="text-orange-500" />
       </div>
       <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">{label}</span>
       <span className={`text-4xl font-black ${color} tracking-tighter italic`}>{value}</span>
    </div>
  );
}
