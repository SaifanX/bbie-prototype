'use client'

import { motion } from 'framer-motion';
import { Database, Fingerprint, Cpu, ShieldCheck, Zap, Layers, Globe, ArrowRight, Activity, Search, Shield, Server, Code, MapPin, Hash, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="bg-[#09090b] text-white selection:bg-orange-500/30 min-h-screen overflow-x-hidden pb-40">
      
      {/* Cinematic Header */}
      <section className="pt-40 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20">
              <Cpu size={24} className="text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.5em] text-orange-500">Resolution Framework</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-10"
          >
            Inside the <br />
            <span className="text-orange-500">Intelligence Pipeline.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            BBIE doesn't just "match" names. It performs a multi-stage forensic reconstruction of corporate identity across 1.4 billion data points.
          </motion.p>
        </div>
      </section>

      {/* THE 5-STEP PIPELINE */}
      <div className="max-w-6xl mx-auto px-6 space-y-40">
        
        {/* Step 1: Ingestion & Schematization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <span className="text-4xl font-black text-orange-500/30">01</span>
               <h2 className="text-4xl font-black uppercase tracking-tight">Ingestion & Schematization</h2>
            </div>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Raw data enters from disconnected siloes (MCA, GSTN, Udyam). Every record is first validated against the **National Schema**, ensuring that addresses, names, and identifiers are normalized into a unified structure before any processing begins.
            </p>
            <div className="flex flex-wrap gap-2">
               <div className="px-3 py-1 bg-zinc-900 rounded border border-zinc-800 text-[9px] font-mono text-zinc-400">MCA_XML</div>
               <div className="px-3 py-1 bg-zinc-900 rounded border border-zinc-800 text-[9px] font-mono text-zinc-400">GSTN_JSON</div>
               <div className="px-3 py-1 bg-zinc-900 rounded border border-zinc-800 text-[9px] font-mono text-zinc-400">PF_CSV</div>
            </div>
          </div>
          <div className="bg-[#121215] p-8 border border-zinc-800 rounded-3xl font-mono text-[10px] space-y-4 relative overflow-hidden group shadow-xl">
             <div className="flex justify-between items-center text-zinc-400 border-b border-zinc-800 pb-2">
                <span>RAW_INPUT_BUFFER</span>
                <div className="flex gap-1">
                   <div className="w-2 h-2 rounded-full bg-zinc-700" />
                   <div className="w-2 h-2 rounded-full bg-zinc-600" />
                   <div className="w-2 h-2 rounded-full bg-orange-500" />
                </div>
             </div>
             <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="text-zinc-500"
             >
               {"{ \"name\": \"SRI SAI ENT\", \"gstin\": \"29AAAA...\" }"}
             </motion.div>
             <div className="flex justify-center py-4">
                <ArrowRight className="text-orange-500 rotate-90" size={20} />
             </div>
             <motion.div 
               animate={{ scale: [1, 1.05, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400"
             >
               {"{ \"primary_name\": \"Sri Sai Enterprises\", \"is_valid\": true }"}
             </motion.div>
             <div className="absolute top-0 right-0 p-4">
                <Code size={16} className="text-orange-500/20" />
             </div>
          </div>
        </div>

        {/* Step 2: PII Sovereignty (The Hashing) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 bg-[#121215] p-12 border border-zinc-800 rounded-3xl flex flex-col items-center justify-center gap-8 overflow-hidden relative shadow-xl">
             <div className="text-center space-y-2">
                <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Sovereignty Shield</div>
                <div className="text-xl font-mono text-white">29AAAAA0000A1Z5</div>
             </div>
             <motion.div 
               animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
               transition={{ duration: 1.5, repeat: Infinity }}
               className="w-px h-12 bg-orange-500/40"
             />
             <div className="p-4 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
                <Hash className="text-white" size={32} />
             </div>
             <div className="text-center font-mono text-[9px] text-orange-400 break-all max-w-[200px] opacity-40">
               8f9a2b3c4d5e6f1a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
             </div>
             <Shield className="absolute top-4 right-4 text-orange-500/20" size={24} />
          </div>
          <div className="order-1 lg:order-2 space-y-6 text-right">
            <div className="flex items-center gap-4 justify-end">
               <h2 className="text-4xl font-black uppercase tracking-tight">PII Sovereignty</h2>
               <span className="text-4xl font-black text-orange-500/30">02</span>
            </div>
            <p className="text-zinc-400 font-medium leading-relaxed">
              To protect business privacy, all sensitive identifiers (PAN, GSTIN) are hashed into **Forensic Tokens** using a non-reversible cryptographic salt. 
              <br /><br />
              The engine performs all matching on these tokens, ensuring that raw PII never leaves the Sovereignty Buffer, fulfilling the strict "Non-Intrusive" mandate of the platform.
            </p>
          </div>
        </div>

        {/* Step 3: Semantic Vectorization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <span className="text-4xl font-black text-orange-500/30">03</span>
               <h2 className="text-4xl font-black uppercase tracking-tight">Semantic Vectorization</h2>
            </div>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Names and addresses are passed to the **Gemini Embedding Engine**. Text is converted into a 3072-dimensional vector—a mathematical fingerprint that captures the "meaning" of the identity beyond just letters.
              <br /><br />
              This is how the system knows that "Sai Entp" and "Sri Sai Enterprises" are the same concept, even if their characters differ.
            </p>
          </div>
          <div className="relative h-[300px] flex items-center justify-center bg-[#121215] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
             <div className="grid grid-cols-8 gap-2 opacity-20 absolute inset-0 p-6">
                {[...Array(64)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
                    className="w-4 h-4 bg-orange-500 rounded-sm mx-auto my-auto"
                  />
                ))}
             </div>
             <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-zinc-900 p-6 border border-zinc-800 flex flex-col items-center rounded-2xl shadow-2xl">
                   <Fingerprint className="text-orange-500 mb-4" size={48} />
                   <div className="text-[10px] font-mono text-orange-500 tracking-tighter">VECTOR_DIM: 3072</div>
                </div>
             </div>
          </div>
        </div>

        {/* Step 4: Precision Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 bg-[#121215] p-8 border border-zinc-800 rounded-3xl relative overflow-hidden shadow-xl">
             <div className="space-y-6">
                {/* Visual Matching UI */}
                <div className="flex items-center justify-between gap-4">
                   <div className="flex-1 p-3 bg-zinc-900 border border-zinc-800 rounded font-mono text-[8px] text-zinc-400">
                      SAI ENTERPRISES, BLR
                   </div>
                   <motion.div 
                     animate={{ x: [0, 10, 0] }}
                     transition={{ duration: 1, repeat: Infinity }}
                     className="px-3 py-1 bg-orange-500 rounded-full text-[8px] font-black text-white"
                   >
                     MATCH
                   </motion.div>
                   <div className="flex-1 p-3 bg-zinc-900 border border-zinc-800 rounded font-mono text-[8px] text-zinc-400">
                      SHRI SAI ENT, BANGALORE
                   </div>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                   <motion.div 
                     animate={{ width: ["0%", "98%", "98%"] }}
                     transition={{ duration: 4, repeat: Infinity }}
                     className="h-full bg-orange-500"
                   />
                </div>
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500">
                   <span>Spatial Anchor: 560001</span>
                   <span>Score: 98.4%</span>
                </div>
             </div>
             <MapPin className="absolute -top-2 -right-2 text-orange-500/20" size={60} />
          </div>
          <div className="order-1 lg:order-2 space-y-6 text-right">
            <div className="flex items-center gap-4 justify-end">
               <h2 className="text-4xl font-black uppercase tracking-tight">Precision Alignment</h2>
               <span className="text-4xl font-black text-orange-500/30">04</span>
            </div>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Our **Alignment Engine** performs a secondary spatial and phonetic check. It cross-references PIN codes and director profiles to resolve name collisions. 
              <br /><br />
              If "Sai Enterprises" exists in both Mumbai and Bangalore, the engine uses geo-anchoring to ensure they are correctly linked to their respective regional dossiers.
            </p>
          </div>
        </div>

        {/* Step 5: UBID Issuance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <span className="text-4xl font-black text-orange-500/30">05</span>
               <h2 className="text-4xl font-black uppercase tracking-tight">Dossier Construction</h2>
            </div>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Once a match crosses the 95% alignment threshold, the engine creates a **Golden Record**. It merges the best data from all sources (MCA address, GSTN activity, etc.) and issues a unique **UBID**.
              <br /><br />
              This record is now the National System of Record, ready for institutional consumption.
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#121215] p-10 border border-zinc-800 rounded-3xl relative group shadow-xl"
          >
             <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
                   <ShieldCheck className="text-orange-500" size={32} />
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Status: Verified</div>
                   <div className="text-2xl font-black text-white tracking-tighter">UBID-2026-X942</div>
                </div>
             </div>
             <div className="space-y-4">
                <div className="h-1 w-full bg-zinc-800 rounded-full" />
                <div className="h-1 w-2/3 bg-zinc-800 rounded-full" />
                <div className="h-1 w-3/4 bg-zinc-800 rounded-full" />
             </div>
             <motion.div 
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute inset-0 border border-orange-500/30 rounded-[inherit] pointer-events-none" 
             />
             <CheckCircle2 className="absolute -bottom-4 -right-4 text-orange-500 shadow-xl" size={48} />
          </motion.div>
        </div>

      </div>

      {/* Call to Action */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-[#121215] border border-zinc-800 p-20 rounded-3xl shadow-2xl">
           <h2 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">The Foundation of <br /><span className="text-orange-500">National Intelligence.</span></h2>
           <p className="text-zinc-400 font-medium mb-12 text-lg">Enter the Governance Hub to see these stages in real-time across the registry.</p>
           <Link href="/dashboard" className="px-10 py-5 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 inline-flex items-center gap-4">
              Access Governance Hub <ArrowRight size={18} />
           </Link>
        </div>
      </section>
    </div>
  );
}
