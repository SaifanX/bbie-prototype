'use client'

import { motion } from 'framer-motion';
import { Terminal, Shield, Zap, Code, ArrowRight, CheckCircle2, Globe, Database } from 'lucide-react';
import Link from 'next/link';

export default function GatewayPage() {
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
          <span className="text-white font-black uppercase tracking-tighter text-xl">BBIE <span className="text-indigo-500">Gateway</span></span>
        </Link>
        <div className="flex gap-8 items-center">
          <Link href="/docs" className="text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">Documentation</Link>
          <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Developer Console</button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-40">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Zap size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">API Infrastructure</span>
            </div>
            <h1 className="text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
              Build on the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Forensic Truth</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium mb-10 leading-relaxed max-w-lg">
              The National Identity Layer for Bharat. Resolve identities, detect anomalies, and verify compliance with a single API call.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-3">
                Get API Access <ArrowRight size={16} />
              </button>
              <Link href="/docs" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center gap-3">
                View Docs
              </Link>
            </div>
          </motion.div>

          {/* Interactive Code Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="glass-card border-white/10 overflow-hidden shadow-2xl">
              <div className="bg-white/5 border-b border-white/10 p-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Request Explorer</span>
              </div>
              <div className="p-8 font-mono text-sm">
                <div className="flex items-start gap-4 mb-8">
                  <span className="text-indigo-400 font-black">POST</span>
                  <span className="text-white">/api/v1/resolve</span>
                </div>
                <div className="space-y-2 mb-10">
                  <code className="block text-slate-500">{"{"}</code>
                  <code className="block ml-4 text-emerald-400">"name": <span className="text-indigo-300">"Sri Sai Entp"</span>,</code>
                  <code className="block ml-4 text-emerald-400">"pincode": <span className="text-indigo-300">"560001"</span></code>
                  <code className="block text-slate-500">{"}"}</code>
                </div>
                <div className="h-px bg-white/5 mb-8" />
                <div className="space-y-2 opacity-80">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-4">Response</span>
                  <code className="block text-slate-500">{"{"}</code>
                  <code className="block ml-4 text-indigo-400">"ubid": <span className="text-white">"UBID-KA-003"</span>,</code>
                  <code className="block ml-4 text-indigo-400">"confidence": <span className="text-white">0.98</span>,</code>
                  <code className="block ml-4 text-indigo-400">"verdict": <span className="text-white">"Phonetic match confirmed."</span></code>
                  <code className="block text-slate-500">{"}"}</code>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40">
          <FeatureCard 
            icon={<Globe className="text-indigo-400" />}
            title="Semantic Resolution"
            desc="Resolve messy, fragmented business data into a single National UBID using our 3072-dim vector engine."
          />
          <FeatureCard 
            icon={<Shield className="text-emerald-400" />}
            title="Sovereignty Shield"
            desc="Built-in PII masking ensures all identity checks comply with National data sovereignty mandates."
          />
          <FeatureCard 
            icon={<Zap className="text-amber-400" />}
            title="Real-time Anomalies"
            desc="Subscribe to a live stream of identity collisions and dormancy signals across all departments."
          />
        </div>

        {/* Integration Stats */}
        <div className="mt-40 glass-card p-12 border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
           <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Integrated by the Best</h2>
              <p className="text-slate-500 font-medium">Powering high-trust workflows across Bharat's leading institutions.</p>
           </div>
           <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-xl font-black text-white uppercase tracking-widest">Reserve Bank</span>
              <span className="text-xl font-black text-white uppercase tracking-widest">GSTN</span>
              <span className="text-xl font-black text-white uppercase tracking-widest">MCA-21</span>
           </div>
        </div>

      </main>

      <footer className="relative z-10 border-t border-white/5 p-20 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={16} />
            </div>
            <span className="text-white font-black uppercase tracking-tighter text-lg">BBIE Gateway</span>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">© 2026 National Business Intelligence Engine</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="glass-card p-10 border-white/5 hover:border-indigo-500/30 transition-all group hover:-translate-y-2 duration-500">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">{title}</h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  )
}
