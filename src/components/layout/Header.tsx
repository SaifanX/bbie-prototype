"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, LogOut, User, Settings, AlertTriangle, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 relative z-50">
      {/* Search HUD */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative flex items-center gap-4 w-96 glass-card px-4 py-2.5">
            <Search className="text-indigo-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="SEARCH BUSINESS REGISTRY..." 
              className="w-full bg-transparent border-none text-sm text-slate-200 focus:outline-none placeholder:text-slate-600 font-mono tracking-wider"
            />
          </div>
        </div>

        {/* System Stats HUD */}
        <div className="hidden lg:flex items-center gap-8 px-6 py-2 glass-card rounded-full">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-amber-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">CONNECTION: <span className="text-white">STABLE</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-indigo-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">SECURITY: <span className="text-white">PROTECTED</span></span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Clock HUD */}
        <div className="text-right hidden sm:block min-w-[100px]">
          {mounted ? (
            <>
              <div className="text-xs font-mono text-indigo-400 tracking-[0.15em]">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
              </div>
            </>
          ) : (
            <div className="h-8 w-24 bg-white/5 animate-pulse rounded ml-auto" />
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-12 h-12 glass-card flex items-center justify-center relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors" />
            <Bell size={20} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 glass-card p-4 overflow-hidden z-50 neon-glow-indigo"
              >
                <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-4">Urgent Alerts</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-xs font-bold text-slate-200">ACTION REQUIRED</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">15 entries need your review for consistency.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 pl-6 border-l border-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 p-[1px]">
            <div className="w-full h-full rounded-full bg-[#020205] flex items-center justify-center text-xs font-bold">
              SA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
