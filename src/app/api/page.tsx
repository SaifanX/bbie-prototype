'use client'

import { motion } from 'framer-motion';
import { Terminal, Shield, Zap, Code, ArrowRight, CheckCircle2, Globe, Database, Server, Key, Lock, Search, FileText } from 'lucide-react';
import Link from 'next/link';

export default function APIHubPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30">
      
      {/* Premium Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <nav className="relative z-10 p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <Shield className="text-white" size={20} />
          </div>
          <span className="text-white font-black uppercase tracking-tighter text-xl">BBIE <span className="text-indigo-500">API Hub</span></span>
        </Link>
        <div className="flex gap-8 items-center">
          <Link href="/api/docs" className="text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">Documentation</Link>
          <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Institutional Access</button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-40">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Key size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">API INFRASTRUCTURE</span>
            </div>
            <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
              The Institutional <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Identity Layer.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium mb-10 leading-relaxed max-w-lg">
              Powering the next generation of high-trust business workflows in Bharat. Resolve identities, construction dossiers, and verify compliance with zero-trust architecture.
            </p>
            <div className="flex gap-4">
              <Link href="/api/docs" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-3">
                Request API Token <ArrowRight size={16} />
              </Link>
              <Link href="/api/docs" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center gap-3">
                Quickstart Guide
              </Link>
            </div>
          </motion.div>

          {/* Live Endpoint Preview */}
          <div className="relative">
             <div className="glass-card border-white/10 bg-black/40 overflow-hidden shadow-2xl relative z-10">
                <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Terminal size={14} className="text-slate-500" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interactive API Console</span>
                   </div>
                   <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-black text-emerald-500 uppercase">Production v1.0</span>
                   </div>
                </div>
                <div className="p-8 space-y-8">
                   {/* Endpoint A */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <span className="px-2 py-0.5 bg-indigo-500 text-white text-[9px] font-black rounded">POST</span>
                         <span className="text-sm font-mono text-white tracking-tight">/v1/resolve</span>
                      </div>
                      <div className="bg-black/40 p-4 rounded-lg border border-white/5 font-mono text-[11px] text-slate-400">
                         {"{ \"entity_name\": \"Sri Sai Enterprises\", \"pincode\": \"560001\" }"}
                      </div>
                   </div>
                   
                   <div className="flex justify-center">
                      <div className="h-4 w-px bg-white/10" />
                   </div>

                   {/* Endpoint B */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded">GET</span>
                         <span className="text-sm font-mono text-white tracking-tight">/v1/business/[ubid]</span>
                      </div>
                      <div className="bg-black/40 p-4 rounded-lg border border-white/5 font-mono text-[11px] text-emerald-400 opacity-80">
                         {"{ \"ubid\": \"BBIE-X942\", \"status\": \"verified\", \"score\": 0.98 }"}
                      </div>
                   </div>
                </div>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
          </div>
        </div>

        {/* Granular Documentation Section */}
        <div className="space-y-32">
           <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Core API Reference</h2>
              <p className="text-slate-500 font-medium">Standardized endpoints for institutional data consumption.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <DocSection 
                title="Identity Resolution"
                desc="Submit raw business signals (Name, Address, GSTIN) and receive a high-confidence UBID resolution."
                endpoint="POST /v1/resolve"
                params={[
                  { name: 'entity_name', type: 'string', desc: 'Required. The name of the business entity.' },
                  { name: 'pincode', type: 'string', desc: 'Highly Recommended. The primary 6-digit PIN code.' },
                  { name: 'sovereignty_mask', type: 'boolean', desc: 'Optional. If true, returns hashed PII tokens.' }
                ]}
              />
              <DocSection 
                title="Dossier Retrieval"
                desc="Fetch the comprehensive National System of Record for any business using its unique UBID identifier."
                endpoint="GET /v1/business/:ubid"
                params={[
                  { name: 'ubid', type: 'string', desc: 'Required. The Unique Bharat Business ID.' },
                  { name: 'include_audit', type: 'boolean', desc: 'Optional. Include the forensic resolution timeline.' },
                  { name: 'depth', type: 'enum', desc: 'Full, Standard, or Summary view.' }
                ]}
              />
           </div>
        </div>

        {/* Safeguards Section */}
        <div className="mt-40">
           <div className="glass-card p-16 border-white/5 bg-white/[0.01] relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <Lock size={20} className="text-emerald-500" />
                       <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Institutional Safeguards</h2>
                    </div>
                    <p className="text-slate-400 font-medium leading-relaxed">
                       Our API is built on the **Sovereignty Shield** architecture. Every request is scrubbed of PII in the buffer layer, and matching occurs exclusively on forensic hashes.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <CheckCircle2 size={16} className="text-indigo-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">TLS 1.3 Encryption</h4>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">In-transit sovereignty</p>
                       </div>
                       <div className="space-y-2">
                          <CheckCircle2 size={16} className="text-indigo-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Zero-Trust Auth</h4>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Role-based dossier access</p>
                       </div>
                    </div>
                 </div>
                 <div className="relative">
                    <div className="glass-card p-8 bg-black border-white/10 font-mono text-[10px] text-slate-500 opacity-60">
                       # Institutional Header Example <br />
                       X-BBIE-TOKEN: INSTITUTION_HASH_771 <br />
                       X-SOVEREIGNTY-MODE: FULL_MASK <br />
                       X-TIMESTAMP: 2026-05-14T13:30:07Z
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                       <Shield size={60} className="text-emerald-500 opacity-20" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </main>

      <footer className="relative z-10 border-t border-white/5 p-20 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={16} />
            </div>
            <span className="text-white font-black uppercase tracking-tighter text-lg">BBIE API HUB</span>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">© 2026 National Business Intelligence Engine</p>
        </div>
      </footer>
    </div>
  );
}

function DocSection({ title, desc, endpoint, params }: any) {
  return (
    <div className="glass-card p-10 border-white/5 bg-white/[0.01] hover:border-indigo-500/20 transition-all">
       <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{title}</h3>
       <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{desc}</p>
       
       <div className="p-4 bg-black/40 rounded-xl border border-white/5 mb-8 flex items-center gap-4">
          <Code size={16} className="text-indigo-400" />
          <span className="text-xs font-mono text-white">{endpoint}</span>
       </div>

       <div className="space-y-4">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-4">Parameters</span>
          {params.map((p: any) => (
            <div key={p.name} className="flex flex-col gap-1 border-b border-white/5 pb-4">
               <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-indigo-400">{p.name}</span>
                  <span className="text-[8px] px-2 py-0.5 bg-white/5 rounded text-slate-500 font-mono">{p.type}</span>
               </div>
               <p className="text-[10px] text-slate-500 font-medium">{p.desc}</p>
            </div>
          ))}
       </div>
    </div>
  )
}
