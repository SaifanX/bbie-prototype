'use client'

import { motion } from 'framer-motion';
import { Book, Shield, Code, ArrowRight, CheckCircle2, Globe, Database, Server, Key, Lock, Search, FileText, ChevronRight, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function APIDocsPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30">
      
      {/* Premium Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 p-8 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/api" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Book className="text-white" size={16} />
            </div>
            <span className="text-white font-black uppercase tracking-tighter text-lg">Institutional <span className="text-indigo-500">Docs</span></span>
          </Link>
          <div className="flex gap-8 items-center">
            <Link href="/api" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">API Hub</Link>
            <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Governance Hub</Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-20 flex gap-20">
        
        {/* Sidebar Nav */}
        <aside className="w-64 shrink-0 sticky top-40 h-fit hidden lg:block">
           <div className="space-y-8">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-white uppercase tracking-widest px-4">Introduction</h4>
                 <div className="space-y-1">
                    <SidebarLink label="Overview" onClick={() => scrollToSection('overview')} active />
                    <SidebarLink label="Authentication" onClick={() => scrollToSection('auth')} />
                    <SidebarLink label="Rate Limits" onClick={() => scrollToSection('rate-limits')} />
                 </div>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-white uppercase tracking-widest px-4">Endpoints</h4>
                 <div className="space-y-1">
                    <SidebarLink label="POST /resolve" onClick={() => scrollToSection('pipeline')} />
                    <SidebarLink label="GET /business" onClick={() => scrollToSection('get-business')} />
                 </div>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-white uppercase tracking-widest px-4">Governance</h4>
                 <div className="space-y-1">
                    <SidebarLink label="Sovereignty Shield" onClick={() => scrollToSection('safeguards')} />
                    <SidebarLink label="Audit Logs" onClick={() => scrollToSection('audit-logs')} />
                 </div>
              </div>
           </div>
        </aside>

        {/* Content */}
        <div className="flex-1 max-w-3xl space-y-24">
           
           {/* Section: Overview */}
           <section id="overview" className="space-y-8">
              <h1 className="text-6xl font-black text-white uppercase tracking-tighter">API Overview</h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">
                 The BBIE API provides a high-trust interface for resolving fragmented business identities into a single National System of Record. 
              </p>
              <div className="p-8 glass-card border-indigo-500/20 bg-indigo-500/[0.02] space-y-6">
                 <h3 className="text-lg font-black text-white uppercase tracking-tight">Philosophy</h3>
                 <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Our architecture is built on the principle of **Resolution without Intrusion**. We do not store raw PII from institutional requests; instead, we generate forensic hashes in real-time to perform semantic matching.
                 </p>
              </div>
           </section>

           {/* Section: Authentication */}
           <section id="auth" className="space-y-8">
              <div className="flex items-center gap-4">
                 <Key size={24} className="text-indigo-400" />
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Authentication</h2>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed">
                 All requests to the BBIE API Hub must be authenticated using an Institutional Bearer Token. Tokens are issued to vetted government departments and fintech partners.
              </p>
              <div className="bg-black/40 p-6 rounded-xl border border-white/10 font-mono text-xs text-indigo-400">
                 Authorization: Bearer institution_hash_771
              </div>
           </section>

           {/* Section: Rate Limits */}
           <section id="rate-limits" className="space-y-8">
              <div className="flex items-center gap-4">
                 <Database size={24} className="text-amber-400" />
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Rate Limits</h2>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed">
                 To ensure the stability of the National Infrastructure, institutional endpoints are subject to volumetric controls. 
              </p>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 glass-card border-white/5 bg-white/[0.01]">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Standard Institutional</div>
                    <div className="text-xl font-black text-white">5,000 req/min</div>
                 </div>
                 <div className="p-6 glass-card border-white/5 bg-white/[0.01]">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">High-Priority Enclave</div>
                    <div className="text-xl font-black text-indigo-400">Unlimited</div>
                 </div>
              </div>
           </section>

           {/* Section: Resolution Pipeline */}
           <section id="pipeline" className="space-y-8">
              <div className="flex items-center gap-4">
                 <Cpu size={24} className="text-emerald-400" />
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter">The Resolution Pipeline</h2>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed">
                 Every request to `/v1/resolve` undergoes a 5-step forensic process.
              </p>
              
              <div id="get-business" className="pt-10 space-y-8">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tight">Dossier Retrieval (GET)</h3>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Once resolved, the **GET /business/:ubid** endpoint allows institutions to pull the unified golden record.
                 </p>
                 <div className="space-y-4">
                    <StepItem 
                       num="01" 
                       title="Schematization" 
                       desc="Validating input against the National Business Schema." 
                    />
                    <StepItem 
                       num="02" 
                       title="Sovereignty Hashing" 
                       desc="Masking PII into non-reversible forensic tokens." 
                    />
                    <StepItem 
                       num="03" 
                       title="Vector Search" 
                       desc="Calculating 3072-dim embeddings for semantic matching." 
                    />
                    <StepItem 
                       num="04" 
                       title="Spatial Anchor Check" 
                       desc="Resolving location-based name collisions using PIN codes." 
                    />
                    <StepItem 
                       num="05" 
                       title="Dossier Issuance" 
                       desc="Constructing the final Golden Record and UBID." 
                    />
                 </div>
              </div>
           </section>

           {/* Section: Safeguards */}
           <section id="safeguards" className="space-y-8">
              <div className="flex items-center gap-4">
                 <Shield size={24} className="text-indigo-400" />
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Institutional Safeguards</h2>
              </div>
              <div id="audit-logs" className="pt-10 glass-card p-10 border-white/5 bg-white/[0.01] space-y-6">
                 <h4 className="text-lg font-black text-white uppercase tracking-tight">Forensic Audit Trail</h4>
                 <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    Audit logs are immutable and stored in a decentralized sovereignty ledger. Every API call is logged with the identity of the requesting institution and the specific justification token.
                 </p>
              </div>
           </section>

           {/* Call to Action */}
           <section className="py-20 border-t border-white/5">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Ready to Integrate?</h2>
              <p className="text-slate-500 mb-8 font-medium">Access our Sandbox Environment to begin testing your resolution logic.</p>
              <Link 
                href="mailto:saifanmohammad39@gmail.com?subject=Institutional Sandbox Access Request" 
                className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all flex items-center gap-4 w-fit shadow-2xl shadow-indigo-500/40"
              >
                 Request Sandbox Access <ArrowRight size={16} />
              </Link>
           </section>

        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 p-20 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={16} />
            </div>
            <span className="text-white font-black uppercase tracking-tighter text-lg">BBIE Integration Guide</span>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">© 2026 National Business Intelligence Engine</p>
        </div>
      </footer>
    </div>
  );
}

function SidebarLink({ label, active, onClick }: any) {
   return (
      <button 
        onClick={onClick}
        className={`w-full text-left px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
         active ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-600 hover:text-white hover:bg-white/5'
      }`}>
         {label}
      </button>
   )
}

function StepItem({ num, title, desc }: any) {
   return (
      <div className="flex items-start gap-6 p-6 glass-card border-white/5 bg-white/[0.01]">
         <span className="text-lg font-black text-indigo-500/40 font-mono">{num}</span>
         <div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">{title}</h4>
            <p className="text-xs text-slate-500 font-medium">{desc}</p>
         </div>
      </div>
   )
}
