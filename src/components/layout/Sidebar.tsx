'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Activity, Users, Settings, Database, Cpu, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Governance Hub' },
  { href: '/live-resolution', icon: Activity, label: 'Live Resolution' },
  { href: '/search', icon: Search, label: 'Registry Search' },
  { href: '/intelligence', icon: Database, label: 'Intelligence Hub' },
  { href: '/review', icon: Users, label: 'Review Workspace' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 flex flex-col h-screen fixed left-0 top-0 p-4 z-50">
      <div className="glass-card h-full flex flex-col overflow-hidden relative border-white/5 bg-black/40">
        {/* Glow behind logo */}
        
        <div className="h-24 flex items-center px-6 mb-4 relative">
          <div className="font-bold text-xl text-white tracking-tighter flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center group">
              <Cpu className="text-white group-hover:rotate-180 transition-transform duration-700" size={24} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">BHARAT</span>
              <span className="text-2xl font-black italic tracking-tighter uppercase">BBIE</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 py-4 flex flex-col gap-2 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative group">
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative z-10",
                  isActive ? "text-white" : "text-slate-500 hover:text-slate-200"
                )}>
                  <item.icon size={18} className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-orange-500" : "text-slate-600"
                  )} />
                  <span className="font-bold text-[11px] uppercase tracking-widest">{item.label}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 bg-orange-500/10 border border-orange-500/20 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 mt-auto">
          <Link href="/settings" className={cn(
            "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 border border-transparent",
            pathname === '/settings' ? "bg-white/5 border-white/5 text-white" : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
          )}>
            <Settings size={18} />
            <span className="font-bold text-[11px] uppercase tracking-widest">Settings</span>
          </Link>
          
          <div className="mt-6 p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/[0.02] transition-colors" />
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">CORE ONLINE</span>
            </div>
            <p className="text-[9px] text-slate-500 leading-relaxed font-mono uppercase tracking-tighter relative z-10">
              BUILD: V1.0.8-INDUSTRIAL <br />
              UPTIME: 99.98%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
