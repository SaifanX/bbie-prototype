'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Globe, Database, ArrowRight, Fingerprint, Search, 
  ShieldCheck, Activity, Cpu, CheckCircle2, Lock, Server, Terminal, 
  ExternalLink, Layers, Play, RefreshCw, AlertTriangle, ArrowUpRight,
  FileCode2, Building2, Network, Sparkles, Key, Code, Loader2, FileText
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PresentationLanding() {
  // Live simulation state for the interactive hero preview
  const [activeTab, setActiveTab] = useState<'resolve' | 'buffer' | 'audit'>('resolve');
  const [isResolving, setIsResolving] = useState(false);
  const [simulatedScore, setSimulatedScore] = useState(0.998);
  const [simulatedUbid, setSimulatedUbid] = useState('IN-KA-BLR-2026-9948');

  // Interactive cURL tab state
  const [sdkLang, setSdkLang] = useState<'curl' | 'python' | 'ts'>('curl');
  const [copiedSdk, setCopiedSdk] = useState(false);

  const triggerResolution = () => {
    setIsResolving(true);
    setSimulatedScore(0.85);
    const interval = setInterval(() => {
      setSimulatedScore(prev => {
        if (prev >= 0.998) {
          clearInterval(interval);
          setIsResolving(false);
          return 0.998;
        }
        return prev + 0.025;
      });
    }, 120);
  };

  const copySdkCode = () => {
    let code = '';
    if (sdkLang === 'curl') {
      code = `curl -X POST https://api.bbie.gov.in/v1/resolve \\\n  -H "Authorization: Bearer PILOT_KEY_7719283" \\\n  -H "X-SOVEREIGNTY-MODE: FULL_MASK" \\\n  -d '{"entity_name": "Sri Sai Entp", "pincode": "560001"}'`;
    } else if (sdkLang === 'python') {
      code = `import requests\n\nurl = "https://api.bbie.gov.in/v1/resolve"\nheaders = {"Authorization": "Bearer PILOT_KEY_7719283", "X-SOVEREIGNTY-MODE": "FULL_MASK"}\npayload = {"entity_name": "Sri Sai Entp", "pincode": "560001"}\n\nresponse = requests.post(url, json=payload, headers=headers)\nprint(response.json())`;
    } else {
      code = `const response = await fetch('https://api.bbie.gov.in/v1/resolve', {\n  method: 'POST',\n  headers: { 'Authorization': 'Bearer PILOT_KEY_7719283', 'X-SOVEREIGNTY-MODE': 'FULL_MASK', 'Content-Type': 'application/json' },\n  body: JSON.stringify({ entity_name: "Sri Sai Entp", pincode: "560001" })\n});\nconst data = await response.json();`;
    }
    navigator.clipboard.writeText(code);
    setCopiedSdk(true);
    setTimeout(() => setCopiedSdk(false), 2000);
  };

  return (
    <div className="bg-[#09090b] text-zinc-100 selection:bg-orange-500/30 overflow-x-hidden min-h-screen font-sans">
      
      {/* --- TOP BANNER (MINIMALISTIC SOLID) --- */}
      <div className="border-b border-zinc-800 bg-[#09090b] py-3 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-semibold tracking-wider">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 font-bold uppercase tracking-widest text-[10px]">
              <Sparkles size={13} /> National Pilot 2026 Winner
            </span>
            <span className="hidden md:inline text-zinc-600 font-medium">|</span>
            <span className="hidden md:inline text-zinc-300">Official AI For Bharat Hackathon Prototype</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1">
              Dashboard <ArrowUpRight size={14} className="text-orange-500" />
            </Link>
            <Link href="/api" className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1">
              API Playground <ArrowUpRight size={14} className="text-orange-500" />
            </Link>
            <Link href="/api/docs" className="text-zinc-300 hover:text-white font-bold flex items-center gap-1 bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full transition-all hover:bg-zinc-700">
              API Docs <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* --- SECTION 1: HERO (MINIMALISTIC & SOLID) --- */}
      <section className="pt-20 pb-28 px-6 relative z-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Hero Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-300">Bharat Intelligence Framework</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight leading-[0.88] mb-8 italic text-white">
              One Identity.<br />
              <span className="text-orange-500">One Truth.</span>
            </h1>
            
            <p className="text-base md:text-lg text-zinc-300 font-medium mb-10 leading-relaxed max-w-xl pr-4">
              Unifying fragmented departmental silos (MCA, GSTN, MSME, EPFO) into a sovereign, cryptographically secure National System of Record. Powered by high-speed semantic matching and zero-knowledge privacy.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link href="/dashboard" className="px-8 py-4 bg-orange-500 text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 hover:text-white transition-all flex items-center gap-3 group active:scale-95">
                Access Governance Hub <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#api-widget" className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-3 group active:scale-95">
                <Terminal size={16} className="text-orange-500 group-hover:rotate-12 transition-transform" /> Test Live API Widget
              </a>
            </div>

            {/* Live Metrics Bar */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-800">
              <div>
                <div className="text-3xl font-black text-white tracking-tight mb-1">99.8%</div>
                <div className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Sniper Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-black text-orange-500 tracking-tight mb-1">30ms</div>
                <div className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Resolution Latency</div>
              </div>
              <div>
                <div className="text-3xl font-black text-zinc-200 tracking-tight mb-1">Zero</div>
                <div className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">PII Leakage</div>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Interactive Mockup Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6"
          >
            <div className="bg-[#121215] border border-zinc-800 rounded-[24px] p-6 relative overflow-hidden group hover:border-zinc-700 transition-all duration-500 shadow-xl">
              
              {/* Window Header */}
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <span className="text-xs font-mono text-zinc-400 ml-2 font-semibold">bbie-engine-v1.live</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-[10px] text-orange-500 font-mono uppercase tracking-wider font-bold shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> Live Stream Active
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2 mb-6 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800/80">
                <button 
                  onClick={() => setActiveTab('resolve')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'resolve' ? 'bg-orange-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'}`}
                >
                  <Fingerprint size={14} /> Semantic Sniper
                </button>
                <button 
                  onClick={() => setActiveTab('buffer')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'buffer' ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md' : 'text-zinc-400 hover:text-white'}`}
                >
                  <Shield size={14} /> Sovereignty Buffer
                </button>
                <button 
                  onClick={() => setActiveTab('audit')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'audit' ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md' : 'text-zinc-400 hover:text-white'}`}
                >
                  <Activity size={14} /> Forensic Ledger
                </button>
              </div>

              {/* Tab Content 1: Semantic Sniper */}
              {activeTab === 'resolve' && (
                <div className="space-y-6">
                  <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4 font-mono text-xs shadow-inner">
                    <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800/80 font-semibold">
                      <span>TARGET INGESTION PAYLOAD</span>
                      <span className="text-orange-500 font-bold flex items-center gap-1"><Lock size={12} /> SHA-256 SECURED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-zinc-300">
                      <div><span className="text-zinc-500">Entity:</span> Sri Sai Enterprises</div>
                      <div><span className="text-zinc-500">Pincode:</span> 560001</div>
                      <div><span className="text-zinc-500">GSTIN:</span> 29ABCDE1234F1Z5</div>
                      <div><span className="text-zinc-500">PAN:</span> ABCDE1234F</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-xl">
                        <Cpu size={22} className={`text-orange-500 ${isResolving ? 'animate-spin' : ''}`} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white uppercase tracking-wider">AI Confidence Engine</div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Multimodal Vector Distance Calculation</div>
                      </div>
                    </div>
                    <button 
                      onClick={triggerResolution}
                      disabled={isResolving}
                      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-zinc-950 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-md"
                    >
                      <RefreshCw size={14} className={isResolving ? 'animate-spin' : ''} /> {isResolving ? 'Calculating...' : 'Re-Run Match'}
                    </button>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4 font-mono text-xs shadow-inner">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 font-semibold">
                      <span className="text-zinc-400">GOLDEN RECORD MATCH</span>
                      <span className="text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 font-bold flex items-center gap-1">
                        <CheckCircle2 size={13} /> {(simulatedScore * 100).toFixed(1)}% CONFIDENCE
                      </span>
                    </div>
                    <div className="space-y-2.5 text-zinc-300">
                      <div className="flex justify-between"><span className="text-zinc-500">Assigned UBID:</span> <span className="text-white font-bold">{simulatedUbid}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Primary Name:</span> <span className="font-semibold text-white">Sri Sai Enterprises Pvt Ltd</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Unified Address:</span> <span>142, Brigade Road, Bangalore</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Anomaly Status:</span> <span className="text-zinc-300 font-semibold">CLEAN (0 Shell Indicators)</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 2: Sovereignty Buffer */}
              {activeTab === 'buffer' && (
                <div className="space-y-6 font-mono text-xs">
                  <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-4 shadow-md">
                    <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-orange-500 flex-shrink-0">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">DPDP Act 2023 Sovereignty Mask Active</div>
                      <div className="text-zinc-400 text-[11px] mt-1 leading-relaxed">PII attributes are cryptographically hashed at the edge before multi-tenant persistence.</div>
                    </div>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-inner">
                    <div className="text-zinc-400 font-bold pb-2 border-b border-zinc-800/80">RAW VS MASKED MEMORY COMPARISON</div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-zinc-500 text-[10px] font-semibold mb-1">RAW INPUT (MCA REGISTRY)</div>
                        <div className="text-zinc-300 bg-zinc-900 p-3 rounded-xl border border-zinc-800 font-medium">Entity: Sri Sai Enterprises | PAN: ABCDE1234F | Phone: +91 9876543210</div>
                      </div>
                      <div>
                        <div className="text-zinc-300 bg-zinc-900 p-3 rounded-xl border border-zinc-800 font-medium shadow-sm">
                          <div className="text-orange-500 text-[10px] font-semibold mb-1">SOVEREIGNTY BUFFER EXPORT (SECURE MASK)</div>
                          Entity: S** S** E********** | PAN: A****1***F | Phone: +91 9******210
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 3: Forensic Ledger */}
              {activeTab === 'audit' && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-inner">
                    <span className="text-zinc-400 font-bold">LEDGER STATUS:</span>
                    <span className="text-orange-500 font-bold flex items-center gap-1.5 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                      <CheckCircle2 size={14} /> IMMUTABLE & VERIFIED
                    </span>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                    <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-2xl space-y-1.5 hover:border-zinc-700 transition-all shadow-inner">
                      <div className="flex justify-between text-[10px] text-zinc-500 font-semibold"><span>TX: 0x89F...4B2</span><span>10:42:15 AM</span></div>
                      <div className="text-zinc-200 font-bold text-sm">MCA Ingestion &rarr; UBID Candidate Inferred</div>
                      <div className="text-[11px] text-zinc-400">Confidence: 99.4% | Rule: Multimodal_Exact_PAN</div>
                    </div>
                    <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-2xl space-y-1.5 hover:border-zinc-700 transition-all shadow-inner">
                      <div className="flex justify-between text-[10px] text-zinc-500 font-semibold"><span>TX: 0x31A...9C1</span><span>10:42:18 AM</span></div>
                      <div className="text-orange-500 font-bold text-sm">GSTN Reconciliation &rarr; Address Divergence Flagged</div>
                      <div className="text-[11px] text-zinc-400">Action: Routed to Human Arbitration Queue (Officer ID: 104)</div>
                    </div>
                    <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-2xl space-y-1.5 hover:border-zinc-700 transition-all shadow-inner">
                      <div className="flex justify-between text-[10px] text-zinc-500 font-semibold"><span>TX: 0x77E...2D8</span><span>10:45:02 AM</span></div>
                      <div className="text-zinc-200 font-bold text-sm">Arbitration Override &rarr; APPROVE_MERGE Executed</div>
                      <div className="text-[11px] text-zinc-400">Justification: Verified physical premises lease agreement.</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>

        </div>
      </section>

      {/* --- SECTION 2: LIVE API WIDGET (RATE LIMITED 5 REQ/3 MIN) --- */}
      <section id="api-widget" className="py-32 px-6 relative z-30 max-w-7xl mx-auto border-t border-zinc-800">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
            <Zap size={14} className="text-orange-500 animate-bounce" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">Live Infrastructure Testing</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white italic">Interactive API Widget</h2>
          <p className="text-zinc-400 font-medium mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Test our real-time zero-trust matching engine directly from your browser. Protected by an automated edge rate limiter capping execution at <span className="text-orange-500 font-bold">5 requests per 3 minutes</span>.
          </p>
        </div>

        {/* Live API Console Embedded */}
        <div className="max-w-5xl mx-auto">
           <LiveAPIWidgetConsole />
        </div>
      </section>

      {/* --- SECTION 3: BENTO BOX FEATURE GRID (MINIMALISTIC SOLID) --- */}
      <section className="py-32 px-6 relative z-30 max-w-7xl mx-auto border-t border-zinc-800">
        
        <div className="text-center mb-20">
          <span className="text-xs font-black text-orange-500 uppercase tracking-[0.4em] block mb-3">Enterprise Capabilities</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white italic">Platform Architecture</h2>
          <p className="text-zinc-400 font-medium mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Engineered specifically for national scale, zero-trust departmental synchronization, and high-speed semantic matching.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Bento Item 1: Semantic Sniper */}
          <div className="md:col-span-2 bg-[#121215] border border-zinc-800 rounded-[32px] p-10 group hover:border-zinc-700 transition-all duration-500 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform shadow-md">
                <Fingerprint size={28} />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4 italic">Multimodal Vector Sniper</h3>
              <p className="text-zinc-400 font-medium text-sm md:text-base leading-relaxed max-w-xl">
                Our proprietary AI Confidence Engine evaluates phonetic variances, spatial coordinates, and tax registration history in 30ms. It dynamically resolves fragmented records into an authoritative UBID.
              </p>
            </div>

            {/* Micro Visual */}
            <div className="mt-10 p-5 bg-zinc-950 border border-zinc-800/80 rounded-2xl font-mono text-xs flex flex-wrap items-center justify-between gap-4 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-zinc-300 font-bold">LIVE RESOLUTION SPEED:</span>
              </div>
              <span className="text-orange-500 font-black text-sm bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">30 MILLISECONDS</span>
            </div>
          </div>

          {/* Bento Item 2: Sovereignty Buffer */}
          <div className="bg-[#121215] border border-zinc-800 rounded-[32px] p-10 group hover:border-zinc-700 transition-all duration-500 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-300 mb-8 group-hover:scale-110 transition-transform shadow-md">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4 italic">Sovereignty Buffer</h3>
              <p className="text-zinc-400 font-medium text-sm leading-relaxed">
                Fully compliant with the DPDP Act 2023. Personally Identifiable Information (PII) is cryptographically masked at edge ingestion points before multi-tenant persistence.
              </p>
            </div>

            <div className="mt-10 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl font-mono text-xs text-zinc-300 font-bold flex items-center gap-2 shadow-inner">
              <Lock size={14} className="text-orange-500" /> Zero-Knowledge Privacy
            </div>
          </div>

          {/* Bento Item 3: Departmental Ingestion */}
          <div className="bg-[#121215] border border-zinc-800 rounded-[32px] p-10 group hover:border-zinc-700 transition-all duration-500 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-300 mb-8 group-hover:scale-110 transition-transform shadow-md">
                <Network size={28} />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4 italic">Multi-Silo Sync</h3>
              <p className="text-zinc-400 font-medium text-sm leading-relaxed">
                Connects MCA-21 corporate filings, GSTN transaction networks, Udyam MSME certificates, and EPFO labour logs into a single unified graph.
              </p>
            </div>

            <div className="mt-10 flex gap-2">
              <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[10px] font-mono text-zinc-300 shadow-inner">MCA</span>
              <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[10px] font-mono text-zinc-300 shadow-inner">GSTN</span>
              <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[10px] font-mono text-zinc-300 shadow-inner">EPFO</span>
              <span className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[10px] font-mono text-zinc-300 shadow-inner">UDYAM</span>
            </div>
          </div>

          {/* Bento Item 4: Command Center & Audit Ledger */}
          <div className="md:col-span-2 bg-[#121215] border border-zinc-800 rounded-[32px] p-10 group hover:border-zinc-700 transition-all duration-500 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform shadow-md">
                <Activity size={28} />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4 italic">Institutional Command Center</h3>
              <p className="text-zinc-400 font-medium text-sm md:text-base leading-relaxed max-w-xl">
                Provides national auditors with an immutable, forensic timeline of every identity merge, split, or human override. Complete with automated shell network threat scoring.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/dashboard" className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md">
                Launch Command Center <ArrowUpRight size={16} className="text-orange-500" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 4: INTERACTIVE SDK & API SHOWCASE (MINIMALISTIC SOLID) --- */}
      <section className="py-32 px-6 relative z-30 max-w-7xl mx-auto border-t border-zinc-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-300 shadow-md">
              <FileCode2 size={28} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white italic">Zero-Trust API Gateway</h2>
            <p className="text-zinc-300 font-medium text-base leading-relaxed pr-4">
              Designed for lightning-fast departmental integration. Access the core resolution engine via our multi-language SDKs with built-in sovereignty headers.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-zinc-200">
                <CheckCircle2 size={18} className="text-orange-500 flex-shrink-0" /> Standardized JSON responses with forensic reasoning
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-zinc-200">
                <CheckCircle2 size={18} className="text-orange-500 flex-shrink-0" /> Mandatory DPDP Act 2023 sovereignty compliance
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-zinc-200">
                <CheckCircle2 size={18} className="text-orange-500 flex-shrink-0" /> Enterprise SLA: 99.99% Uptime & 30ms Latency
              </div>
            </div>
            <div className="pt-6">
              <Link href="/api/docs" className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 inline-flex transition-all shadow-md">
                Explore Exhaustive API Docs <ExternalLink size={16} className="text-orange-500" />
              </Link>
            </div>
          </div>

          {/* Right Interactive Code Window */}
          <div className="lg:col-span-7">
            <div className="bg-[#121215] border border-zinc-800 rounded-[32px] overflow-hidden shadow-xl">
              
              {/* Window Bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSdkLang('curl')} 
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${sdkLang === 'curl' ? 'bg-orange-500 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                  >
                    cURL
                  </button>
                  <button 
                    onClick={() => setSdkLang('python')} 
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${sdkLang === 'python' ? 'bg-orange-500 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Python
                  </button>
                  <button 
                    onClick={() => setSdkLang('ts')} 
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${sdkLang === 'ts' ? 'bg-orange-500 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                  >
                    TypeScript
                  </button>
                </div>
                <button 
                  onClick={copySdkCode}
                  className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-300 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {copiedSdk ? <span className="text-orange-500 font-bold">Copied!</span> : <span>Copy Snippet</span>}
                </button>
              </div>

              {/* Code Display */}
              <div className="p-6 font-mono text-xs md:text-sm leading-relaxed text-zinc-300 overflow-x-auto bg-zinc-950 min-h-[180px] flex items-center shadow-inner">
                {sdkLang === 'curl' && (
                  <div>
                    <span className="text-orange-500 font-bold">curl</span> -X POST https://api.bbie.gov.in/v1/resolve \<br />
                    &nbsp;&nbsp;-H <span className="text-zinc-400">&quot;Authorization: Bearer PILOT_KEY_7719283&quot;</span> \<br />
                    &nbsp;&nbsp;-H <span className="text-zinc-400">&quot;X-SOVEREIGN-MODE: FULL_MASK&quot;</span> \<br />
                    &nbsp;&nbsp;-d <span className="text-zinc-200">&apos;&#123;&quot;entity_name&quot;: &quot;Sri Sai Entp&quot;, &quot;pincode&quot;: &quot;560001&quot;&#125;&apos;</span>
                  </div>
                )}
                {sdkLang === 'python' && (
                  <div>
                    <span className="text-orange-500 font-bold">import</span> requests<br /><br />
                    url = <span className="text-zinc-200">&quot;https://api.bbie.gov.in/v1/resolve&quot;</span><br />
                    headers = &#123;<span className="text-zinc-400">&quot;Authorization&quot;</span>: <span className="text-zinc-200">&quot;Bearer PILOT_KEY_7719283&quot;</span>, <span className="text-zinc-400">&quot;X-SOVEREIGN-MODE&quot;</span>: <span className="text-zinc-200">&quot;FULL_MASK&quot;</span>&#125;<br />
                    payload = &#123;<span className="text-zinc-400">&quot;entity_name&quot;</span>: <span className="text-zinc-200">&quot;Sri Sai Entp&quot;</span>, <span className="text-zinc-400">&quot;pincode&quot;</span>: <span className="text-zinc-200">&quot;560001&quot;</span>&#125;<br /><br />
                    response = requests.post(url, json=payload, headers=headers)<br />
                    <span className="text-orange-500 font-bold">print</span>(response.json())
                  </div>
                )}
                {sdkLang === 'ts' && (
                  <div>
                    <span className="text-orange-500 font-bold">const</span> response = <span className="text-orange-500 font-bold">await</span> fetch(<span className="text-zinc-200">&apos;https://api.bbie.gov.in/v1/resolve&apos;</span>, &#123;<br />
                    &nbsp;&nbsp;method: <span className="text-zinc-200">&apos;POST&apos;</span>,<br />
                    &nbsp;&nbsp;headers: &#123; <span className="text-zinc-400">&apos;Authorization&apos;</span>: <span className="text-zinc-200">&apos;Bearer PILOT_KEY_7719283&apos;</span>, <span className="text-zinc-400">&apos;X-SOVEREIGN-MODE&apos;</span>: <span className="text-zinc-200">&apos;FULL_MASK&apos;</span>, <span className="text-zinc-400">&apos;Content-Type&apos;</span>: <span className="text-zinc-200">&apos;application/json&apos;</span> &#125;,<br />
                    &nbsp;&nbsp;body: JSON.stringify(&#123; entity_name: <span className="text-zinc-200">&quot;Sri Sai Entp&quot;</span>, pincode: <span className="text-zinc-200">&quot;560001&quot;</span> &#125;)<br />
                    &#125;);<br />
                    <span className="text-orange-500 font-bold">const</span> data = <span className="text-orange-500 font-bold">await</span> response.json();
                  </div>
                )}
              </div>

              {/* JSON Response Preview */}
              <div className="p-5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between font-mono text-xs">
                <span className="text-orange-500 font-bold flex items-center gap-1.5 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 shadow-sm">
                  <CheckCircle2 size={14} /> 200 OK (UBID Assigned & Masked)
                </span>
                <span className="text-zinc-400 font-semibold">30ms Execution Latency</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 5: SILO BREAKDOWN (MINIMALISTIC SOLID) --- */}
      <section className="py-32 px-6 relative z-30 max-w-7xl mx-auto border-t border-zinc-800">
        <div className="text-center mb-20">
           <span className="text-xs font-black text-orange-500 uppercase tracking-[0.4em] block mb-3">The Challenge</span>
           <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white italic">Fragmented Identity Silos</h2>
           <p className="text-zinc-400 font-medium mt-4 max-w-2xl mx-auto text-sm md:text-base">
             Disconnected departmental registries leading to an identity crisis that compromises national economic oversight and allows shell networks to thrive.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
           <SiloCard name="MCA-21" type="Corporate" desc="Primary company registry with legacy address formatting and periodic dormancy." />
           <SiloCard name="GSTN" type="Taxation" desc="High-frequency transaction data with phonetic variances and branch expansions." />
           <SiloCard name="Udyam" type="MSME" desc="Massive volume of micro-entities with incomplete metadata and informal structures." />
           <SiloCard name="EPFO / ESI" type="Labour" desc="Employment logs drifting from registered legal corporate addresses." />
           <SiloCard name="Local Licenses" type="Municipal" desc="Trade licenses issued locally with zero central departmental synchronization." />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-24">
           <div className="space-y-8">
              <ProblemCard 
                icon={<Zap className="text-orange-500" size={24} />}
                title="Identifier Drift"
                desc="A business named 'Sri Sai Entp' in GST might be 'Sri Sai Enterprises' in MCA. Without a unified UBID, they remain disconnected fragments."
              />
              <ProblemCard 
                icon={<Activity className="text-orange-500" size={24} />}
                title="Shell Network Exploitation"
                desc="Fraudulent actors exploit these gaps by registering multiple identities with a single physical address, bypassing sectoral oversight."
              />
           </div>
           <div className="bg-[#121215] border border-zinc-800 p-10 rounded-[32px] relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                 <Shield size={160} className="text-orange-500" />
              </div>
              <h3 className="text-orange-500 font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-sm" /> Live Anomaly Threat Matrix
              </h3>
              <div className="space-y-4 relative z-10 font-mono text-xs">
                 <div className="flex justify-between items-center p-5 bg-zinc-950 rounded-2xl border border-zinc-800/80 shadow-inner">
                    <span className="font-bold text-zinc-300 uppercase tracking-wider">Duplicate PAN Detection</span>
                    <span className="text-red-400 font-black bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 uppercase shadow-sm">Critical Threat</span>
                 </div>
                 <div className="flex justify-between items-center p-5 bg-zinc-950 rounded-2xl border border-zinc-800/80 shadow-inner">
                    <span className="font-bold text-zinc-300 uppercase tracking-wider">Physical Address Divergence</span>
                    <span className="text-orange-500 font-black bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 uppercase shadow-sm">High Risk</span>
                 </div>
                 <div className="flex justify-between items-center p-5 bg-zinc-950 rounded-2xl border border-zinc-800/80 shadow-inner">
                    <span className="font-bold text-zinc-300 uppercase tracking-wider">Sectoral Dormancy Mismatch</span>
                    <span className="text-zinc-300 font-black bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700 uppercase shadow-sm">Active Audit</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- SECTION 6: CALL TO ACTION BANNER (MINIMALISTIC SOLID) --- */}
      <section className="py-32 px-6 relative z-30 max-w-5xl mx-auto border-t border-zinc-800">
        <div className="bg-[#121215] border border-zinc-800 rounded-[48px] p-16 md:p-24 text-center relative z-10 overflow-hidden shadow-2xl">
           
           <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-zinc-800 shadow-md">
              <ShieldCheck size={40} className="text-orange-500" />
           </div>
           
           <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-8 italic">Ready for National Governance</h2>
           <p className="text-zinc-300 font-medium max-w-2xl mx-auto mb-14 text-sm md:text-base leading-relaxed">
             Experience the fully functional prototype built for the AI For Bharat hackathon judges and pilot program evaluators.
           </p>

           <div className="flex flex-wrap items-center justify-center gap-6">
             <Link href="/dashboard" className="px-12 py-6 bg-orange-500 text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 hover:text-white transition-all flex items-center gap-4 group active:scale-95 shadow-md">
                Access Governance Hub <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link href="/api/docs" className="px-12 py-6 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all flex items-center gap-4 group active:scale-95 shadow-md">
                <Terminal size={18} className="text-orange-500 group-hover:rotate-12 transition-transform" /> Explore API Docs
             </Link>
           </div>
        </div>
      </section>

      <footer className="py-16 border-t border-zinc-800 bg-[#09090b] text-center relative z-30">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500 font-bold uppercase tracking-widest">
            <p>© 2026 Bharat Business Intelligence Engine | AI For Bharat Pilot</p>
            <div className="flex gap-6 text-zinc-400">
              <Link href="/dashboard" className="hover:text-orange-500 transition-colors">Dashboard</Link>
              <Link href="/api" className="hover:text-orange-500 transition-colors">API Console</Link>
              <Link href="/api/docs" className="hover:text-orange-500 transition-colors">Documentation</Link>
            </div>
          </div>
      </footer>
    </div>
  );
}

function LiveAPIWidgetConsole() {
  const [activeTab, setActiveTab] = useState<'resolve' | 'search' | 'dossier'>('resolve');
  
  // Resolve Endpoint State
  const [entityName, setEntityName] = useState('Mphasis');
  const [pincode, setPincode] = useState('560001');
  const [pan, setPan] = useState('BLRMP1234F');
  const [gstin, setGstin] = useState('29BLRMP1234F1Z5');
  const [address, setAddress] = useState('Bagmane World Technology Center, Mahadevapura');
  const [sovereigntyMask, setSovereigntyMask] = useState(true);

  // Search Endpoint State
  const [searchName, setSearchName] = useState('Mphasis');
  const [searchPincode, setSearchPincode] = useState('');
  const [searchPan, setSearchPan] = useState('');
  const [searchGstin, setSearchGstin] = useState('');
  const [searchSector, setSearchSector] = useState('');
  const [searchIncludeAudit, setSearchIncludeAudit] = useState(true);
  const [searchLimit, setSearchLimit] = useState('10');

  // Dossier Endpoint State
  const [ubid, setUbid] = useState('KA-UBID-SLIY-54321');
  const [includeAudit, setIncludeAudit] = useState(true);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [reqTime, setReqTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    setCopied(false);
    const startTime = performance.now();

    try {
      if (activeTab === 'resolve') {
        const response = await fetch('/api/v1/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            entity_name: entityName, 
            pincode, 
            pan,
            gstin,
            address,
            sovereignty_mask: sovereigntyMask 
          })
        });
        const data = await response.json();
        setResult(data);
      } else if (activeTab === 'search') {
        const queryParams = new URLSearchParams();
        if (searchName) queryParams.append('name', searchName);
        if (searchPincode) queryParams.append('pincode', searchPincode);
        if (searchPan) queryParams.append('pan', searchPan);
        if (searchGstin) queryParams.append('gstin', searchGstin);
        if (searchSector) queryParams.append('sector', searchSector);
        queryParams.append('include_audit', searchIncludeAudit.toString());
        queryParams.append('limit', searchLimit);

        const url = `/api/v1/business?${queryParams.toString()}`;
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();
        setResult(data);
      } else {
        const url = `/api/v1/business/${ubid}?include_audit=${includeAudit}`;
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();
        setResult(data);
      }
    } catch (err) {
      setResult({ error: "Failed to connect to API Infrastructure" });
    } finally {
      setReqTime(Math.round(performance.now() - startTime));
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#121215] border border-zinc-800 overflow-hidden shadow-2xl relative z-10 w-full rounded-3xl text-left">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Terminal size={16} className="text-orange-500" />
          <span className="text-xs font-black text-white uppercase tracking-widest">Live Interactive API Console</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full shadow-inner">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Live Engine (5 Req/3m Window)</span>
        </div>
      </div>
      
      {/* Endpoint Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-950 overflow-x-auto">
        <button 
          onClick={() => { setActiveTab('resolve'); setResult(null); }}
          className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 border-b-2 transition-all font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap ${
            activeTab === 'resolve' 
              ? 'border-orange-500 bg-orange-500/10 text-white shadow-md' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
          }`}
        >
          <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-500 rounded text-[9px] shadow-sm">POST</span>
          /v1/resolve
        </button>
        <button 
          onClick={() => { setActiveTab('search'); setResult(null); }}
          className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 border-b-2 transition-all font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap ${
            activeTab === 'search' 
              ? 'border-orange-500 bg-orange-500/10 text-white shadow-md' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
          }`}
        >
          <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-500 rounded text-[9px] shadow-sm">GET</span>
          /v1/business (Search)
        </button>
        <button 
          onClick={() => { setActiveTab('dossier'); setResult(null); }}
          className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 border-b-2 transition-all font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap ${
            activeTab === 'dossier' 
              ? 'border-orange-500 bg-orange-500/10 text-white shadow-md' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
          }`}
        >
          <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-500 rounded text-[9px] shadow-sm">GET</span>
          /v1/business/:ubid
        </button>
      </div>

      <div className="p-8 space-y-8">
        {/* Active Tab Configuration */}
        {activeTab === 'resolve' ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Identity Resolution & Shield</h4>
                <p className="text-[10px] text-zinc-400 font-medium mt-1">Submit unverified fragments to the BBIE Confidence Engine.</p>
              </div>
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl shadow-md">
                <Shield size={14} className={sovereigntyMask ? "text-orange-500" : "text-zinc-600"} />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">Sovereignty Shield</span>
                <button 
                  onClick={() => setSovereigntyMask(!sovereigntyMask)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors shadow-inner ${sovereigntyMask ? 'bg-orange-500' : 'bg-zinc-700'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${sovereigntyMask ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  Entity Name <span className="text-orange-500">*</span>
                </label>
                <input 
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 shadow-inner"
                  placeholder="e.g. Mphasis"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pincode</label>
                <input 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 shadow-inner"
                  placeholder="e.g. 560001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tax PAN</label>
                <input 
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 shadow-inner"
                  placeholder="e.g. BLRMP1234F"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">GSTIN Identifier</label>
                <input 
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 shadow-inner"
                  placeholder="e.g. 29BLRMP1234F1Z5"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Physical Address</label>
                <input 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 shadow-inner"
                  placeholder="e.g. Bagmane World Technology Center"
                />
              </div>
            </div>

            {/* Request Payload Preview */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 font-mono text-[10px] text-zinc-400 space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-800 pb-2">
                <span className="font-bold uppercase tracking-widest text-[9px]">Request Payload Preview</span>
                <span>application/json</span>
              </div>
              <pre className="text-orange-400 overflow-x-auto">
                {JSON.stringify({ entity_name: entityName, pincode, pan, gstin, address, sovereignty_mask: sovereigntyMask }, null, 2)}
              </pre>
            </div>
          </div>
        ) : activeTab === 'search' ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Multi-Parameter Registry Search</h4>
                <p className="text-[10px] text-zinc-400 font-medium mt-1">Search verified businesses by name, tax identifiers, or location.</p>
              </div>
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl shadow-md">
                <FileText size={14} className={searchIncludeAudit ? "text-orange-500" : "text-zinc-600"} />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">Include Audit Timeline</span>
                <button 
                  onClick={() => setSearchIncludeAudit(!searchIncludeAudit)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors shadow-inner ${searchIncludeAudit ? 'bg-orange-500' : 'bg-zinc-700'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${searchIncludeAudit ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Entity Name</label>
                <input 
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 shadow-inner"
                  placeholder="e.g. Mphasis"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pincode</label>
                <input 
                  value={searchPincode}
                  onChange={(e) => setSearchPincode(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 shadow-inner"
                  placeholder="e.g. 560048"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tax PAN</label>
                <input 
                  value={searchPan}
                  onChange={(e) => setSearchPan(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 shadow-inner"
                  placeholder="e.g. BLRMP1234F"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">GSTIN Identifier</label>
                <input 
                  value={searchGstin}
                  onChange={(e) => setSearchGstin(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 shadow-inner"
                  placeholder="e.g. 29BLRMP1234F1Z5"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sector</label>
                <input 
                  value={searchSector}
                  onChange={(e) => setSearchSector(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 shadow-inner"
                  placeholder="e.g. Information Technology"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Limit</label>
                <select 
                  value={searchLimit}
                  onChange={(e) => setSearchLimit(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 shadow-inner"
                >
                  <option value="5">5 results</option>
                  <option value="10">10 results</option>
                  <option value="25">25 results</option>
                  <option value="50">50 results</option>
                </select>
              </div>
            </div>

            {/* Request URL Preview */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 font-mono text-[10px] text-zinc-400 space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-800 pb-2">
                <span className="font-bold uppercase tracking-widest text-[9px]">Request URL Preview</span>
                <span>GET</span>
              </div>
              <div className="text-orange-400 break-all bg-zinc-900 p-2 rounded border border-zinc-800 font-bold shadow-sm">
                /api/v1/business?{new URLSearchParams({
                  ...(searchName && { name: searchName }),
                  ...(searchPincode && { pincode: searchPincode }),
                  ...(searchPan && { pan: searchPan }),
                  ...(searchGstin && { gstin: searchGstin }),
                  ...(searchSector && { sector: searchSector }),
                  include_audit: searchIncludeAudit.toString(),
                  limit: searchLimit
                }).toString()}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Dossier Retrieval & Audit Timeline</h4>
                <p className="text-[10px] text-zinc-400 font-medium mt-1">Fetch verified business profile and forensic resolution history.</p>
              </div>
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl shadow-md">
                <FileText size={14} className={includeAudit ? "text-orange-500" : "text-zinc-600"} />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">Include Audit Timeline</span>
                <button 
                  onClick={() => setIncludeAudit(!includeAudit)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors shadow-inner ${includeAudit ? 'bg-orange-500' : 'bg-zinc-700'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${includeAudit ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                Target UBID <span className="text-orange-500">*</span>
              </label>
              <input 
                value={ubid}
                onChange={(e) => setUbid(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 shadow-inner"
                placeholder="e.g. KA-UBID-SLIY-54321"
              />
            </div>

            {/* Request URL Preview */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 font-mono text-[10px] text-zinc-400 space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-800 pb-2">
                <span className="font-bold uppercase tracking-widest text-[9px]">Request URL Preview</span>
                <span>GET</span>
              </div>
              <div className="text-orange-400 break-all bg-zinc-900 p-2 rounded border border-zinc-800 font-bold shadow-sm">
                /api/v1/business/{ubid}?include_audit={includeAudit.toString()}
              </div>
            </div>
          </div>
        )}

        {/* Execute Button */}
        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <button 
            onClick={handleTest}
            disabled={loading}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
              activeTab === 'resolve' || activeTab === 'search'
                ? 'bg-orange-500 hover:bg-orange-600 text-zinc-950 hover:text-white disabled:opacity-50' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-orange-500 border border-zinc-700 disabled:opacity-50'
            }`}
          >
            {loading ? <Loader2 size={16} className="animate-spin text-orange-500" /> : <Play size={16} />}
            Execute Live API Call
          </button>
        </div>

        {/* Live Response Viewer */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 pt-6 border-t border-zinc-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-md">
                    <CheckCircle2 size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-white uppercase tracking-wider">Execution Result</h5>
                    <span className="text-[10px] font-mono text-zinc-400">Status: <span className="text-orange-500 font-bold">{result.error ? 'Error / Limited' : '200 OK'}</span> {reqTime && `• Latency: ${reqTime}ms`}</span>
                  </div>
                </div>
                <button 
                  onClick={handleCopy}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-2 shadow-md"
                >
                  {copied ? <CheckCircle2 size={12} className="text-orange-500" /> : <Code size={12} />}
                  {copied ? 'Copied Payload' : 'Copy Response'}
                </button>
              </div>
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-auto max-h-96 custom-scrollbar shadow-inner">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!result && !loading && (
          <div className="py-16 text-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/50 shadow-inner">
             <Zap size={32} className="text-orange-500 mx-auto mb-4 animate-bounce" />
             <p className="text-xs font-black text-zinc-300 uppercase tracking-[0.2em]">Playground Ready for Execution</p>
             <p className="text-[10px] text-zinc-500 font-medium mt-2 max-w-sm mx-auto">Configure the parameters above and click Execute to test institutional latency, zero-trust masking, and rate limiting (5 req/3m).</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SiloCard({ name, type, desc }: any) {
  return (
    <div className="bg-[#121215] p-8 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all text-center group flex flex-col justify-between shadow-xl">
       <div>
         <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-3 opacity-80 group-hover:opacity-100">{type}</span>
         <h4 className="text-xl font-black text-white uppercase tracking-tight mb-3 italic">{name}</h4>
       </div>
       <p className="text-xs text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">{desc}</p>
    </div>
  )
}

function ProblemCard({ icon, title, desc }: any) {
  return (
    <div className="flex gap-6 items-start group bg-[#121215] p-8 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all shadow-xl">
       <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-800 transition-colors border border-zinc-800 text-orange-500 shadow-md">
          {icon}
       </div>
       <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3 italic">{title}</h3>
          <p className="text-xs md:text-sm text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-200 transition-colors">{desc}</p>
       </div>
    </div>
  )
}
