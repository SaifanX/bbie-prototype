import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateMatch } from '@/utils/matcher';
import { maskPII } from '@/utils/privacy';

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
          { error: 'Rate limit exceeded. Limited to 5 requests per 3 minutes.' },
          { status: 429, headers: { 'Retry-After': '180' } }
        );
      }
      clientData.count += 1;
      rateLimitMap.set(ip, clientData);
    }

    const body = await request.json();
    const { entity_name, pincode, sovereignty_mask, pan, gstin, address } = body;


    if (!entity_name) {
      return NextResponse.json({ error: 'entity_name is required' }, { status: 400 });
    }

    // 1. Fetch potential candidates from Supabase
    // We filter by pincode or a partial name match to keep the result set manageable
    let query = supabaseAdmin
      .from('businesses')
      .select('*');

    if (pincode) {
      query = query.eq('pincode', pincode);
    } else {
      // Fallback to name-based filtering if no pincode
      const firstWord = entity_name.split(' ')[0];
      query = query.ilike('name', `%${firstWord}%`);
    }

    const { data: candidates, error } = await query.limit(50);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    // 2. Score candidates using the BBIE Confidence Engine
    const results = (candidates || []).map(business => {
      const sourceRecord = {
        name: entity_name,
        pincode: pincode,
        address: address || '',
        pan: pan,
        gstin: gstin
      };

      const targetRecord = {
        name: business.name,
        address: business.address,
        pincode: business.pincode,
        pan: business.pan,
        gstin: business.gstin
      };


      const match = calculateMatch(sourceRecord, targetRecord);
      
      let businessData = { ...business };
      
      // 3. Apply Sovereignty Masking if requested
      if (sovereignty_mask) {
        businessData.name = maskPII(businessData.name);
        businessData.address = maskPII(businessData.address || '');
      }

      return {
        ubid: business.ubid,
        business: businessData,
        score: match.score,
        reasoning: match.reasoning,
        matched_fields: match.matchedFields
      };
    });

    // 4. Sort by score descending and return
    const sortedResults = results.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      results: sortedResults
    });

  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
