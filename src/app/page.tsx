'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Shield, Zap, Globe, Database, ArrowRight, Fingerprint, Search, ShieldCheck, Activity, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useRef, useEffect } from 'react';

export default function PresentationLanding() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Mouse parallax logic removed for visual stability
  useEffect(() => {
  }, []);

  // Scroll transforms removed for flat matte stability

  return (
    <div ref={containerRef} className="bg-[#08080a] text-white selection:bg-orange-500/30 overflow-x-hidden">
      
      {/* --- SECTION 1: HERO (THE VISION) --- */}
      <section className="h-screen flex flex-col items-center justify-center px-6 relative z-20">
        <motion.div 
          className="text-center"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.5em] text-orange-500">Bharat Intelligence Framework</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-10 italic"
          >
            One Identity.<br />
            <span className="text-orange-500 uppercase">One Truth.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-300 font-bold max-w-2xl mx-auto mb-12 leading-relaxed uppercase tracking-wider text-[13px]"
          >
            Unifying fragmented business records through forensic-grade semantic intelligence. The National System of Record.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/dashboard" className="px-12 py-6 bg-orange-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-orange-500 transition-all active:scale-95 flex items-center gap-4">
              Enter Governance Hub <ArrowRight size={18} />
            </Link>
            <Link href="/how-it-works" className="px-12 py-6 bg-white/10 border border-white/20 text-white rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all active:scale-95 flex items-center gap-4">
              Resolution Protocol
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* --- SECTION 2: THE NATIONAL CHALLENGE (THE PROBLEM) --- */}
      <section className="min-h-screen py-40 px-6 relative z-30 bg-[#08080a] overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] block mb-4">The Challenge</span>
             <h2 className="text-6xl font-black uppercase tracking-tighter text-white italic">Fragmented Identity Silos</h2>
             <p className="text-slate-500 font-bold mt-4 max-w-2xl mx-auto uppercase text-[11px] tracking-widest opacity-70">Disconnected registries leading to an identity crisis that compromises national economic oversight.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-20">
             <SiloCard name="MCA-21" type="Corporate" desc="Primary company registry with legacy address formatting." />
             <SiloCard name="GSTN" type="Taxation" desc="High-frequency transaction data with phonetic variances." />
             <SiloCard name="Udyam" type="MSME" desc="Massive volume of micro-entities with incomplete metadata." />
             <SiloCard name="PF/ESI" type="Labour" desc="Employment logs drifting from registered legal addresses." />
             <SiloCard name="Licenses" type="Local" desc="Trade licenses issued locally with zero central synchronization." />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mt-40">
             <div className="space-y-12">
                <ProblemCard 
                  icon={<Zap className="text-orange-500" />}
                  title="Identifier Drift"
                  desc="A business named 'Sri Sai Entp' in GST might be 'Sri Sai Enterprises' in MCA. Without a unified UBID, they are disconnected fragments."
                />
                <ProblemCard 
                  icon={<Activity className="text-orange-500" />}
                  title="The Shell Network"
                  desc="Fraudulent actors exploit these gaps by registering multiple identities with a single physical address, bypassing sectoral oversight."
                />
             </div>
             <div className="bg-orange-600/[0.02] border border-orange-600/10 p-12 rounded-[40px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                   <Shield size={120} className="text-orange-600" />
                </div>
                <h3 className="text-orange-500 font-black uppercase tracking-widest text-xs mb-8">Live Anomaly Analysis</h3>
                <div className="space-y-6 relative z-10">
                   <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duplicate PAN Detection</span>
                      <span className="text-orange-500 font-black text-[10px] bg-orange-500/10 px-3 py-1 rounded-full uppercase">Critical</span>
                   </div>
                   <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address Divergence</span>
                      <span className="text-orange-300 font-black text-[10px] bg-orange-300/10 px-3 py-1 rounded-full uppercase">High Risk</span>
                   </div>
                   <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sectoral Dormancy</span>
                      <span className="text-slate-500 font-black text-[10px] bg-slate-500/10 px-3 py-1 rounded-full uppercase">Monitoring</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: THE FORENSIC BLUEPRINT (HOW IT WORKS) --- */}
      <section className="min-h-screen py-40 px-6 relative z-30 bg-[#08080a] overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
             <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] block mb-4">The Solution</span>
             <h2 className="text-6xl font-black uppercase tracking-tighter text-white italic">The Resolution Framework</h2>
             <p className="text-slate-500 font-bold mt-4 max-w-2xl mx-auto uppercase text-[11px] tracking-widest opacity-70">A 3-Phase Intelligence Pipeline transforming departmental noise into a National System of Record.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 hidden md:block" />
             
             <StepCard 
               step="01"
               title="Unified Ingestion"
               desc="Siloed data from MCA, GST, and MSME is ingested into a 'Sovereignty Buffer' where PII is scrubbed and identifiers are normalized."
               icon={<Database className="text-orange-500" />}
             />
             <StepCard 
               step="02"
               title="Semantic Resolution"
               desc="Our Vector Engine performs a 'Sniper Match' across records, using spatial anchoring to resolve fragments into a unique UBID."
               icon={<Fingerprint className="text-orange-500" />}
             />
             <StepCard 
               step="03"
               title="Operational Intel"
               desc="Clean data feeds the Command Center, providing auditors with forensic timelines and anomaly alerts for proactive governance."
               icon={<Activity className="text-orange-500" />}
             />
          </div>
        </div>
      </section>

      {/* --- SECTION 4: THE IMPACT (THE RESULTS) --- */}
      <section className="min-h-screen py-40 px-6 relative z-30 bg-[#08080a] overflow-hidden border-t border-white/5">
        
        <div className="max-w-5xl mx-auto bg-white/[0.02] border border-white/10 rounded-[60px] p-24 text-center relative z-10">
           <div className="w-24 h-24 bg-orange-600/10 rounded-[32px] flex items-center justify-center mx-auto mb-12 border border-orange-600/20">
              <ShieldCheck size={48} className="text-orange-500" />
           </div>
           <h2 className="text-5xl font-black uppercase tracking-tighter text-white mb-10 italic">Ready for Governance</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center mb-16">
              <div>
                <div className="text-5xl font-black text-white mb-3 tracking-tighter">99.8%</div>
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Accuracy</div>
              </div>
              <div>
                <div className="text-5xl font-black text-white mb-3 tracking-tighter">30ms</div>
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Latency</div>
              </div>
              <div>
                <div className="text-5xl font-black text-white mb-3 tracking-tighter">ZERO</div>
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Leakage</div>
              </div>
              <div>
                <div className="text-5xl font-black text-white mb-3 tracking-tighter">LIVE</div>
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Stream</div>
              </div>
           </div>

           <Link href="/dashboard" className="px-16 py-8 bg-orange-600 text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-orange-500 transition-all active:scale-95 inline-flex items-center gap-6">
              Access Governance Hub <ArrowRight size={20} />
           </Link>
        </div>
      </section>

      <footer className="py-24 border-t border-white/5 text-center bg-[#08080a]">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em]">© 2026 Bharat Intelligence Engine | National Infrastructure</p>
      </footer>
    </div>
  );
}

function SiloCard({ name, type, desc }: any) {
  return (
    <div className="bg-[#121214] p-8 border border-white/10 rounded-[32px] hover:border-orange-500/30 transition-all text-center group">
       <span className="text-[8px] font-black text-orange-600 uppercase tracking-[0.3em] block mb-3 opacity-70 group-hover:opacity-100">{type}</span>
       <h4 className="text-lg font-black text-white uppercase tracking-tighter mb-3 italic">{name}</h4>
       <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest group-hover:text-slate-200 transition-colors">{desc}</p>
    </div>
  )
}

function StepCard({ step, title, desc, icon }: any) {
  return (
    <div className="bg-[#121214] p-12 border border-white/10 rounded-[48px] hover:border-orange-600/30 transition-all group relative z-10 ">
       <div className="text-6xl font-black text-white/5 absolute top-8 right-10 group-hover:text-orange-600/10 transition-colors italic">{step}</div>
       <div className="w-16 h-16 bg-orange-600/5 rounded-[24px] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform border border-orange-600/10">
          {icon}
       </div>
       <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 italic">{title}</h3>
        <p className="text-sm text-slate-400 font-bold leading-relaxed uppercase text-[11px] tracking-widest group-hover:text-slate-200 transition-colors">{desc}</p>
    </div>
  )
}

function ProblemCard({ icon, title, desc }: any) {
  return (
    <div className="flex gap-8 items-start group">
       <div className="w-14 h-14 bg-orange-600/5 rounded-[24px] flex items-center justify-center flex-shrink-0 group-hover:bg-orange-600/10 transition-colors border border-orange-600/10">
          {icon}
       </div>
       <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3 italic">{title}</h3>
          <p className="text-sm text-slate-400 font-bold leading-relaxed uppercase text-[11px] tracking-widest group-hover:text-slate-200 transition-colors">{desc}</p>
       </div>
    </div>
  )
}

function TechCard({ icon, title, desc }: any) {
  return (
    <div className="glass-card p-12 border-white/5 hover:border-orange-500/30 transition-all group text-center hover:-translate-y-4 duration-500">
       <div className="w-16 h-16 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all">
          {icon}
       </div>
       <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{title}</h3>
        <p className="text-sm text-slate-400 font-medium leading-relaxed group-hover:text-slate-200 transition-colors">{desc}</p>
    </div>
  )
}
