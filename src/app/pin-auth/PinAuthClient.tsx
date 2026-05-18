'use client'

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyPinAction } from './actions';
import { motion } from 'framer-motion';
import { Shield, Lock, AlertTriangle, ArrowRight, Loader2, Key } from 'lucide-react';
import { clsx } from 'clsx';

export function PinAuthClient() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setError('Please enter the PIN code.');
      return;
    }

    setError('');
    startTransition(async () => {
      const res = await verifyPinAction(pin);
      if (res.success) {
        router.push(redirect);
      } else {
        setError(res.message || 'Authentication failed.');
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#09090b] text-zinc-100 p-4 relative overflow-hidden selection:bg-orange-500/30">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#121215] border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 backdrop-blur-xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner group">
            <Lock className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">Restricted Access Gate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Security Clearance Required</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 font-medium leading-relaxed">
            Please enter the master database security PIN to access the BBIE Command Center and analytical tools.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-xs sm:text-sm font-semibold"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-orange-500" /> Enter Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••••••••"
                disabled={isPending}
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-2xl px-5 py-4 text-white placeholder-zinc-700 text-lg sm:text-xl font-mono tracking-widest outline-none transition-all disabled:opacity-50"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-black font-black uppercase text-xs sm:text-sm tracking-[0.2em] py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Verifying Clearance...
              </>
            ) : (
              <>
                Authenticate Access <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col items-center gap-2 text-center">
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Database Validation Status</span>
          <p className="text-[11px] text-zinc-500 font-medium">
            Attempts are logged and monitored. 3 consecutive failed attempts trigger an automated 1-hour security lockout.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
