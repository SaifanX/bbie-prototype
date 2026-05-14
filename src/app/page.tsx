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

  // Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  const tiltX = useTransform(dy, [-0.5, 0.5], [5, -5]);
  const tiltY = useTransform(dx, [-0.5, 0.5], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hero section specific transforms
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -150]);
  const yBg = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  return (
    <div ref={containerRef} className="bg-[#020617] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* --- SECTION 1: HERO (THE VISION) --- */}
      <section className="h-screen sticky top-0 flex flex-col items-center justify-center px-6 z-20">
        <motion.div 
          style={{ opacity, scale, y: yHero, rotateX: tiltX, rotateY: tiltY, perspective: 1000 }}
          className="text-center"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <ShieldCheck size={24} />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.5em] text-indigo-400">Bharat Intelligence Framework</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-10"
          >
            One Identity.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-500 bg-[length:200%_auto] animate-gradient">One Truth.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Unifying 1.4 billion identities through forensic-grade semantic intelligence. The National System of Record for Bharat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 hover:text-white transition-all active:scale-95 flex items-center gap-4 shadow-2xl shadow-white/10">
              Enter Governance Hub <ArrowRight size={18} />
            </Link>
            <Link href="/how-it-works" className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95 flex items-center gap-4">
              The Resolution Framework
            </Link>
          </motion.div>
        </motion.div>

        {/* Ambient Visuals */}
        <motion.div style={{ opacity, y: yBg }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#020617] to-transparent" />
        </motion.div>
      </section>

      {/* --- SECTION 2: THE NATIONAL CHALLENGE (THE PROBLEM) --- */}
      <section className="min-h-screen py-40 px-6 relative z-30 bg-[#020617] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] block mb-4">The Challenge</span>
             <h2 className="text-6xl font-black uppercase tracking-tighter text-white">Fragmented Identity Silos</h2>
             <p className="text-slate-500 font-medium mt-4 max-w-2xl mx-auto">Bharat's regulatory landscape is divided into disconnected registries, leading to a "Phantom Identity" crisis that costs billions in tax leakage and fraud.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-20">
             <SiloCard name="MCA-21" type="Corporate" desc="Primary company registry with outdated address formats." />
             <SiloCard name="GSTN" type="Taxation" desc="High-frequency transaction data with phonetic name variations." />
             <SiloCard name="Udyam" type="MSME" desc="Massive volume of micro-entities with incomplete identifiers." />
             <SiloCard name="PF/ESI" type="Labour" desc="Employment logs that often drift from registered entity data." />
             <SiloCard name="Licenses" type="Local" desc="Trade licenses issued at local levels with zero central sync." />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mt-40">
             <div className="space-y-12">
                <ProblemCard 
                  icon={<Zap className="text-rose-500" />}
                  title="Identifier Drift"
                  desc="A business named 'Sri Sai Entp' in GST might be 'Sri Sai Enterprises' in MCA. Without a unified UBID, they are treated as two separate legal entities."
                />
                <ProblemCard 
                  icon={<Activity className="text-rose-500" />}
                  title="The Shell Network"
                  desc="Fraudulent actors exploit these gaps by registering multiple identities with a single physical address, bypassing sectoral oversight."
                />
             </div>
             <div className="glass-card p-10 border-rose-500/10 bg-rose-500/[0.02]">
                <h3 className="text-rose-500 font-black uppercase tracking-widest text-xs mb-6">Live Anomaly Analysis</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duplicate PAN Detection</span>
                      <span className="text-rose-400 font-mono text-xs">CRITICAL</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address Divergence</span>
                      <span className="text-amber-400 font-mono text-xs">HIGH RISK</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sectoral Dormancy</span>
                      <span className="text-slate-500 font-mono text-xs">MONITORING</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: THE FORENSIC BLUEPRINT (HOW IT WORKS) --- */}
      <section className="min-h-screen py-40 px-6 relative z-30 bg-[#020205] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] block mb-4">The Solution</span>
             <h2 className="text-6xl font-black uppercase tracking-tighter text-white">The Resolution Framework</h2>
             <p className="text-slate-500 font-medium mt-4 max-w-2xl mx-auto">Our 3-Phase Intelligence Pipeline transforms departmental noise into a National System of Record.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 hidden md:block" />
             
             <StepCard 
               step="01"
               title="Unified Ingestion"
               desc="Messy, siloed data from MCA, GST, and MSME is ingested into a 'Sovereignty Buffer' where PII is scrubbed and identifiers are normalized."
               icon={<Database className="text-indigo-400" />}
             />
             <StepCard 
               step="02"
               title="Semantic Resolution"
               desc="The 3072-dim Vector Engine performs a 'Sniper Match' across 1.4B records, using spatial anchoring to resolve identity fragments into a unique UBID."
               icon={<Fingerprint className="text-emerald-400" />}
             />
             <StepCard 
               step="03"
               title="Operational Intel"
               desc="Clean data feeds the Command Center, providing auditors with a forensic timeline and high-risk anomaly alerts for instant governance."
               icon={<Activity className="text-amber-400" />}
             />
          </div>
        </div>
      </section>

      {/* --- SECTION 3.5: THE THREE PILLARS (THE LOGIC) --- */}
      <section className="py-40 px-6 relative z-30 bg-[#020205]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] block mb-4">Forensic Logic</span>
             <h2 className="text-6xl font-black uppercase tracking-tighter text-white">The Three Pillars of Truth</h2>
             <p className="text-slate-500 font-medium mt-4 max-w-2xl mx-auto">How we transform billions of identity fragments into a single National System of Record.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-10 border-white/5 bg-white/[0.01] hover:border-indigo-500/20 transition-all">
               <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8">
                  <Database className="text-indigo-400" size={28} />
               </div>
               <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Unified Ingestion</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed">Collecting messy, siloed data from MCA, GSTN, and MSME into a normalized sovereignty buffer.</p>
            </div>
            <div className="glass-card p-10 border-white/5 bg-white/[0.01] hover:border-emerald-500/20 transition-all">
               <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8">
                  <Fingerprint className="text-emerald-400" size={28} />
               </div>
               <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Precision Alignment</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed">Using 3072-dim Vector Search to resolve identities across phonetic and spatial variations with 99.8% accuracy.</p>
            </div>
            <div className="glass-card p-10 border-white/5 bg-white/[0.01] hover:border-amber-500/20 transition-all">
               <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8">
                  <Cpu className="text-amber-400" size={28} />
               </div>
               <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Learning Audit</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed">A human-in-the-loop feedback system that retrains the engine with every forensic decision.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: THE IMPACT (THE RESULTS) --- */}
      <section className="min-h-screen py-40 px-6 relative z-30 bg-[#020617] overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/5 blur-[120px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto glass-card p-20 border-white/10 text-center relative z-10">
           <ShieldCheck size={64} className="text-emerald-400 mx-auto mb-10" />
           <h2 className="text-5xl font-black uppercase tracking-tighter text-white mb-8">Ready for Governance</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div>
                <div className="text-4xl font-black text-white mb-2">99.8%</div>
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Resolution Accuracy</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white mb-2">30ms</div>
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Match Latency</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white mb-2">Zero</div>
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">PII Leakage</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white mb-2">LIVE</div>
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Anomaly Stream</div>
              </div>
           </div>

           <Link href="/dashboard" className="mt-20 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all active:scale-95 inline-flex items-center gap-4 shadow-xl shadow-indigo-500/20">
              Access the Governance Hub <ArrowRight size={18} />
           </Link>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
         <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">© 2026 Bharat Intelligence Engine | Confidential Infrastructure</p>
      </footer>
    </div>
  );
}

function SiloCard({ name, type, desc }: any) {
  return (
    <div className="glass-card p-6 border-white/5 bg-white/[0.01] hover:border-indigo-500/20 transition-all text-center">
       <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest block mb-2">{type}</span>
       <h4 className="text-lg font-black text-white uppercase tracking-tighter mb-2">{name}</h4>
       <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  )
}

function StepCard({ step, title, desc, icon }: any) {
  return (
    <div className="glass-card p-10 border-white/5 bg-[#020205] hover:border-indigo-500/30 transition-all group relative z-10">
       <div className="text-4xl font-black text-white/5 absolute top-4 right-6 group-hover:text-indigo-500/10 transition-colors">{step}</div>
       <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">{title}</h3>
       <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  )
}

function ProblemCard({ icon, title, desc }: any) {
  return (
    <div className="flex gap-6 items-start group">
       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
          {icon}
       </div>
       <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{title}</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  )
}

function TechCard({ icon, title, desc }: any) {
  return (
    <div className="glass-card p-12 border-white/5 hover:border-indigo-500/30 transition-all group text-center hover:-translate-y-4 duration-500">
       <div className="w-16 h-16 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all">
          {icon}
       </div>
       <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{title}</h3>
       <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  )
}
