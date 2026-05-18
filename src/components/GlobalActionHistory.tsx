'use client';

import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Zap } from 'lucide-react';
import { getHistory, updateHistoryEntryUndone, HistoryEntry } from '@/utils/history';
import { revertRecord, runResolution } from '@/app/live-resolution/actions';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '@/utils/supabase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function GlobalActionHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isReverting, setIsReverting] = useState(false);
  const router = useRouter();

  const loadHistory = useCallback(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    // Check if the database was reset (0 businesses), and if so, auto-purge localStorage
    supabase.from('businesses').select('id', { count: 'exact', head: true }).then(({ count, error }) => {
      if (!error && count === 0) {
        localStorage.removeItem('bbie_action_history');
        localStorage.removeItem('bbie_live_current_data');
        localStorage.removeItem('bbie_live_stats');
        setHistory([]);
      } else {
        loadHistory();
      }
    });

    window.addEventListener('storage', loadHistory);
    window.addEventListener('bbie_history_change', loadHistory);
    return () => {
      window.removeEventListener('storage', loadHistory);
      window.removeEventListener('bbie_history_change', loadHistory);
    };
  }, [loadHistory]);

  const handleUndo = useCallback(async (entry: HistoryEntry) => {
    if (isReverting || entry.undone) return;
    setIsReverting(true);
    try {
      await revertRecord(entry.recordId, entry.businessId);
      updateHistoryEntryUndone(entry.recordId, true);

      // Update live resolution currentData & stats in localStorage
      try {
        const savedData = localStorage.getItem('bbie_live_current_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          const updatedData = parsed.map((r: any) => r.id === entry.recordId ? { ...r, status: 'raw' } : r);
          localStorage.setItem('bbie_live_current_data', JSON.stringify(updatedData));
        }

        const savedStats = localStorage.getItem('bbie_live_stats');
        if (savedStats) {
          const prevStats = JSON.parse(savedStats);
          const updatedStats = {
            ...prevStats,
            scanned: Math.max(0, prevStats.scanned - 1),
            resolved: entry.status === 'resolved' ? Math.max(0, prevStats.resolved - 1) : prevStats.resolved,
            triage: entry.status === 'triage' ? Math.max(0, prevStats.triage - 1) : prevStats.triage,
            duplicates: entry.status === 'new_entity' ? Math.max(0, prevStats.duplicates - 1) : prevStats.duplicates,
          };
          localStorage.setItem('bbie_live_stats', JSON.stringify(updatedStats));
        }
      } catch (e) {}

      router.refresh();
      window.dispatchEvent(new Event('bbie_live_data_refresh'));
    } catch (err) {
      console.error(`Undo failed for ${entry.entityName}:`, err);
    } finally {
      setIsReverting(false);
    }
  }, [isReverting, router]);

  const handleRedo = useCallback(async (entry: HistoryEntry) => {
    if (isReverting || !entry.undone) return;
    setIsReverting(true);
    try {
      const result = await runResolution(entry.recordId);
      updateHistoryEntryUndone(entry.recordId, false, result.matchedBusinessId, result.status);

      // Update live resolution currentData & stats in localStorage
      try {
        const savedData = localStorage.getItem('bbie_live_current_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          const updatedData = parsed.map((r: any) => r.id === entry.recordId ? { ...r, status: 'done' } : r);
          localStorage.setItem('bbie_live_current_data', JSON.stringify(updatedData));
        }

        const savedStats = localStorage.getItem('bbie_live_stats');
        if (savedStats) {
          const prevStats = JSON.parse(savedStats);
          const updatedStats = {
            ...prevStats,
            scanned: prevStats.scanned + 1,
            resolved: result.status === 'resolved' ? prevStats.resolved + 1 : prevStats.resolved,
            triage: result.status === 'triage' ? prevStats.triage + 1 : prevStats.triage,
            duplicates: result.status === 'new_entity' ? prevStats.duplicates + 1 : prevStats.duplicates,
          };
          localStorage.setItem('bbie_live_stats', JSON.stringify(updatedStats));
        }
      } catch (e) {}

      router.refresh();
      window.dispatchEvent(new Event('bbie_live_data_refresh'));
    } catch (err) {
      console.error(`Redo failed for ${entry.entityName}:`, err);
    } finally {
      setIsReverting(false);
    }
  }, [isReverting, router]);

  if (history.length === 0) return null;

  return (
    <div className="bg-black/60 border border-orange-600/20 rounded-3xl p-4 flex flex-col gap-2 max-h-[220px] w-full shadow-2xl backdrop-blur-xl my-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <RotateCcw size={10} /> Action History (Global Undo/Redo)
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-slate-600">{history.length} actions</span>
          <button 
            onClick={() => {
              localStorage.removeItem('bbie_action_history');
              setHistory([]);
              window.dispatchEvent(new Event('bbie_history_change'));
            }}
            className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[8px] font-black uppercase tracking-widest transition-all"
            title="Clear action log from browser cache"
          >
            Purge Log
          </button>
        </div>
      </div>
      <div className="overflow-y-auto space-y-2 custom-scrollbar pr-1 max-h-[160px]">
        {history.map((entry) => (
          <div key={entry.recordId} className={cn(
            "flex items-center justify-between border rounded-xl px-3 py-2 transition-all",
            entry.undone ? "bg-white/[0.01] border-white/5 opacity-40" : "bg-white/[0.03] border-white/5"
          )}>
            <div className="flex flex-col">
              <span className={cn(
                "text-[9px] font-black uppercase truncate w-48 md:w-64",
                entry.undone ? "text-slate-500 line-through" : "text-white"
              )}>{entry.entityName}</span>
              <span className={cn("text-[8px] font-bold uppercase tracking-widest",
                entry.undone ? 'text-slate-600' :
                entry.status === 'resolved' ? 'text-orange-500' :
                entry.status === 'new_entity' ? 'text-white' : 'text-orange-300'
              )}>{entry.undone ? 'UNDONE' : entry.status.replace('_', ' ')}</span>
            </div>
            {entry.undone ? (
              <button
                onClick={() => handleRedo(entry)}
                disabled={isReverting}
                className="p-1.5 rounded-lg bg-orange-600/10 border border-orange-600/20 text-orange-400 hover:bg-orange-600/20 transition-all disabled:opacity-30 flex items-center gap-1 text-[8px] font-black uppercase tracking-wider"
                title="Redo this action"
              >
                <Zap size={10} /> Redo
              </button>
            ) : (
              <button
                onClick={() => handleUndo(entry)}
                disabled={isReverting}
                className="p-1.5 rounded-lg bg-red-600/10 border border-red-600/20 text-red-400 hover:bg-red-600/20 transition-all disabled:opacity-30 flex items-center gap-1 text-[8px] font-black uppercase tracking-wider"
                title="Undo this action"
              >
                <RotateCcw size={10} /> Undo
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
