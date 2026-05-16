export type HistoryEntry = {
  recordId: string;
  businessId: string | null;
  entityName: string;
  status: string;
  undone?: boolean;
  timestamp: string;
};

const STORAGE_KEY = 'bbie_action_history';

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function addHistoryEntry(entry: Omit<HistoryEntry, 'timestamp'>) {
  if (typeof window === 'undefined') return;
  const current = getHistory();
  // Avoid duplicates if same recordId exists unless status changed
  const filtered = current.filter(h => h.recordId !== entry.recordId);
  const newEntry: HistoryEntry = { ...entry, timestamp: new Date().toISOString() };
  const updated = [newEntry, ...filtered].slice(0, 50); // Keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('bbie_history_change'));
}

export function updateHistoryEntryUndone(recordId: string, undone: boolean, newBusinessId: string | null = null, newStatus: string | null = null) {
  if (typeof window === 'undefined') return;
  const current = getHistory();
  const updated = current.map(h => {
    if (h.recordId === recordId) {
      return { 
        ...h, 
        undone, 
        ...(newBusinessId !== null ? { businessId: newBusinessId } : {}),
        ...(newStatus !== null ? { status: newStatus } : {})
      };
    }
    return h;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('bbie_history_change'));
}
