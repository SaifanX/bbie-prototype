'use client'

import { motion } from 'framer-motion';
import { Book, Shield, Code, ArrowRight, CheckCircle2, Globe, Database, Server, Key, Lock, Search, FileText, ChevronRight, Cpu, Terminal, AlertTriangle, FileCode, Layers, HelpCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function APIDocsPage() {
  const [activeTab, setActiveTab] = useState<'curl' | 'python' | 'typescript' | 'go'>('curl');

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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-orange-500/30">
      
      <nav className="relative z-10 p-8 border-b border-zinc-800 bg-[#09090b] sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/api" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Book className="text-white" size={20} />
            </div>
            <div>
              <span className="text-white font-black uppercase tracking-tighter text-xl block leading-none">BBIE <span className="text-orange-500">Docs</span></span>
              <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Pilot Program Edition v2.4</span>
            </div>
          </Link>
          <div className="flex gap-8 items-center">
            <Link href="/api" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
              <Terminal size={14} className="text-orange-500" /> API Playground
            </Link>
            <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
              <Shield size={14} className="text-orange-500" /> Governance Hub
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-16 flex gap-16">
        
        {/* Sidebar Nav */}
        <aside className="w-64 shrink-0 sticky top-32 h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar hidden lg:block pr-6">
           <div className="space-y-8 pb-12">
              <div className="space-y-3">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4 flex items-center gap-2">
                   <Layers size={12} className="text-orange-500" /> Core Concepts
                 </h4>
                 <div className="space-y-1">
                    <SidebarLink label="Executive Overview" onClick={() => scrollToSection('overview')} active />
                    <SidebarLink label="Architectural Vision" onClick={() => scrollToSection('architecture')} />
                    <SidebarLink label="Authentication & Security" onClick={() => scrollToSection('auth')} />
                    <SidebarLink label="Rate Limits & Tiers" onClick={() => scrollToSection('rate-limits')} />
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4 flex items-center gap-2">
                   <Code size={12} className="text-orange-500" /> REST API Endpoints
                 </h4>
                 <div className="space-y-1">
                    <SidebarLink label="POST /v1/resolve" onClick={() => scrollToSection('resolve-api')} />
                    <SidebarLink label="GET /v1/business/:ubid" onClick={() => scrollToSection('dossier-api')} />
                    <SidebarLink label="POST /v1/arbitration" onClick={() => scrollToSection('arbitration-api')} />
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4 flex items-center gap-2">
                   <FileCode size={12} className="text-orange-500" /> Client SDKs & Code
                 </h4>
                 <div className="space-y-1">
                    <SidebarLink label="Multi-Language SDKs" onClick={() => scrollToSection('sdks')} />
                    <SidebarLink label="Error Codes & Matrix" onClick={() => scrollToSection('errors')} />
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4 flex items-center gap-2">
                   <Shield size={12} className="text-orange-500" /> Governance & Pilot
                 </h4>
                 <div className="space-y-1">
                    <SidebarLink label="Sovereignty Shield" onClick={() => scrollToSection('safeguards')} />
                    <SidebarLink label="DPDP Act Compliance" onClick={() => scrollToSection('compliance')} />
                    <SidebarLink label="Pilot Onboarding Checklist" onClick={() => scrollToSection('onboarding')} />
                 </div>
              </div>
           </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 max-w-4xl space-y-32 pb-40">
           
           {/* Section: Overview */}
           <section id="overview" className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2">
                 Official Pilot Documentation
              </div>
              <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">
                 BBIE Institutional <br /><span className="text-orange-500">API Specification</span>
              </h1>
              <p className="text-xl text-zinc-400 font-medium leading-relaxed">
                 Welcome to the Bharat Business Intelligence Engine (BBIE) Pilot Program API documentation. This specification provides deep architectural, schematic, and cryptographic guidelines for integrating national-scale identity resolution into your institutional workflows.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                 <div className="bg-[#121215] p-6 border border-zinc-800 space-y-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                       <Cpu size={20} />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">3072-Dim AI Matching</h3>
                    <p className="text-xs text-zinc-400 font-medium">Advanced vector embeddings resolve fuzzy, fragmented multi-lingual business names instantly.</p>
                 </div>

                 <div className="bg-[#121215] p-6 border border-zinc-800 space-y-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                       <Lock size={20} />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Sovereignty Buffer</h3>
                    <p className="text-xs text-zinc-400 font-medium">Zero-knowledge matching ensures raw PII is never stored or exposed during verification.</p>
                 </div>

                 <div className="bg-[#121215] p-6 border border-zinc-800 space-y-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                       <CheckCircle2 size={20} />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Golden Record Issuance</h3>
                    <p className="text-xs text-zinc-400 font-medium">Generates a permanent, unified Unique Bharat Business ID (UBID) across 15+ registries.</p>
                 </div>
              </div>
           </section>

           {/* Section: Architectural Vision */}
           <section id="architecture" className="space-y-8 pt-10 border-t border-zinc-800">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                       <Layers size={16} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Architectural Vision & Workflow</h2>
                 </div>
                 <p className="text-zinc-400 font-medium leading-relaxed">
                    The BBIE platform operates as an institutional middleware layer sitting between fragmented state/central registries (MCA, GSTN, EPFO, CIN) and consuming entities (Banks, Regulators, Ministries).
                 </p>
              </div>

              <div className="p-8 bg-[#121215] border border-zinc-800 rounded-3xl space-y-6 shadow-2xl">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-zinc-800 pb-4">
                    <Server size={14} className="text-orange-500" /> The 5-Stage Zero-Trust Resolution Pipeline
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-2 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 relative">
                       <div className="text-[10px] font-black text-orange-500 font-mono">STAGE 01</div>
                       <h5 className="text-xs font-bold text-white uppercase tracking-wider">Ingestion & Buffer</h5>
                       <p className="text-[11px] text-zinc-400 font-medium">Unstructured fragments enter the isolated sovereignty buffer.</p>
                    </div>
                    <div className="space-y-2 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 relative">
                       <div className="text-[10px] font-black text-orange-500 font-mono">STAGE 02</div>
                       <h5 className="text-xs font-bold text-white uppercase tracking-wider">Cryptographic Hash</h5>
                       <p className="text-[11px] text-zinc-400 font-medium">Identifiers are converted to SHA-256 tokens instantly.</p>
                    </div>
                    <div className="space-y-2 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 relative">
                       <div className="text-[10px] font-black text-orange-500 font-mono">STAGE 03</div>
                       <h5 className="text-xs font-bold text-white uppercase tracking-wider">Vector Search</h5>
                       <p className="text-[11px] text-zinc-400 font-medium">Semantic matching across 3072-dim AI space.</p>
                    </div>
                    <div className="space-y-2 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 relative">
                       <div className="text-[10px] font-black text-orange-500 font-mono">STAGE 04</div>
                       <h5 className="text-xs font-bold text-white uppercase tracking-wider">Spatial Anchor</h5>
                       <p className="text-[11px] text-zinc-400 font-medium">Geospatial verification using 6-digit PIN codes.</p>
                    </div>
                    <div className="space-y-2 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 relative">
                       <div className="text-[10px] font-black text-orange-500 font-mono">STAGE 05</div>
                       <h5 className="text-xs font-bold text-white uppercase tracking-wider">Golden Dossier</h5>
                       <p className="text-[11px] text-zinc-400 font-medium">Issuance of permanent UBID with full audit timeline.</p>
                    </div>
                 </div>
              </div>
           </section>

           {/* Section: Authentication */}
           <section id="auth" className="space-y-8 pt-10 border-t border-zinc-800">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                       <Key size={16} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Authentication & Security Enclave</h2>
                 </div>
                 <p className="text-zinc-400 font-medium leading-relaxed">
                    BBIE requires strict mutual authentication for all institutional access. Vetted pilot participants are issued a high-entropy **Service Role API Key** alongside an Institutional Identifier.
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-zinc-800 pb-3">Mandatory HTTP Headers</h4>
                    <div className="space-y-4 font-mono text-xs">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-zinc-800 pb-3">
                          <span className="text-orange-500 font-bold">Authorization</span>
                          <span className="text-zinc-300 md:col-span-2">Bearer &lt;INSTITUTIONAL_API_KEY&gt;</span>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-zinc-800 pb-3">
                          <span className="text-orange-500 font-bold">X-BBIE-CLIENT-ID</span>
                          <span className="text-zinc-300 md:col-span-2">PILOT_DEPT_CODE (e.g., `PILOT_RBI_01`)</span>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-zinc-800 pb-3">
                          <span className="text-orange-500 font-bold">X-SOVEREIGNTY-MODE</span>
                          <span className="text-zinc-300 md:col-span-2">`FULL_MASK` | `PARTIAL_MASK` | `PLAIN_AUDIT`</span>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <span className="text-orange-500 font-bold">X-TIMESTAMP</span>
                          <span className="text-zinc-300 md:col-span-2">ISO-8601 UTC Timestamp (e.g., `2026-05-16T10:30:00Z`)</span>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-[#121215] border border-zinc-800 rounded-2xl flex gap-4 items-start">
                    <AlertTriangle size={20} className="text-orange-500 shrink-0 mt-1" />
                    <div className="space-y-1">
                       <h5 className="text-xs font-black text-white uppercase tracking-widest">HMAC Signature Verification (Tier-1 Institutions)</h5>
                       <p className="text-xs text-zinc-400 leading-relaxed">
                          For financial regulators and core banking systems, requests must include an `X-BBIE-SIGNATURE` header containing an HMAC-SHA256 signature of the request body using your institutional private secret.
                       </p>
                    </div>
                 </div>
              </div>
           </section>

           {/* Section: Rate Limits */}
           <section id="rate-limits" className="space-y-8 pt-10 border-t border-zinc-800">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                       <Database size={16} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Rate Limits & Volumetric Tiers</h2>
                 </div>
                 <p className="text-zinc-400 font-medium leading-relaxed">
                    To prevent denial-of-service and guarantee SLA uptime for national infrastructure, volumetric controls are enforced at the API gateway layer using token bucket algorithms.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-[#121215] p-6 border border-zinc-800 rounded-2xl space-y-4">
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tier 1: Standard Pilot</div>
                    <div className="text-3xl font-black text-white">5,000 <span className="text-xs font-normal text-zinc-500">req/min</span></div>
                    <p className="text-xs text-zinc-400 font-medium border-t border-zinc-800 pt-4">Suitable for asynchronous batch verification and departmental onboarding.</p>
                 </div>

                 <div className="bg-[#121215] p-6 border border-orange-500/50 rounded-2xl space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-[8px] font-black px-3 py-1 uppercase tracking-widest rounded-bl-lg">Active Pilot</div>
                    <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Tier 2: High-Priority Enclave</div>
                    <div className="text-3xl font-black text-white">50,000 <span className="text-xs font-normal text-zinc-400">req/min</span></div>
                    <p className="text-xs text-zinc-300 font-medium border-t border-zinc-800 pt-4">Assigned to active pilot judges, core fintech partners, and real-time loan origination systems.</p>
                 </div>

                 <div className="bg-[#121215] p-6 border border-zinc-800 rounded-2xl space-y-4">
                    <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Tier 3: Sovereign Instance</div>
                    <div className="text-3xl font-black text-white">Unlimited</div>
                    <p className="text-xs text-zinc-300 font-medium border-t border-zinc-800 pt-4">Dedicated bare-metal deployment for central intelligence and national security agencies.</p>
                 </div>
              </div>
           </section>

           {/* Section: POST /v1/resolve */}
           <section id="resolve-api" className="space-y-8 pt-10 border-t border-zinc-800">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-mono text-xs font-bold">
                       POST
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Identity Resolution Endpoint</h2>
                 </div>
                 <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-xl font-mono text-xs">
                    <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-500 rounded font-bold">POST</span>
                    <span className="text-white font-bold">https://api.bbie.gov.in/v1/resolve</span>
                 </div>
                 <p className="text-zinc-400 font-medium leading-relaxed">
                    Submits unverified, fragmented business data into the BBIE Confidence Engine. The engine evaluates semantic similarity, cross-references historical registry collisions, and returns a high-confidence UBID match.
                 </p>
              </div>

              {/* Request Parameters Table */}
              <div className="space-y-4">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest">Request Body Schema (application/json)</h4>
                 <div className="bg-[#121215] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="border-b border-zinc-800 bg-zinc-900 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                             <th className="p-4">Parameter</th>
                             <th className="p-4">Type</th>
                             <th className="p-4">Requirement</th>
                             <th className="p-4">Description</th>
                          </tr>
                       </thead>
                       <tbody className="text-xs font-mono divide-y divide-zinc-800 text-zinc-300">
                          <tr>
                             <td className="p-4 font-bold text-orange-500">entity_name</td>
                             <td className="p-4 text-zinc-500">string</td>
                             <td className="p-4 text-orange-500 font-bold">Required</td>
                             <td className="p-4 font-sans text-zinc-400">The legal or trade name of the business entity (e.g., `Mphasis Ltd` or `Mphasis`).</td>
                          </tr>
                          <tr>
                             <td className="p-4 font-bold text-orange-500">pincode</td>
                             <td className="p-4 text-zinc-500">string</td>
                             <td className="p-4 text-orange-500">Recommended</td>
                             <td className="p-4 font-sans text-zinc-400">6-digit Indian Postal Code. Acts as the primary spatial anchor to prevent name collisions.</td>
                          </tr>
                          <tr>
                             <td className="p-4 font-bold text-zinc-300">pan</td>
                             <td className="p-4 text-zinc-500">string</td>
                             <td className="p-4 text-zinc-500">Optional</td>
                             <td className="p-4 font-sans text-zinc-400">10-character alphanumeric Permanent Account Number (e.g., `BLRMP1234F`).</td>
                          </tr>
                          <tr>
                             <td className="p-4 font-bold text-zinc-300">gstin</td>
                             <td className="p-4 text-zinc-500">string</td>
                             <td className="p-4 text-zinc-500">Optional</td>
                             <td className="p-4 font-sans text-zinc-400">15-character Goods and Services Tax Identification Number.</td>
                          </tr>
                          <tr>
                             <td className="p-4 font-bold text-zinc-300">address</td>
                             <td className="p-4 text-zinc-500">string</td>
                             <td className="p-4 text-zinc-500">Optional</td>
                             <td className="p-4 font-sans text-zinc-400">Unstructured physical address snippet for fuzzy spatial clustering.</td>
                          </tr>
                          <tr>
                             <td className="p-4 font-bold text-zinc-300">cin</td>
                             <td className="p-4 text-zinc-500">string</td>
                             <td className="p-4 text-zinc-500">Optional</td>
                             <td className="p-4 font-sans text-zinc-400">21-character Corporate Identification Number (MCA Registry).</td>
                          </tr>
                          <tr>
                             <td className="p-4 font-bold text-zinc-300">fuzzy_threshold</td>
                             <td className="p-4 text-zinc-500">number</td>
                             <td className="p-4 text-zinc-500">Optional</td>
                             <td className="p-4 font-sans text-zinc-400">Custom AI matching strictness between `0.0` and `1.0`. Defaults to `0.85`.</td>
                          </tr>
                          <tr>
                             <td className="p-4 font-bold text-zinc-300">sovereignty_mask</td>
                             <td className="p-4 text-zinc-500">boolean</td>
                             <td className="p-4 text-zinc-500">Optional</td>
                             <td className="p-4 font-sans text-zinc-400">If `true`, returns fully hashed PII tokens to comply with zero-knowledge policies. Defaults to `true`.</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* Sample Response */}
              <div className="space-y-4">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest">Success Response Payload (200 OK)</h4>
                 <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-xs text-zinc-300 shadow-2xl overflow-x-auto custom-scrollbar">
                    <pre className="text-orange-400">{`{
  "status": "success",
  "code": 200,
  "resolution": {
    "ubid": "KA-UBID-SLIY-54321",
    "confidence_score": 0.982,
    "match_type": "EXACT_AI_CLUSTER",
    "spatial_anchor_verified": true,
    "sovereignty_protected": true
  },
  "entity": {
    "legal_name": "MPHASIS LIMITED",
    "trade_name": "Mphasis",
    "status": "ACTIVE",
    "pincode": "560001",
    "state": "Karnataka",
    "pii_hashes": {
      "pan_sha256": "8f9e2a1c...[REDACTED]",
      "gstin_sha256": "4b3a1f9e...[REDACTED]"
    }
  },
  "forensic_metadata": {
    "engine_version": "v2.4-pilot",
    "latency_ms": 42,
    "timestamp": "2026-05-16T10:30:05Z"
  }
}`}</pre>
                 </div>
              </div>
           </section>

           {/* Section: GET /v1/business/:ubid */}
           <section id="dossier-api" className="space-y-8 pt-10 border-t border-zinc-800">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-mono text-xs font-bold">
                       GET
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Dossier Retrieval Endpoint</h2>
                 </div>
                 <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-xl font-mono text-xs">
                    <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-500 rounded font-bold">GET</span>
                    <span className="text-white font-bold">https://api.bbie.gov.in/v1/business/:ubid</span>
                 </div>
                 <p className="text-zinc-400 font-medium leading-relaxed">
                    Fetches the comprehensive Golden Record and forensic resolution history for a specific Unique Bharat Business ID (UBID). Used for underwriting, regulatory audits, and deep compliance checks.
                 </p>
              </div>

              {/* Query Parameters Table */}
              <div className="space-y-4">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest">Query Parameters</h4>
                 <div className="bg-[#121215] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="border-b border-zinc-800 bg-zinc-900 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                             <th className="p-4">Parameter</th>
                             <th className="p-4">Type</th>
                             <th className="p-4">Requirement</th>
                             <th className="p-4">Description</th>
                          </tr>
                       </thead>
                       <tbody className="text-xs font-mono divide-y divide-zinc-800 text-zinc-300">
                          <tr>
                             <td className="p-4 font-bold text-orange-500">ubid</td>
                             <td className="p-4 text-zinc-500">string</td>
                             <td className="p-4 text-orange-500 font-bold">Required</td>
                             <td className="p-4 font-sans text-zinc-400">The Unique Bharat Business ID (e.g., `KA-UBID-SLIY-54321`). Passed in URL path.</td>
                          </tr>
                          <tr>
                             <td className="p-4 font-bold text-zinc-300">include_audit</td>
                             <td className="p-4 text-zinc-500">boolean</td>
                             <td className="p-4 text-zinc-500">Optional</td>
                             <td className="p-4 font-sans text-zinc-400">If `true`, attaches the full historical timeline of resolution merges and human reviews.</td>
                          </tr>
                          <tr>
                             <td className="p-4 font-bold text-zinc-300">depth</td>
                             <td className="p-4 text-zinc-500">enum</td>
                             <td className="p-4 text-zinc-500">Optional</td>
                             <td className="p-4 font-sans text-zinc-400">`SUMMARY` | `STANDARD` | `EXHAUSTIVE`. Determines the volume of cross-registry data returned.</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* Sample Response */}
              <div className="space-y-4">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest">Success Response Payload (200 OK)</h4>
                 <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-xs text-zinc-300 shadow-2xl overflow-x-auto custom-scrollbar">
                    <pre className="text-orange-400">{`{
  "status": "success",
  "ubid": "KA-UBID-SLIY-54321",
  "dossier": {
    "golden_record": {
      "company_name": "MPHASIS LIMITED",
      "incorporation_date": "1992-08-10",
      "authorized_capital": 2500000000,
      "activity_intelligence": {
        "status": "HIGH_ACTIVITY",
        "last_epfo_filing": "2026-04-30",
        "last_gst_filing": "2026-05-10"
      },
      "compliance_rating": "A+",
      "risk_flags": []
    },
    "audit_timeline": [
      {
        "event_id": "EVT_99812",
        "action_type": "MERGE_RESOLVED",
        "timestamp": "2026-05-14T18:22:10Z",
        "description": "AI Confidence Engine merged 2 duplicate PAN fragments.",
        "actor": "SYSTEM_ENGINE"
      },
      {
        "event_id": "EVT_99815",
        "action_type": "HUMAN_ARBITRATION",
        "timestamp": "2026-05-15T09:14:00Z",
        "description": "Officer verified spatial anchor match for Bagmane Tech Park.",
        "actor": "PILOT_JUDGE_04"
      }
    ]
  }
}`}</pre>
                 </div>
              </div>
           </section>

           {/* Section: POST /v1/arbitration */}
           <section id="arbitration-api" className="space-y-8 pt-10 border-t border-zinc-800">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-mono text-xs font-bold">
                       POST
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Human Arbitration Feedback Endpoint</h2>
                 </div>
                 <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 p-4 rounded-xl font-mono text-xs">
                    <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-500 rounded font-bold">POST</span>
                    <span className="text-white font-bold">https://api.bbie.gov.in/v1/arbitration</span>
                 </div>
                 <p className="text-zinc-400 font-medium leading-relaxed">
                    Allows authorized human reviewers and pilot program judges to submit manual arbitration decisions, overriding AI confidence matches or splitting incorrectly merged clusters.
                 </p>
              </div>

              {/* Request Schema */}
              <div className="space-y-4">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest">Request Body Schema (application/json)</h4>
                 <div className="bg-[#121215] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="border-b border-zinc-800 bg-zinc-900 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                             <th className="p-4">Parameter</th>
                             <th className="p-4">Type</th>
                             <th className="p-4">Requirement</th>
                             <th className="p-4">Description</th>
                          </tr>
                       </thead>
                       <tbody className="text-xs font-mono divide-y divide-zinc-800 text-zinc-300">
                          <tr>
                             <td className="p-4 font-bold text-orange-500">ubid</td>
                             <td className="p-4 text-zinc-500">string</td>
                             <td className="p-4 text-orange-500 font-bold">Required</td>
                             <td className="p-4 font-sans text-zinc-400">The target UBID being arbitrated.</td>
                          </tr>
                          <tr>
                             <td className="p-4 font-bold text-zinc-300">decision</td>
                             <td className="p-4 text-zinc-500">enum</td>
                             <td className="p-4 text-orange-500 font-bold">Required</td>
                             <td className="p-4 font-sans text-zinc-400">`APPROVE_MERGE` | `FORCE_SPLIT` | `FLAG_ANOMALY`.</td>
                          </tr>
                          <tr>
                             <td className="p-4 font-bold text-zinc-300">justification_notes</td>
                             <td className="p-4 text-zinc-500">string</td>
                             <td className="p-4 text-orange-500 font-bold">Required</td>
                             <td className="p-4 font-sans text-zinc-400">Mandatory audit reasoning for the override.</td>
                          </tr>
                          <tr>
                             <td className="p-4 font-bold text-zinc-300">officer_id</td>
                             <td className="p-4 text-zinc-500">string</td>
                             <td className="p-4 text-orange-500 font-bold">Required</td>
                             <td className="p-4 font-sans text-zinc-400">Vetted Pilot Judge or Department Officer ID.</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>
           </section>

           {/* Section: Multi-Language SDKs */}
           <section id="sdks" className="space-y-8 pt-10 border-t border-zinc-800">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                       <Code size={16} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Multi-Language Client SDKs</h2>
                 </div>
                 <p className="text-zinc-400 font-medium leading-relaxed">
                    Integrate BBIE identity resolution directly into your existing tech stack using our official client libraries. Select your preferred language below for fully working pilot snippets.
                 </p>
              </div>

              {/* Code Snippet Tabs */}
              <div className="bg-[#121215] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                 <div className="flex border-b border-zinc-800 bg-zinc-900">
                    <button 
                      onClick={() => setActiveTab('curl')}
                      className={`px-6 py-4 font-mono text-xs uppercase tracking-wider font-bold border-b-2 transition-all ${
                        activeTab === 'curl' ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                       cURL
                    </button>
                    <button 
                      onClick={() => setActiveTab('python')}
                      className={`px-6 py-4 font-mono text-xs uppercase tracking-wider font-bold border-b-2 transition-all ${
                        activeTab === 'python' ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                       Python (Requests)
                    </button>
                    <button 
                      onClick={() => setActiveTab('typescript')}
                      className={`px-6 py-4 font-mono text-xs uppercase tracking-wider font-bold border-b-2 transition-all ${
                        activeTab === 'typescript' ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                       TypeScript / Node.js
                    </button>
                    <button 
                      onClick={() => setActiveTab('go')}
                      className={`px-6 py-4 font-mono text-xs uppercase tracking-wider font-bold border-b-2 transition-all ${
                        activeTab === 'go' ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                       Go (Golang)
                    </button>
                 </div>

                 <div className="p-6 bg-zinc-950 font-mono text-xs overflow-x-auto custom-scrollbar">
                    {activeTab === 'curl' && (
                       <pre className="text-orange-400">{`curl -X POST https://api.bbie.gov.in/v1/resolve \\
  -H "Authorization: Bearer PILOT_KEY_7719283" \\
  -H "X-BBIE-CLIENT-ID: PILOT_MINISTRY_01" \\
  -H "X-SOVEREIGNTY-MODE: FULL_MASK" \\
  -H "Content-Type: application/json" \\
  -d '{
    "entity_name": "Mphasis Limited",
    "pincode": "560001",
    "sovereignty_mask": true
  }'`}</pre>
                    )}
                    {activeTab === 'python' && (
                       <pre className="text-orange-400">{`import requests
import json

url = "https://api.bbie.gov.in/v1/resolve"
headers = {
    "Authorization": "Bearer PILOT_KEY_7719283",
    "X-BBIE-CLIENT-ID": "PILOT_MINISTRY_01",
    "X-SOVEREIGNTY-MODE": "FULL_MASK",
    "Content-Type": "application/json"
}
payload = {
    "entity_name": "Mphasis Limited",
    "pincode": "560001",
    "sovereignty_mask": True
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
print(json.dumps(response.json(), indent=2))`}</pre>
                    )}
                    {activeTab === 'typescript' && (
                       <pre className="text-orange-400">{`import axios from 'axios';

interface ResolveRequest {
  entity_name: string;
  pincode?: string;
  sovereignty_mask?: boolean;
}

async function resolveBusinessIdentity(data: ResolveRequest) {
  try {
    const response = await axios.post('https://api.bbie.gov.in/v1/resolve', data, {
      headers: {
        'Authorization': 'Bearer PILOT_KEY_7719283',
        'X-BBIE-CLIENT-ID': 'PILOT_MINISTRY_01',
        'X-SOVEREIGNTY-MODE': 'FULL_MASK',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('BBIE Resolution Error:', error);
    throw error;
  }
}`}</pre>
                    )}
                    {activeTab === 'go' && (
                       <pre className="text-orange-400">{`package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	url := "https://api.bbie.gov.in/v1/resolve"
	payload, _ := json.Marshal(map[string]interface{}{
		"entity_name":      "Mphasis Limited",
		"pincode":          "560001",
		"sovereignty_mask": true,
	})

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer PILOT_KEY_7719283")
	req.Header.Set("X-BBIE-CLIENT-ID", "PILOT_MINISTRY_01")
	req.Header.Set("X-SOVEREIGNTY-MODE", "FULL_MASK")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(body))
}`}</pre>
                    )}
                 </div>
              </div>
           </section>

           {/* Section: Error Codes & Matrix */}
           <section id="errors" className="space-y-8 pt-10 border-t border-zinc-800">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                       <AlertTriangle size={16} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Error Codes & Troubleshooting Matrix</h2>
                 </div>
                 <p className="text-zinc-400 font-medium leading-relaxed">
                    BBIE uses standardized HTTP status codes paired with detailed JSON error envelopes to ensure fast programmatic remediation during pilot integrations.
                 </p>
              </div>

              <div className="bg-[#121215] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-zinc-800 bg-zinc-900 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          <th className="p-4">HTTP Code</th>
                          <th className="p-4">Error Code</th>
                          <th className="p-4">Description</th>
                          <th className="p-4">Remediation Action</th>
                       </tr>
                    </thead>
                    <tbody className="text-xs font-mono divide-y divide-zinc-800 text-zinc-300">
                       <tr>
                          <td className="p-4 font-bold text-orange-500">400 Bad Request</td>
                          <td className="p-4 text-orange-500 font-bold">ERR_SCHEMA_INVALID</td>
                          <td className="p-4 font-sans text-zinc-400">Missing required `entity_name` or invalid pincode format.</td>
                          <td className="p-4 font-sans text-zinc-400">Check request payload against the official OpenAPI specification.</td>
                       </tr>
                       <tr>
                          <td className="p-4 font-bold text-orange-500">401 Unauthorized</td>
                          <td className="p-4 text-orange-500 font-bold">ERR_TOKEN_EXPIRED</td>
                          <td className="p-4 font-sans text-zinc-400">Institutional Bearer Token is missing, expired, or revoked.</td>
                          <td className="p-4 font-sans text-zinc-400">Request a fresh session token from the Governance Hub.</td>
                       </tr>
                       <tr>
                          <td className="p-4 font-bold text-orange-500">403 Forbidden</td>
                          <td className="p-4 text-orange-500 font-bold">ERR_SOVEREIGNTY_VIOLATION</td>
                          <td className="p-4 font-sans text-zinc-400">Attempted unmasked PII pull without high-security clearance.</td>
                          <td className="p-4 font-sans text-zinc-400">Ensure `X-SOVEREIGNTY-MODE` matches your departmental SLA tier.</td>
                       </tr>
                       <tr>
                          <td className="p-4 font-bold text-orange-500">404 Not Found</td>
                          <td className="p-4 text-orange-500 font-bold">ERR_UBID_UNKNOWN</td>
                          <td className="p-4 font-sans text-zinc-400">Requested UBID does not exist in the Golden Registry.</td>
                          <td className="p-4 font-sans text-zinc-400">Verify the UBID string or run a `POST /resolve` first.</td>
                       </tr>
                       <tr>
                          <td className="p-4 font-bold text-orange-500">409 Conflict</td>
                          <td className="p-4 text-orange-500 font-bold">ERR_COLLISION_DETECTED</td>
                          <td className="p-4 font-sans text-zinc-400">Multiple active businesses share identical names and pincodes.</td>
                          <td className="p-4 font-sans text-zinc-400">Provide secondary identifiers (PAN, GSTIN) to break the tie.</td>
                       </tr>
                       <tr>
                          <td className="p-4 font-bold text-orange-500">429 Too Many Requests</td>
                          <td className="p-4 text-orange-500 font-bold">ERR_RATE_LIMIT_EXCEEDED</td>
                          <td className="p-4 font-sans text-zinc-400">Institutional token bucket quota depleted.</td>
                          <td className="p-4 font-sans text-zinc-400">Implement exponential backoff or request a Tier-2 Enclave upgrade.</td>
                       </tr>
                       <tr>
                          <td className="p-4 font-bold text-orange-500">500 Internal Error</td>
                          <td className="p-4 text-orange-500 font-bold">ERR_ENGINE_TIMEOUT</td>
                          <td className="p-4 font-sans text-zinc-400">Upstream state registry (e.g., MCA/EPFO) failed to respond.</td>
                          <td className="p-4 font-sans text-zinc-400">Retry request after 5 seconds; BBIE will serve cached golden record.</td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </section>

           {/* Section: Safeguards */}
           <section id="safeguards" className="space-y-8 pt-10 border-t border-zinc-800">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                       <Shield size={16} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Sovereignty Shield Architecture</h2>
                 </div>
                 <p className="text-zinc-400 font-medium leading-relaxed">
                    The BBIE platform is built from the ground up to protect institutional data sovereignty. Raw business signals are scrubbed at the memory boundary.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-[#121215] p-8 border border-zinc-800 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 text-orange-500 font-bold text-sm">
                       <Lock size={18} /> Zero-Knowledge Matching
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                       When an institution submits a resolution query, PII strings (PAN, GSTIN) are converted into salted SHA-256 hashes inside an ephemeral enclave. Matching occurs strictly between hashes, guaranteeing that BBIE database administrators cannot reverse-engineer client customer lists.
                    </p>
                 </div>

                 <div className="bg-[#121215] p-8 border border-zinc-800 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 text-orange-500 font-bold text-sm">
                       <FileText size={18} /> Immutable Audit Ledger
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                       Every resolution merge, dossier retrieval, and human arbitration override is cryptographically signed and stored in a tamper-evident audit ledger. Pilot judges can verify the precise lineage of any Golden Record back to its raw registry origins.
                    </p>
                 </div>
              </div>
           </section>

           {/* Section: DPDP Act Compliance */}
           <section id="compliance" className="space-y-8 pt-10 border-t border-zinc-800">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                       <CheckCircle2 size={16} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">DPDP Act 2023 Compliance Framework</h2>
                 </div>
                 <p className="text-zinc-400 font-medium leading-relaxed">
                    BBIE strictly adheres to the Digital Personal Data Protection (DPDP) Act 2023 guidelines for institutional data fiduciaries.
                 </p>
              </div>

              <div className="space-y-4 text-xs text-zinc-300 font-medium leading-relaxed bg-[#121215] border border-zinc-800 p-8 rounded-3xl shadow-xl">
                 <div className="flex items-start gap-4 border-b border-zinc-800 pb-6">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold shrink-0 mt-0.5">1</div>
                    <div>
                       <h5 className="font-bold text-white uppercase tracking-wider mb-1">Purpose Limitation</h5>
                       <p className="text-zinc-400">Data ingested via API is utilized exclusively for identity deduplication and compliance scoring. It is never monetized, shared with third-party advertisers, or stored beyond the necessary arbitration lifecycle.</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4 border-b border-zinc-800 pb-6 pt-4">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold shrink-0 mt-0.5">2</div>
                    <div>
                       <h5 className="font-bold text-white uppercase tracking-wider mb-1">Data Minimization</h5>
                       <p className="text-zinc-400">Institutions can configure the `sovereignty_mask` parameter to receive only binary validation flags (e.g., `gst_valid: true`) rather than pulling complete, sensitive tax histories.</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4 pt-4">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold shrink-0 mt-0.5">3</div>
                    <div>
                       <h5 className="font-bold text-white uppercase tracking-wider mb-1">Right to Grievance Redressal</h5>
                       <p className="text-zinc-400">Business entities flagged with anomalies or incorrect merges can initiate a formal redressal workflow via the Governance Hub, triggering an immediate human-in-the-loop review by a designated pilot officer.</p>
                    </div>
                 </div>
              </div>
           </section>

           {/* Section: Pilot Onboarding Checklist */}
           <section id="onboarding" className="space-y-8 pt-10 border-t border-zinc-800">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                       <UserCheck size={16} />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Pilot Program Onboarding Checklist</h2>
                 </div>
                 <p className="text-zinc-400 font-medium leading-relaxed">
                    Follow this step-by-step checklist to complete your institutional onboarding and verify your API integration before the live pilot demonstration.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-[#121215] p-6 border border-zinc-800 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3 text-orange-500 font-bold text-xs uppercase tracking-widest">
                       <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px]">01</span> Generate Credentials
                    </div>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                       Log into the Governance Hub using your departmental credentials to provision a dedicated Tier-2 Service Role API Key.
                    </p>
                 </div>

                 <div className="bg-[#121215] p-6 border border-zinc-800 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3 text-orange-500 font-bold text-xs uppercase tracking-widest">
                       <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px]">02</span> Configure Sovereignty Mode
                    </div>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                       Set your default `X-SOVEREIGNTY-MODE` header in your API client based on your departmental data-sharing agreement.
                    </p>
                 </div>

                 <div className="bg-[#121215] p-6 border border-zinc-800 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3 text-orange-500 font-bold text-xs uppercase tracking-widest">
                       <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px]">03</span> Execute Sandbox Test
                    </div>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                       Run a test resolution against the known benchmark entity `Mphasis Limited` (Pincode `560001`) to verify 200 OK connectivity.
                    </p>
                 </div>

                 <div className="bg-[#121215] p-6 border border-zinc-800 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3 text-orange-500 font-bold text-xs uppercase tracking-widest">
                       <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px]">04</span> Verify Audit Propagation
                    </div>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                       Check the Review Workspace in the UI to ensure your API call successfully logged an immutable forensic audit trail.
                    </p>
                 </div>
              </div>

              {/* Pilot Support Callout */}
              <div className="p-8 bg-[#121215] border border-zinc-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl mt-12">
                 <div className="space-y-2 text-center md:text-left">
                    <h4 className="text-lg font-black text-white uppercase tracking-tight">Need Direct Pilot Engineering Support?</h4>
                    <p className="text-xs text-zinc-300 font-medium max-w-xl leading-relaxed">
                       As a selected pilot participant, you have direct access to the core Deepmind & BBIE architecture team for custom integration debugging.
                    </p>
                 </div>
                 <Link 
                   href="mailto:saifanmohammad39@gmail.com?subject=URGENT: BBIE Pilot Integration Support" 
                   className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30 shrink-0 active:scale-95 flex items-center gap-3"
                 >
                    <HelpCircle size={16} /> Contact Pilot Support
                 </Link>
              </div>
           </section>

        </div>
      </main>

      <footer className="relative z-10 border-t border-zinc-800 p-20 bg-[#09090b]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Shield className="text-white" size={16} />
            </div>
            <span className="text-white font-black uppercase tracking-tighter text-lg">BBIE Pilot Integration Guide</span>
          </div>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">© 2026 National Business Intelligence Engine</p>
        </div>
      </footer>
    </div>
  );
}

function SidebarLink({ label, active, onClick }: any) {
   return (
      <button 
        onClick={onClick}
        className={`w-full text-left px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-between group ${
         active ? 'bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-lg shadow-orange-500/10' : 'text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent'
      }`}>
         <span>{label}</span>
         <ChevronRight size={12} className={`transition-transform ${active ? 'text-orange-500 translate-x-0.5' : 'text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5'}`} />
      </button>
   )
}
