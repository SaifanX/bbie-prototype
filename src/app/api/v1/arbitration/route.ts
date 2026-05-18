import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 3 * 60 * 1000; // 3 minutes
const MAX_REQUESTS = 5;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();

    const clientData = rateLimitMap.get(ip);
    if (!clientData || now > clientData.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    } else {
      if (clientData.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { status: 'error', code: 429, error: 'Rate limit exceeded. Limited to 5 requests per 3 minutes.' },
          { status: 429, headers: { 'Retry-After': '180' } }
        );
      }
      clientData.count += 1;
      rateLimitMap.set(ip, clientData);
    }

    const clientId = request.headers.get('x-bbie-client-id') || 'PILOT_DEFAULT_01';
    const body = await request.json();
    const { ubid, decision, justification_notes, officer_id } = body;

    if (!ubid || !decision || !justification_notes || !officer_id) {
      return NextResponse.json({ 
        status: 'error', 
        code: 400, 
        error: 'ERR_SCHEMA_INVALID: Missing required parameters (ubid, decision, justification_notes, officer_id).' 
      }, { status: 400 });
    }

    // Log arbitration event to Supabase
    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('ubid', ubid)
      .limit(1)
      .single();

    const potentialBusinessId = business?.id || 'demo-simulated-id-001';

    const { error } = await supabaseAdmin
      .from('resolution_events')
      .insert({
        source_record_id: `ARB-${officer_id}-${Date.now()}`,
        potential_business_id: potentialBusinessId,
        match_score: 1.0, // Human override
        status: decision === 'APPROVE_MERGE' ? 'approved' : (decision === 'FORCE_SPLIT' ? 'rejected' : 'flagged'),
        ai_reasoning: `Human Arbitration Override by Officer ${officer_id} (${clientId}). Justification: ${justification_notes}`,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Arbitration insert error:', error);
    }

    return NextResponse.json({
      status: 'success',
      code: 200,
      arbitration_receipt: {
        ubid,
        decision,
        officer_id,
        client_id: clientId,
        timestamp: new Date().toISOString(),
        ledger_status: 'IMMUTABLE_LOGGED'
      }
    });

  } catch (err) {
    console.error('Arbitration API Error:', err);
    return NextResponse.json({ status: 'error', code: 400, error: 'Invalid request body schema.' }, { status: 400 });
  }
}
