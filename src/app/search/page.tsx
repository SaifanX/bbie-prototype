import { Search, Filter, ArrowUpDown, MoreVertical, ShieldCheck, Globe, Fingerprint, Database, AlertTriangle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function EntitySearchPage({ searchParams }: { searchParams: Promise<{ q?: string, filter?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const filter = resolvedParams.filter || 'resolved'; // 'resolved' or 'unresolved'
  
  // NARRATIVE: If it's the start of the demo (no query, resolved filter), 
  // we might want to show "Nothing Yet" to emphasize the engine hasn't run.
  // But for the search page, we'll show results but add a clear "Verified" label.
  
  let results: any[] = [];

  console.log(`[SEARCH_QUERY] View: ${filter}, Term: "${query}"`);

  if (filter === 'resolved') {
    let dbQuery = supabase
      .from('businesses')
      .select(`
        id, 
        ubid, 
        primary_name, 
        registered_address,
        activity_status, 
        source_records(department)
      `)
      .limit(50);

    if (query) {
      dbQuery = dbQuery.or(`primary_name.ilike.%${query}%,ubid.ilike.%${query}%`);
    }

    const { data, error } = await dbQuery;
    if (error) console.error("[SEARCH_ERROR] Resolved View:", error);
    results = data || [];
  } else {
    // Unresolved data comes from source_records where business_id is null
    let dbQuery = supabase
      .from('source_records')
      .select(`
        id,
        entity_name,
        department,
        raw_data,
        created_at
      `)
      .is('business_id', null)
      .limit(50);

    if (query) {
      dbQuery = dbQuery.ilike('entity_name', `%${query}%`);
    }

    const { data, error } = await dbQuery;
    if (error) console.error("[SEARCH_ERROR] Unresolved View:", error);
    results = data || [];
  }

  return (
    <div className="p-10 space-y-10 min-h-screen relative">
      <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
        <Database size={200} className="text-indigo-500" />
      </div>

      <div className="z-10 relative">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={14} className="text-indigo-400" />
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Business Directory</span>
        </div>
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Search Businesses</h1>
        <p className="text-slate-500 mt-2 font-medium">Look up and check business details in our system.</p>
      </div>

      {/* Search Section */}
      <div className="space-y-4 z-10 relative">
        <form action="/search" method="GET" className="flex gap-4">
          <div className="flex-1 group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000" />
            <div className="relative flex items-center gap-4 glass-card px-6 py-4">
               <Search className="text-indigo-500" size={20} />
               <input 
                  type="text" 
                  name="q"
                  defaultValue={query}
                  placeholder="Enter business name or ID..." 
                  className="w-full bg-transparent border-none text-slate-200 focus:outline-none placeholder:text-slate-700 font-mono tracking-widest text-sm"
               />
               <input type="hidden" name="filter" value={filter} />
            </div>
          </div>
          <button type="submit" className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
            Search Now
          </button>
        </form>

        <div className="flex gap-2">
          <a 
            href={`/search?q=${query}&filter=resolved`}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${filter === 'resolved' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-slate-500 border-white/10 hover:text-white'}`}
          >
            Verified (Resolved)
          </a>
          <a 
            href={`/search?q=${query}&filter=unresolved`}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${filter === 'unresolved' ? 'bg-amber-600 text-white border-amber-500' : 'bg-white/5 text-slate-500 border-white/10 hover:text-white'}`}
          >
            To Review (Unresolved)
          </a>
        </div>
      </div>

      {/* Search Results */}
      <div className="glass-card overflow-hidden z-10 relative">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${filter === 'resolved' ? 'bg-indigo-500' : 'bg-amber-500'}`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {filter.toUpperCase()} RESULTS: <span className="text-white">{results.length}</span>
                </span>
             </div>
             {query && (
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SEARCHING FOR: <span className="text-indigo-400">"{query.toUpperCase()}"</span></span>
               </div>
             )}
          </div>
          <button className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-2">
            <ArrowUpDown size={12} /> Sort by Importance
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20">
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Business Name</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Address</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Found In</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                       <Search size={48} />
                       <span className="text-xs font-black uppercase tracking-widest">No entries found in registry</span>
                    </div>
                  </td>
                </tr>
              ) : (
                results.map((biz: any) => {
                  if (filter === 'resolved') {
                    const uniqueSources = Array.from(new Set(biz.source_records?.map((r: any) => r.department?.replace('_', ' ')) || []));
                    
                    return (
                      <tr key={biz.id} className="hover:bg-indigo-500/5 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <ShieldCheck size={18} className="text-emerald-500" />
                             </div>
                             <div>
                               <div className="font-bold text-white uppercase tracking-tight text-sm group-hover:text-emerald-400 transition-colors">
                                  {biz.primary_name}
                               </div>
                                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                                  UBID: {biz.ubid}
                                  <span className="w-1 h-1 rounded-full bg-indigo-500/30" />
                                  <span className="text-emerald-500/80 font-black tracking-tighter">VERIFIED RECORD</span>
                                </div>
                             </div>
                          </div>
                        </td>
                        <td className="p-6">
                           <div className="text-[11px] text-slate-400 font-medium max-w-[300px] line-clamp-2 italic">
                              {biz.registered_address || 'Address not listed'}
                           </div>
                        </td>
                        <td className="p-6">
                          <div className="flex gap-2 flex-wrap">
                            {uniqueSources.length > 0 ? uniqueSources.map((s: any) => (
                              <span key={s} className="text-[9px] font-black px-2 py-0.5 rounded bg-white/5 text-slate-500 border border-white/5 uppercase tracking-tighter">
                                 {s}
                              </span>
                            )) : (
                              <span className="text-[9px] font-black px-2 py-0.5 rounded bg-white/5 text-slate-600 border border-white/5 uppercase tracking-tighter">None</span>
                            )}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${biz.activity_status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`} />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${biz.activity_status === 'active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                               {biz.activity_status?.toUpperCase() || 'UNKNOWN'}
                             </span>
                          </div>
                        </td>
                        <td className="p-6 text-right">
                          <button className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  } else {
                    // Unresolved view
                    return (
                      <tr key={biz.id} className="hover:bg-amber-500/5 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <Database size={18} className="text-amber-500" />
                             </div>
                             <div>
                               <div className="font-bold text-slate-300 uppercase tracking-tight text-sm group-hover:text-amber-400 transition-colors">
                                  {biz.entity_name}
                               </div>
                               <div className="text-[10px] font-mono text-slate-600">ID: {biz.id.substring(0,8).toUpperCase()}</div>
                             </div>
                          </div>
                        </td>
                        <td className="p-6">
                           <div className="text-[11px] text-slate-500 font-medium max-w-[300px] line-clamp-2 italic">
                              {biz.raw_data?.address || 'Address not yet confirmed'}
                           </div>
                        </td>
                        <td className="p-6">
                           <span className="text-[9px] font-black px-2 py-0.5 rounded bg-amber-500/5 text-amber-500 border border-amber-500/10 uppercase tracking-tighter">
                              {biz.department?.replace('_', ' ') || 'GOVT SOURCE'}
                           </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                               UNVERIFIED
                             </span>
                          </div>
                        </td>
                        <td className="p-6 text-right">
                          <button className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
