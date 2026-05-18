import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { anonymizeRecord } from '@/utils/privacy';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 3 * 60 * 1000; // 3 minutes
const MAX_REQUESTS = 5;

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();

    const clientData = rateLimitMap.get(ip);
    if (!clientData || now > clientData.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    } else {
      if (clientData.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Limited to 5 requests per 3 minutes.' },
          { status: 429, headers: { 'Retry-After': '180' } }
        );
      }
      clientData.count += 1;
      rateLimitMap.set(ip, clientData);
    }

    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const pincode = searchParams.get('pincode');
    const pan = searchParams.get('pan');
    const gstin = searchParams.get('gstin');
    const sector = searchParams.get('sector');
    const include_audit = searchParams.get('include_audit') === 'true';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 50) : 10;

    // Start building the query
    let query = supabaseAdmin
      .from('businesses')
      .select('*');

    if (name) {
      query = query.ilike('name', `%${name}%`);
    }
    if (pincode) {
      query = query.eq('pincode', pincode);
    }
    if (pan) {
      query = query.eq('pan', pan);
    }
    if (gstin) {
      query = query.eq('gstin', gstin);
    }
    if (sector) {
      query = query.ilike('sector', `%${sector}%`);
    }

    const { data: businesses, error } = await query.limit(limit);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    let results = businesses || [];

    // --- DEMO FALLBACK LOGIC ---
    // If no businesses matched or table is empty, provide simulated search results for demo explainability
    if (results.length === 0) {
      results = [
        {
          id: 'demo-simulated-id-001',
          ubid: 'KA-UBID-SLIY-54321',
          name: name ? `${name.toUpperCase()} (SIMULATED DEMO MATCH)` : 'SLV IYENGAR BAKERY & SWEETS (SIMULATED DEMO MATCH)',
          address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
          pincode: pincode || '560034',
          pan: pan || 'BLRSL1234F',
          gstin: gstin || '29BLRSL1234F1Z5',
          sector: sector || 'Food & Hospitality',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'demo-simulated-id-002',
          ubid: 'KA-UBID-MPHS-99482',
          name: name ? `${name.toUpperCase()} TECHNOLOGIES (SIMULATED)` : 'MPHASIS TECHNOLOGIES PVT LTD (SIMULATED)',
          address: 'Bagmane World Technology Center, Mahadevapura, Bengaluru',
          pincode: pincode || '560048',
          pan: pan || 'BLRMP1234F',
          gstin: gstin || '29BLRMP1234F1Z5',
          sector: sector || 'Information Technology',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }

    // Process audit timelines and anonymization
    const processedResults = await Promise.all(results.map(async (business) => {
      let auditTimeline = [];
      if (include_audit) {
        if (business.id.startsWith('demo-simulated-id')) {
          auditTimeline = [
            {
              id: `audit-sim-${business.id}`,
              source_record_id: 'SRC-SIM-101',
              potential_business_id: business.id,
              match_score: 0.96,
              status: 'approved',
              ai_reasoning: `Multimodal identity verification matched attributes for ${business.name}.`,
              created_at: business.created_at
            }
          ] as any;
        } else {
          const { data: events } = await supabaseAdmin
            .from('resolution_events')
            .select('*')
            .eq('potential_business_id', business.id)
            .order('created_at', { ascending: false });
          
          auditTimeline = events || [];
        }
      }

      const sanitizedBusiness = anonymizeRecord(business);

      return {
        ubid: business.ubid,
        data: sanitizedBusiness,
        audit: include_audit ? auditTimeline : undefined,
        match_type: business.id.startsWith('demo-simulated-id') ? 'Simulated Demo State' : 'Live Registry Match'
      };
    }));

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      count: processedResults.length,
      params: { name, pincode, pan, gstin, sector, include_audit, limit },
      results: processedResults
    });

  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
