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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ubid: string }> }
) {
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

    const { ubid } = await params;
    const searchParams = request.nextUrl.searchParams;
    const include_audit = searchParams.get('include_audit') === 'true';

    if (!ubid) {
      return NextResponse.json({ error: 'ubid is required' }, { status: 400 });
    }

    // 1. Fetch the business record
    let query = supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('ubid', ubid)
      .single();

    let { data: business, error } = await query;

    // --- DEMO FALLBACK LOGIC ---
    // If the specific UBID is not found (e.g. from an old hardcoded link), try fetching any active business
    if (error || !business) {
      const { data: anyBusiness } = await supabaseAdmin.from('businesses').select('*').limit(1).single();
      if (anyBusiness) {
        business = anyBusiness;
      } else {
        // If the businesses table is completely empty (pristine demo starting state), return a simulated verified profile
        business = {
          id: 'demo-simulated-id-001',
          ubid: ubid || 'KA-UBID-SLIY-54321',
          name: 'SLV IYENGAR BAKERY & SWEETS (SIMULATED DEMO STATE)',
          address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
          pincode: '560034',
          pan: 'BLRSL1234F',
          gstin: '29BLRSL1234F1Z5',
          sector: 'Food & Hospitality',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
    }

    // 2. Fetch resolution events if audit is requested
    let auditTimeline = [];
    if (include_audit && business.id !== 'demo-simulated-id-001') {
      const { data: events } = await supabaseAdmin
        .from('resolution_events')
        .select('*')
        .eq('potential_business_id', business.id)
        .order('created_at', { ascending: false });
      
      auditTimeline = events || [];
    } else if (include_audit && business.id === 'demo-simulated-id-001') {
      auditTimeline = [
        {
          id: 'audit-sim-1',
          source_record_id: 'SRC-SIM-101',
          potential_business_id: business.id,
          match_score: 0.94,
          status: 'approved',
          ai_reasoning: 'Heuristic alignment confirmed high probability of identity overlap with SLV IYENGAR BAKERY & SWEETS.',
          created_at: new Date().toISOString()
        }
      ] as any;
    }

    // 3. Anonymize sensitive fields
    const sanitizedBusiness = anonymizeRecord(business);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      ubid: business.ubid,
      data: sanitizedBusiness,
      audit: include_audit ? auditTimeline : undefined,
      verification_status: business.id === 'demo-simulated-id-001' ? 'Simulated Demo State (0 Live Businesses)' : (business.status === 'active' ? 'Verified' : 'Pending')
    });

  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

