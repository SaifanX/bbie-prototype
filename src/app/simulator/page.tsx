'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity, Database, CheckCircle, AlertTriangle, ChevronRight, Zap, SquareTerminal, Cpu, Globe, Share2, Fingerprint, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runResolution, getUnresolvedRecords } from './actions';

type SimulatedRecord = {
  id: string;
  original: string;
  status: 'raw' | 'processing' | 'done';
}

export default function SimulatorPage() {
  const [isEngaged, setIsEngaged] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [currentData, setCurrentData] = useState<SimulatedRecord[]>([]);
  const [normalizingIndex, setNormalizingIndex] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>(['> SYSTEM READY', '> Awaiting data ingestion...']);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({
    scanned: 0,
    duplicates: 0,
    resolved: 0,
    triage: 0
  });

  const [activeAnalysis, setActiveAnalysis] = useState<any>(null);

  const loadData = async () => {
    setLogs(prev => [...prev, '> QUERYING DEPARTMENT_SOURCES FOR UNRESOLVED ENTITIES...']);
    try {
      const data = await getUnresolvedRecords();
      const formattedData: SimulatedRecord[] = data.map(r => ({
        id: r.id,
        original: r.entity_name,
        status: 'raw'
      }));

      setIsDataLoaded(true);
      setCurrentData(formattedData);
      setLogs(prev => [...prev, `> [INGESTION] ${data.length} UNRESOLVED RECORDS LOADED.`]);
    } catch (error) {
      setLogs(prev => [...prev, '> ERROR: DATABASE CONNECTION FAILED.']);
    }
  };

  const startNormalization = async () => {
    if (isEngaged || !isDataLoaded) return;
    setIsEngaged(true);
    setLogs(prev => [...prev, '> INITIALIZING BBIE ENGINE...', '> APPLYING SEMANTIC RESOLUTION...']);

    for (let i = 0; i < currentData.length; i++) {
      const record = currentData[i];
      setNormalizingIndex(i);
      setActiveStage(1);
      
      setLogs(prev => [...prev, `> ANALYZING: ${record.original}`]);
      
      try {
        // CALL THE REAL ENGINE
        const result = await runResolution(record.id);
        
        setActiveAnalysis(result);
        setActiveStage(3);

        setStats(prev => ({
          ...prev,
          scanned: prev.scanned + 1,
          resolved: result.status === 'resolved' ? prev.resolved + 1 : prev.resolved,
          triage: result.status === 'triage' ? prev.triage + 1 : prev.triage,
          duplicates: result.status === 'resolved' ? prev.duplicates + 1 : prev.duplicates
        }));

        setLogs(prev => [...prev, `> [AI] ${result.status.toUpperCase()}: ${result.score > 0 ? (result.score * 100).toFixed(0) : 0}% CONFIDENCE`]);
        
        setCurrentData(prev => {
          const next = [...prev];
          next[i] = { ...next[i], status: 'done' };
          return next;
        });

        // Small delay to let the user read the AI verdict
        await new Promise(resolve => setTimeout(resolve, 1500));
        setActiveAnalysis(null);
        setActiveStage(0);

      } catch (err) {
        setLogs(prev => [...prev, `> ERROR PROCESSING ${record.original}`]);
      }
    }

    setActiveStage(4);
    setLogs(prev => [...prev, '> [SYSTEM] BATCH COMPLETE.', '> SYSTEM STABLE.']);
    setIsEngaged(false);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="p-10 min-h-screen w-full bg-[#020205] text-slate-100 flex flex-col gap-8 relative overflow-x-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start z-10 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Engine Visualizer</span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Live Database</h1>
          <p className="text-slate-500 font-medium max-w-lg">Watch the synchronization engine resolve fragmented business identities in real-time.</p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={loadData}
            disabled={isDataLoaded || isEngaged}
            className="px-8 py-4 rounded-xl bg-slate-800 text-slate-400 font-black uppercase tracking-widest transition-all hover:bg-slate-700 disabled:opacity-50 active:scale-95 border border-white/5"
          >
            Load Raw Data
          </button>
          <button 
            onClick={startNormalization}
            disabled={!isDataLoaded || isEngaged}
            className="px-10 py-4 rounded-xl bg-indigo-600 text-white font-black uppercase tracking-widest transition-all hover:bg-indigo-500 disabled:bg-slate-800 active:scale-95 shadow-2xl shadow-indigo-500/20"
          >
            {isEngaged ? 'Processing...' : 'Engage Engine'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8 z-10">
        {/* Ingestion Column */}
        <div className="col-span-3 flex flex-col gap-6">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
             <Share2 size={12} /> Incoming Streams
          </h3>
          <div className="glass-card p-4 flex flex-col h-[650px] relative overflow-hidden">
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                {currentData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 text-center">
                    <Database size={24} className="mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Awaiting Ingestion</span>
                  </div>
                ) : currentData.map((record, i) => (
                  <motion.div 
                    key={record.id}
                    layout
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      normalizingIndex === i ? "bg-indigo-500/20 border-indigo-500/40" : "bg-white/5 border-white/5"
                    }`}
                  >
                    <span className="text-[10px] font-mono truncate w-32 uppercase text-slate-400">{record.original}</span>
                    {record.status === 'done' ? <CheckCircle size={10} className="text-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />}
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Center Analysis Column */}
        <div className="col-span-6 flex flex-col gap-6">
          <div className="grid grid-cols-4 gap-4">
             <StatBox label="Scanned" value={stats.scanned} color="text-slate-400" />
             <StatBox label="Duplicates" value={stats.duplicates} color="text-amber-500" />
             <StatBox label="Resolved" value={stats.resolved} color="text-emerald-500" />
             <StatBox label="Triage" value={stats.triage} color="text-rose-500" />
          </div>

          <div className="flex-1 glass-card p-8 relative flex flex-col items-center justify-center">
             <AnimatePresence mode="wait">
                {activeAnalysis ? (
                  <motion.div 
                    key="analysis"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="w-full space-y-8"
                  >
                    <div className="flex flex-col items-center gap-4 text-center">
                       <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
                          <Cpu size={32} className="text-indigo-400 animate-pulse" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Forensic Analysis</p>
                          <h2 className="text-2xl font-black text-white uppercase tracking-tight">{currentData[normalizingIndex!].original}</h2>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Similarity Index</span>
                          <div className="text-3xl font-black text-white">{(activeAnalysis.score * 100).toFixed(0)}%</div>
                       </div>
                       <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                          <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Status</span>
                          <div className={`text-xl font-black uppercase ${
                            activeAnalysis.status === 'resolved' ? 'text-emerald-500' : 'text-amber-500'
                          }`}>
                            {activeAnalysis.status}
                          </div>
                       </div>
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-2 opacity-20">
                          <Fingerprint size={40} />
                       </div>
                       <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-3">AI Verdict</span>
                       <p className="text-sm font-medium text-slate-300 italic leading-relaxed">
                          "{activeAnalysis.verdict}"
                       </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    className="text-center"
                  >
                     <Cpu size={64} className="mx-auto mb-6" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Engine Dormant</p>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

        {/* Logs Column */}
        <div className="col-span-3 flex flex-col gap-6">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
             <SquareTerminal size={12} /> Sync Logs
          </h3>
          <div className="glass-card bg-black/60 p-4 font-mono text-[10px] flex flex-col h-[650px] overflow-hidden">
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                {logs.map((log, i) => (
                  <div key={i} className="text-slate-400 border-l border-indigo-500/30 pl-2">
                    {log}
                  </div>
                ))}
                <div ref={logsEndRef} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <div className="glass-card p-4 flex flex-col border-white/5">
       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</span>
       <span className={`text-2xl font-black ${color} tracking-tighter`}>{value}</span>
    </div>
  );
}
