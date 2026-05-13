'use client'

import { motion } from 'framer-motion'
import { Settings, Sliders, Key, Webhook, Save, ShieldCheck, Cpu, Zap, AlertTriangle, Fingerprint } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function SettingsPage() {
  return (
    <div className="p-10 space-y-10 min-h-screen relative overflow-y-auto">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <Settings size={300} className="text-indigo-500" />
      </div>

      <div className="flex justify-between items-end z-10 relative max-w-6xl mx-auto w-full">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">System Parameters</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Configuration</h1>
          <p className="text-slate-500 mt-2 font-medium">Fine-tune the system processing, API connections, and security settings.</p>
        </div>
        <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-indigo-500/20 active:scale-95">
          <Save size={18} /> Commit Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative max-w-6xl mx-auto w-full">
        
        {/* Navigation Sidebar - 3 Cols */}
        <div className="lg:col-span-3 space-y-3">
          <SettingNav icon={<Sliders size={18} />} label="PROCESSING_ENGINE" />
          <SettingNav icon={<Key size={18} />} label="API_CONNECTIONS" />
          <SettingNav icon={<Webhook size={18} />} label="DATA_FLOW" />
          <SettingNav icon={<ShieldCheck size={18} />} label="SECURITY_ROLES" />
          
          <div className="mt-8 p-6 glass-card border-indigo-500/20 bg-indigo-500/5">
             <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={14} className="text-indigo-400" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Admin Status</span>
             </div>
             <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                You are currently in **ADMINISTRATOR** mode. Changes made here will impact the entire system in real-time.
             </p>
          </div>
        </div>

        {/* Configuration Panel - 9 Cols */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* AI Thresholds */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
               <Zap size={20} className="text-indigo-500" />
               <h2 className="text-xl font-black text-white uppercase tracking-tighter">Processing Thresholds</h2>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <label className="text-sm font-black text-white uppercase tracking-tight">Auto-Merge Confidence</label>
                    <p className="text-[11px] text-slate-500 font-medium max-w-md">Score threshold above which the system bypasses human review and commits the merge.</p>
                  </div>
                  <span className="text-xl font-mono font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg">80%</span>
                </div>
                <div className="relative">
                   <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-1 bg-white/5 rounded-full" />
                   </div>
                   <input type="range" min="0" max="100" defaultValue="80" className="relative w-full accent-indigo-500 h-2 bg-transparent appearance-none cursor-pointer" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <label className="text-sm font-black text-white uppercase tracking-tight">Fuzzy Match Sensitivity</label>
                    <p className="text-[11px] text-slate-500 font-medium max-w-md">PostgreSQL trigram strictness index. Lower values allow broader matching before AI classification.</p>
                  </div>
                  <span className="text-xl font-mono font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">0.5</span>
                </div>
                <div className="relative">
                   <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-1 bg-white/5 rounded-full" />
                   </div>
                   <input type="range" min="0" max="1" step="0.1" defaultValue="0.5" className="relative w-full accent-emerald-500 h-2 bg-transparent appearance-none cursor-pointer" />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Feature Toggles */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
               <Fingerprint size={20} className="text-indigo-500" />
               <h2 className="text-xl font-black text-white uppercase tracking-tighter">Engine Features</h2>
            </div>
            
            <div className="space-y-6">
              <ToggleRow 
                title="AI_ASSISTED_ANALYSIS" 
                desc="Use AI logic to help resolve unclear business data." 
                active={true} 
              />
              <ToggleRow 
                title="REALTIME_DATA_UPDATE" 
                desc="Update other systems immediately after successful review." 
                active={false} 
              />
              <ToggleRow 
                title="STRICT_DATA_VALIDATION" 
                desc="Enforce accuracy validation for all incoming primary identifiers." 
                active={true} 
              />
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}

function SettingNav({ icon, label, active = false }: any) {
  return (
    <button className={cn(
      "w-full flex items-center gap-4 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
      active 
        ? "bg-indigo-600/10 text-white border-indigo-500/30" 
        : "text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-300"
    )}>
      {icon}
      <span>{label}</span>
      {active && <motion.div layoutId="nav-dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />}
    </button>
  );
}

function ToggleRow({ title, desc, active }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group">
      <div>
        <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{title}</div>
        <div className="text-[11px] text-slate-500 font-medium mt-1">{desc}</div>
      </div>
      <button className={cn(
        "w-12 h-6 rounded-full relative transition-all",
        active ? "bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.4)]" : "bg-slate-800"
      )}>
        <motion.div 
          animate={{ x: active ? 24 : 4 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg" 
        />
      </button>
    </div>
  );
}
