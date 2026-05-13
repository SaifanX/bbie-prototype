'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity, Database, CheckCircle, AlertTriangle, ChevronRight, Zap, SquareTerminal, Cpu, Globe, Share2, Fingerprint, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type SimulatedRecord = {
  id: string;
  original: string;
  cleansed: string;
  status: 'raw' | 'processing' | 'done';
}

export default function SimulatorPage() {
  const [isEngaged, setIsEngaged] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [currentData, setCurrentData] = useState<SimulatedRecord[]>([]);
  const [normalizingIndex, setNormalizingIndex] = useState<number | null>(null);
  const [showFuzzyModal, setShowFuzzyModal] = useState(false);
  const [selectedFuzzyRecord, setSelectedFuzzyRecord] = useState<SimulatedRecord | null>(null);
  const [logs, setLogs] = useState<string[]>(['> SYSTEM READY', '> Awaiting data ingestion...']);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({
    scanned: 0,
    duplicates: 0,
    clusters: 0,
    resolved: 0,
    triage: 0
  });

  const [activeAnalysis, setActiveAnalysis] = useState<any>(null);

  const loadData = async () => {
    setLogs(prev => [...prev, '> QUERYING DEPARTMENT_SOURCES FOR UNRESOLVED ENTITIES...']);
    const { data, error } = await supabase
      .from('source_records')
      .select('id, entity_name')
      .limit(30);

    if (error || !data) {
       setLogs(prev => [...prev, '> ERROR: GATEWAY TIMEOUT. RECONNECTING...']);
       return;
    }

    const formattedData: SimulatedRecord[] = data.map(r => ({
      id: r.id,
      original: r.entity_name,
      cleansed: r.entity_name.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ').replace(/Pvt|Ltd|Co/g, (m: string) => m + '.'),
      status: 'raw'
    }));

    setIsDataLoaded(true);
    setCurrentData(formattedData);
    setLogs(prev => [...prev, `> [INGESTION] ${data.length} UNRESOLVED SOURCE RECORDS LOADED. SYSTEM READY.`]);
  };

  const startNormalization = async () => {
    if (isEngaged || !isDataLoaded) return;
    setIsEngaged(true);
    setActiveStage(1);
    setLogs(prev => [...prev, '> INITIALIZING CLEANING LAYER...', '> APPLYING DATA CLEANSING RULES...']);

    // Normalization loop: 5 slow (with modal), rest fast
    for (let i = 0; i < currentData.length; i++) {
      setNormalizingIndex(i);
      const isSlowPhase = i < 5;
      const delay = isSlowPhase ? 2000 : 150; 
      
      if (isSlowPhase) {
        setSelectedFuzzyRecord(currentData[i]);
        setShowFuzzyModal(true);
      } else {
        setShowFuzzyModal(false);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      
      setCurrentData(prev => {
        const next = [...prev];
        next[i] = { ...next[i], status: 'done' };
        return next;
      });
      
      setLogs(prev => [...prev, `> CLEANSING COMPLETED: "${currentData[i].original}"`]);
    }

    await new Promise(r => setTimeout(r, 1000));

    // Stage 3: AI Reasoning
    setActiveStage(3);
    setLogs(prev => [...prev, '> [AI] Running high-dimensional fuzzy matching algorithm...', '> [AI] 18 matches identified with > 95% confidence.']);
    setStats(s => ({ ...s, resolved: 18, triage: 12 }));
    await new Promise(r => setTimeout(r, 2000));

    // Stage 4: Registry Update
    setActiveStage(4);
    setLogs(prev => [...prev, '> [SQL] BEGIN TRANSACTION; UPDATE businesses SET is_verified = true...', '> [FINALIZATION] 30 records triaged. 18 Auto-merged, 12 routed to HUMAN_REVIEW_ENGINE.', '> SYSTEM STABLE.']);
    setIsEngaged(false);
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="p-10 min-h-screen w-full bg-[#020205] text-slate-100 flex flex-col gap-8 relative overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

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
            className="relative group overflow-hidden px-8 py-4 rounded-xl bg-slate-800 text-slate-400 font-black uppercase tracking-widest transition-all hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 border border-white/5"
          >
            Load Raw Data
          </button>
          
          <button 
            onClick={startNormalization}
            disabled={!isDataLoaded || isEngaged}
            className="relative group overflow-hidden px-10 py-4 rounded-xl bg-indigo-600 text-white font-black uppercase tracking-widest transition-all hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed active:scale-95 shadow-2xl shadow-indigo-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            {isEngaged ? 'Processing...' : 'Engage Engine'}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8 z-10">
        
        {/* Ingestion Stream */}
        <div className="col-span-3 flex flex-col gap-6">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 shrink-0">
             <Share2 size={12} /> Incoming Streams
          </h3>
          <div className="glass-card p-4 relative overflow-hidden flex flex-col h-[600px]">
             <div className="absolute inset-0 data-grid opacity-10" />
             <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-4 relative pr-2">
                {currentData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 py-20 text-center">
                    <Database size={24} className="mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Awaiting Ingestion</span>
                  </div>
                ) : currentData.map((record, i) => (
                  <motion.div 
                    key={record.id}
                    layout
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 ${
                      normalizingIndex === i 
                        ? "bg-indigo-500/20 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                        : record.status === 'done' ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/5 border-white/5"
                    }`}
                  >
                    <span className={`text-[10px] font-mono truncate w-32 uppercase ${
                      normalizingIndex === i ? "text-indigo-400 font-bold" : record.status === 'done' ? "text-emerald-400" : "text-slate-400"
                    }`}>{record.status === 'done' ? record.cleansed : record.original}</span>
                    {normalizingIndex === i ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    ) : record.status === 'done' ? (
                      <CheckCircle size={10} className="text-emerald-500" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    )}
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        <div className="col-span-6 flex flex-col gap-6">
          {/* Engine Header Stats */}
          <div className="grid grid-cols-4 gap-4">
             <StatBox label="Scanned" value={stats.scanned} color="text-slate-400" />
             <StatBox label="Duplicates" value={stats.duplicates} color="text-amber-500" />
             <StatBox label="Resolved" value={stats.resolved} color="text-emerald-500" />
             <StatBox label="Triage" value={stats.triage} color="text-rose-500" />
          </div>

          <div className="flex-1 glass-card relative flex flex-col overflow-hidden border-indigo-500/10 p-8">
            <div className="absolute inset-0 data-grid opacity-5" />
            
            {/* Live Logic Panel */}
            <div className="relative z-10 flex flex-col h-full">
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">AI Logic Inspector</h2>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Real-time decision mapping</p>
                  </div>
                  {isEngaged && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full">
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                       <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Processing</span>
                    </div>
                  )}
               </div>

               <div className="flex-1 flex flex-col justify-center items-center gap-12">
                  {!isEngaged && activeStage === 0 ? (
                    <div className="text-center opacity-20">
                       <Cpu size={48} className="mx-auto mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Engine Dormant - Awaiting Engagement</p>
                    </div>
                  ) : (
                    <>
                       {/* Decision Mapping Visualization */}
                       <div className="w-full max-w-md space-y-6">
                          <AnimatePresence mode="wait">
                            {activeAnalysis ? (
                              <motion.div 
                                key={activeAnalysis.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                              >
                                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                                   <div className="space-y-1">
                                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Source Entity</span>
                                      <div className="text-sm font-mono text-white truncate w-40">{activeAnalysis.name}</div>
                                   </div>
                                   <ArrowRight size={16} className="text-indigo-500" />
                                   <div className="space-y-1 text-right">
                                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Matched To</span>
                                      <div className="text-sm font-mono text-emerald-400 truncate w-40">{activeAnalysis.match}</div>
                                   </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                   <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
                                      <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Confidence</span>
                                      <div className="text-xl font-black text-white">{activeAnalysis.score}%</div>
                                   </div>
                                   <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Status</span>
                                      <div className="text-xl font-black text-white">{activeAnalysis.score > 90 ? 'MERGE' : 'TRIAGE'}</div>
                                   </div>
                                </div>
                              </motion.div>
                            ) : (
                              <div className="h-32 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Analyzing Stream...</span>
                              </div>
                            )}
                          </AnimatePresence>
                       </div>

                       {/* Progress Timeline */}
                       <div className="w-full flex justify-around px-8 relative">
                          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2" />
                          <StageIndicator label="SCAN" active={activeStage >= 1} />
                          <StageIndicator label="CLUSTER" active={activeStage >= 2} />
                          <StageIndicator label="RESOLVE" active={activeStage >= 3} />
                          <StageIndicator label="COMMIT" active={activeStage >= 4} />
                       </div>
                    </>
                  )}
               </div>
            </div>
          </div>
        </div>

          {/* Success Overlay */}
          <AnimatePresence>
            {!isEngaged && activeStage === 4 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-[#020205]/60 backdrop-blur-sm"
              >
                <div className="glass-card border-emerald-500/30 p-8 flex flex-col items-center text-center max-w-sm">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Registry Updated</h2>
                  <p className="text-xs text-slate-400 mb-6 font-medium">10 identities resolved. 100% data integrity achieved across department sources.</p>
                  <button 
                    onClick={() => setActiveStage(0)}
                    className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors"
                  >
                    Dismiss Report
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Match Visualizer Modal */}
          <AnimatePresence>
            {showFuzzyModal && selectedFuzzyRecord && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute inset-0 z-[100] flex items-center justify-center p-8 pointer-events-none"
              >
                <div className="glass-card border-indigo-500/40 bg-indigo-950/40 backdrop-blur-3xl p-8 w-full max-w-xl shadow-[0_0_50px_rgba(99,102,241,0.2)] pointer-events-auto">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                          <Fingerprint className="text-indigo-400" size={24} />
                      </div>
                      <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-widest">Data Cleaning</h3>
                          <span className="text-[10px] font-mono text-indigo-400">VERIFYING ENTITY IDENTITY...</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Input Vector (Dirty)</label>
                          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-400 font-mono text-xs break-words">
                            {selectedFuzzyRecord.original}
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Output Signal (Clean)</label>
                          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 font-mono text-xs break-words">
                            {selectedFuzzyRecord.cleansed}
                          </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Character Match Analysis</span>
                          <span className="text-xs font-black text-indigo-400">98.4% Confidence</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '98.4%' }}
                            className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                          />
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Structure Validated</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">REF_ID: {selectedFuzzyRecord.id.slice(0, 8)}</span>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Particles / Magnetic Clustering (Only during engagement) */}
          <AnimatePresence>
            {isEngaged && [...Array(15)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ 
                  x: i % 2 === 0 ? -400 : 400, 
                  y: Math.random() * 400 - 200, 
                  opacity: 0,
                  scale: 0.5
                }}
                animate={{ 
                  x: 0, 
                  y: 0, 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.2]
                }}
                transition={{ 
                  delay: i * 0.2, 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "circIn"
                }}
                className="absolute flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm pointer-events-none"
              >
                <div className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[7px] font-mono text-indigo-300 whitespace-nowrap uppercase tracking-tighter">
                  RECORD_{Math.floor(Math.random() * 9999)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Information Terminal & Analysis Overlay */}
        <div className="col-span-3 flex flex-col gap-6">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 shrink-0">
             <SquareTerminal size={12} /> Sync Logs
          </h3>
          <div className="glass-card bg-black/60 p-4 font-mono text-[10px] leading-relaxed relative overflow-hidden flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto custom-scrollbar relative pr-2">
            <div className="space-y-2">
              {logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-slate-400 border-l border-indigo-500/30 pl-2"
                >
                  <span className="text-indigo-500/50">[{new Date().toLocaleTimeString([], { hour12: false })}]</span> {log}
                </motion.div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

          <AnimatePresence>
            {isEngaged && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card bg-indigo-500/5 border-indigo-500/20 p-4 space-y-4"
              >
                 <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Data_Analysis</span>
                    <div className="flex gap-1">
                       <div className="w-1 h-1 bg-indigo-500 animate-bounce" />
                       <div className="w-1 h-1 bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                       <div className="w-1 h-1 bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                 </div>
                 
                  <div className="space-y-3">
                    <AnalysisThread 
                      label="Phonetic Match" 
                      value={activeStage >= 2 ? "94.2%" : "CALCULATING..."} 
                      active={activeStage >= 2} 
                    />
                    <AnalysisThread 
                      label="Address Distance" 
                      value={activeStage >= 2 ? "0.12km" : "SCANNING..."} 
                      active={activeStage >= 2} 
                    />
                    <AnalysisThread 
                      label="AI Verdict" 
                      value={activeStage >= 3 ? "POSITIVE" : "PENDING..."} 
                      active={activeStage >= 3} 
                    />
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
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

function StageIndicator({ label, active }: any) {
  return (
    <div className="relative z-10 flex flex-col items-center gap-2">
       <div className={`w-3 h-3 rounded-full transition-all duration-500 border-2 ${
         active ? "bg-indigo-500 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)] scale-125" : "bg-slate-900 border-slate-800"
       }`} />
       <span className={`text-[8px] font-black uppercase tracking-widest ${active ? "text-white" : "text-slate-700"}`}>{label}</span>
    </div>
  );
}

function StageLabel({ label, active }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${active ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1] scale-125' : 'bg-slate-800'}`} />
      <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${active ? 'text-white' : 'text-slate-700'}`}>{label}</span>
    </div>
  );
}

function AnalysisThread({ label, value, active }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">{label}</span>
       <span className={active ? "text-[10px] font-mono font-bold text-indigo-400" : "text-slate-700"}>{value}</span>
    </div>
  );
}
