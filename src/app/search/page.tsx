import { Search, Filter, ArrowUpDown, MoreVertical, ShieldCheck, Globe, Fingerprint, Database, AlertTriangle, ArrowRight, Zap, Building2, ShieldAlert } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { generateEmbedding } from '@/utils/gemini';
import Link from 'next/link';
import SearchResultsClient from './SearchResultsClient';

export const dynamic = 'force-dynamic';

export default async function EntitySearchPage({ searchParams }: { searchParams: Promise<{ q?: string, filter?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const filter = resolvedParams.filter || 'resolved'; // 'resolved' or 'unresolved'
  
  let results: any[] = [];
  console.log(`[SEARCH_QUERY] View: ${filter}, Term: "${query}"`);

  if (filter === 'resolved') {
    if (query) {
      const embedding = await generateEmbedding(query);
      
      const { data: vectorMatches, error: vError } = await supabase.rpc('match_businesses', {
        query_embedding: embedding,
        match_threshold: 0.1,
        match_count: 50
      });

      if (vError) console.error("[VECTOR_SEARCH_ERROR]", vError);
      
      if (vectorMatches && vectorMatches.length > 0) {
        const ids = vectorMatches.map((m: any) => m.id);
        const { data: businessData } = await supabase
          .from('businesses')
          .select(`
            id, ubid, name, address, status, pan, gstin, sector,
            source_records(department),
            activity_events(*)
          `)
          .in('id', ids);
        
        results = ids.map((id: string) => businessData?.find(b => b.id === id)).filter(Boolean);
      }
    } else {
      const { data } = await supabase
        .from('businesses')
        .select(`
          id, ubid, name, address, status, pan, gstin, sector,
          source_records(department),
          activity_events(*)
        `)
        .limit(50);
      results = data || [];
    }
  } else {
    // Unresolved data search (Source Records)
    let dbQuery = supabase
      .from('source_records')
      .select(`
        id, entity_name, department, raw_data, created_at,
        activity_events(*)
      `)
      .eq('resolved', false)
      .limit(50);

    if (query) {
      dbQuery = dbQuery.ilike('entity_name', `%${query}%`);
    }

    const { data } = await dbQuery;
    results = data || [];
  }

  return (
    <div className="p-10 min-h-screen w-full bg-[#08080a] text-slate-100 flex flex-col gap-10 relative overflow-x-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
        <Building2 size={400} className="text-orange-500" />
      </div>

      <div className="z-10 relative">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={14} className="text-orange-500 fill-orange-500" />
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em]">Central.Registry_Access</span>
        </div>
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">Registry Search</h1>
        <p className="text-slate-500 font-bold max-w-lg mt-2 uppercase text-[11px] tracking-widest opacity-80">
          Query the Bharat Business Intelligence Engine global registry.
        </p>
      </div>

      {/* Search Section */}
      <div className="space-y-6 z-10 relative">
        <form action="/search" method="GET" className="flex gap-4">
          <div className="flex-1 group relative">
            <div className="absolute -inset-1 bg-orange-600/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <div className="relative flex items-center gap-4 bg-black/40 border border-white/5 backdrop-blur-3xl px-8 py-5 rounded-2xl">
               <Search className="text-orange-500" size={20} />
               <input 
                  type="text" 
                  name="q"
                  defaultValue={query}
                  placeholder="QUERY BY NAME, PAN, OR UBID..." 
                  className="w-full bg-transparent border-none text-white focus:outline-none placeholder:text-slate-700 font-black tracking-[0.1em] text-sm uppercase"
               />
               <input type="hidden" name="filter" value={filter} />
            </div>
          </div>
          <button type="submit" className="px-12 py-5 bg-orange-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-orange-500 transition-all shadow-[0_20px_50px_rgba(234,88,12,0.2)] active:scale-95 group overflow-hidden relative">
            <span className="relative z-10">Execute Query</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </form>

        <div className="flex gap-3">
          <a 
            href={`/search?q=${query}&filter=resolved`}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${filter === 'resolved' ? 'bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white/5 text-slate-500 border-white/5 hover:text-white hover:bg-white/10'}`}
          >
            Verified Registry
          </a>
          <a 
            href={`/search?q=${query}&filter=unresolved`}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${filter === 'unresolved' ? 'bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white/5 text-slate-500 border-white/5 hover:text-white hover:bg-white/10'}`}
          >
            Awaiting Resolution
          </a>
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-black/40 border border-white/5 rounded-[32px] overflow-hidden z-10 relative backdrop-blur-3xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${filter === 'resolved' ? 'bg-orange-500 shadow-[0_0_10px_#ff6b00]' : 'bg-orange-300'}`} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {filter.toUpperCase()} OBJECTS: <span className="text-white">{results.length}</span>
                </span>
             </div>
             {query && (
               <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">FILTER: <span className="text-orange-500">"{query.toUpperCase()}"</span></span>
               </div>
             )}
          </div>
          <button className="text-[10px] font-black text-slate-500 hover:text-orange-500 uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
            <ArrowUpDown size={12} /> Priority.Sort
          </button>
        </div>
        
        <SearchResultsClient results={results} filter={filter} />
      </div>
    </div>
  );
}
