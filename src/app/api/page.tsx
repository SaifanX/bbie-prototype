'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Zap, Code, ArrowRight, CheckCircle2, Globe, Database, Server, Key, Lock, Search, FileText, Play, Loader2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function APIHubPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-orange-500/30">
      
      <nav className="relative z-10 p-8 flex justify-between items-center max-w-7xl mx-auto border-b border-zinc-800 bg-[#09090b]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
            <Shield className="text-white" size={20} />
          </div>
          <span className="text-white font-black uppercase tracking-tighter text-xl">BBIE <span className="text-orange-500">API Hub</span></span>
        </Link>
        <div className="flex gap-8 items-center">
          <Link href="/api/docs" className="text-sm font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors">Documentation</Link>
          <Link href="/dashboard" className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-black uppercase tracking-widest text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all shadow-md">Governance Dashboard</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-40">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-2 mb-6">
              <Key size={14} className="text-orange-500" />
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">API INFRASTRUCTURE</span>
            </div>
            <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
              The Institutional <br /><span className="text-orange-500">Identity Layer.</span>
            </h1>
            <p className="text-base text-zinc-400 font-medium mb-10 leading-relaxed max-w-lg pr-4">
              Powering the next generation of high-trust business workflows in Bharat. Resolve identities, search granular business registries, and verify compliance with zero-trust architecture.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/api/docs" className="px-8 py-4 bg-orange-500 text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 hover:text-white transition-all active:scale-95 flex items-center gap-3 shadow-md">
                Request API Token <ArrowRight size={16} />
              </Link>
              <Link href="/api/docs" className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-3 shadow-md">
                Quickstart Guide
              </Link>
            </div>
          </motion.div>

          {/* Live Endpoint Preview */}
          <div className="lg:col-span-7 relative">
             <APIConsole />
          </div>
        </div>

        {/* Granular Documentation Section */}
        <div className="space-y-24">
           <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Core API Reference</h2>
              <p className="text-zinc-400 font-medium">Standardized endpoints for institutional data consumption.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                title="Business Search"
                desc="Search the national registry by name, pincode, tax PAN, GSTIN, or sector when UBID is unknown."
                endpoint="GET /v1/business"
                params={[
                  { name: 'name', type: 'string', desc: 'Optional. Partial or exact business entity name.' },
                  { name: 'pincode', type: 'string', desc: 'Optional. 6-digit postal area code.' },
                  { name: 'pan', type: 'string', desc: 'Optional. 10-character Tax PAN identifier.' },
                  { name: 'gstin', type: 'string', desc: 'Optional. 15-character GST registration ID.' },
                  { name: 'sector', type: 'string', desc: 'Optional. Industry sector category.' }
                ]}
              />
              <DocSection 
                title="Dossier Retrieval"
                desc="Fetch the comprehensive National System of Record for any business using its unique UBID identifier."
                endpoint="GET /v1/business/:ubid"
                params={[
                  { name: 'ubid', type: 'string', desc: 'Required. The Unique Bharat Business ID.' },
                  { name: 'include_audit', type: 'boolean', desc: 'Optional. Include the forensic resolution timeline.' }
                ]}
              />
           </div>
        </div>

        {/* Safeguards Section */}
        <div className="mt-40">
           <div className="bg-[#121215] p-16 border border-zinc-800 rounded-3xl relative overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <Lock size={20} className="text-orange-500" />
                       <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Institutional Safeguards</h2>
                    </div>
                    <p className="text-zinc-400 font-medium leading-relaxed">
                       Our API is built on the **Sovereignty Shield** architecture. Every request is scrubbed of PII in the buffer layer, and matching occurs exclusively on forensic hashes.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <CheckCircle2 size={16} className="text-orange-500" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">TLS 1.3 Encryption</h4>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">In-transit sovereignty</p>
                       </div>
                       <div className="space-y-2">
                          <CheckCircle2 size={16} className="text-orange-500" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Zero-Trust Auth</h4>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Role-based dossier access</p>
                       </div>
                    </div>
                 </div>
                 <div className="relative">
                    <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 font-mono text-[10px] text-zinc-400 shadow-inner">
                       # Institutional Header Example <br />
                       X-BBIE-TOKEN: INSTITUTION_HASH_771 <br />
                       X-SOVEREIGNTY-MODE: FULL_MASK <br />
                       X-TIMESTAMP: 2026-05-16T13:30:07Z
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </main>

      <footer className="relative z-10 border-t border-zinc-800 p-20 bg-[#09090b]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
              <Shield className="text-white" size={16} />
            </div>
            <span className="text-white font-black uppercase tracking-tighter text-lg">BBIE API HUB</span>
          </div>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">© 2026 National Business Intelligence Engine</p>
        </div>
      </footer>
    </div>
  );
}

function APIConsole() {
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
          <span className="text-xs font-black text-white uppercase tracking-widest">Interactive API Console</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full shadow-inner">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Live Engine (5 Req/3m)</span>
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
            Execute Institutional Call
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
                    <span className="text-[10px] font-mono text-zinc-400">Status: <span className="text-orange-500 font-bold">{result.error ? 'Error / Limited' : '200 OK'}</span> {reqTime && `• Time: ${reqTime}ms`}</span>
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

function DocSection({ title, desc, endpoint, params }: any) {
  return (
    <div className="bg-[#121215] p-10 border border-zinc-800 hover:border-orange-500/50 transition-all rounded-3xl shadow-xl flex flex-col justify-between">
       <div>
         <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{title}</h3>
         <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-8">{desc}</p>
         
         <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 mb-8 flex items-center gap-4 shadow-inner">
            <Code size={16} className="text-orange-500" />
            <span className="text-xs font-mono text-white font-bold">{endpoint}</span>
         </div>

         <div className="space-y-4">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-4">Parameters</span>
            {params.map((p: any) => (
              <div key={p.name} className="flex flex-col gap-1.5 border-b border-zinc-800 pb-4 last:border-0">
                 <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-orange-500 font-bold">{p.name}</span>
                    <span className="text-[9px] px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 font-mono">{p.type}</span>
                 </div>
                 <p className="text-xs text-zinc-400 font-medium">{p.desc}</p>
              </div>
            ))}
         </div>
       </div>
    </div>
  )
}
