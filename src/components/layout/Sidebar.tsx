'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Activity, Users, Settings, Database, Cpu, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Command Center' },
  { href: '/simulator', icon: Activity, label: 'Database Simulator' },
  { href: '/search', icon: Search, label: 'Forensic Search' },
  { href: '/intelligence', icon: Database, label: 'Intelligence Hub' },
  { href: '/review', icon: Users, label: 'Review Workspace' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 flex flex-col h-screen fixed left-0 top-0 p-4 z-50">
      <div className="glass-card h-full flex flex-col overflow-hidden relative">
        {/* Glow behind logo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/10 blur-[40px]" />
        
        <div className="h-20 flex items-center px-6 mb-4 relative">
          <div className="font-bold text-xl text-white tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 group">
              <Cpu className="text-white group-hover:rotate-90 transition-transform duration-500" size={20} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-light text-indigo-400 uppercase tracking-widest">BHARAT</span>
              <span className="text-xl font-bold">ENGINE</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 py-4 flex flex-col gap-1.5 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative group">
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative z-10",
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                )}>
                  <item.icon size={20} className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-indigo-400" : "text-slate-500"
                  )} />
                  <span className="font-medium tracking-tight">{item.label}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-3 mt-auto">
          <Link href="/settings" className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
            pathname === '/settings' ? "bg-slate-800/50 text-white" : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
          )}>
            <Settings size={20} />
            <span className="font-medium">App Settings</span>
          </Link>
          
          <div className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">App Online</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
              BBIE v1.0.4-STABLE <br />
              SERVER: IN-KA-01
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
