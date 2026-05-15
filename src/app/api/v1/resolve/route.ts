import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { calculateMatch } from '@/utils/matcher';
import { maskPII } from '@/utils/privacy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entity_name, pincode, sovereignty_mask } = body;

    if (!entity_name) {
      return NextResponse.json({ error: 'entity_name is required' }, { status: 400 });
    }

    // 1. Fetch potential candidates from Supabase
    // We filter by pincode or a partial name match to keep the result set manageable
    let query = supabase
      .from('businesses')
      .select('*');

    if (pincode) {
      query = query.eq('pincode', pincode);
    } else {
      // Fallback to name-based filtering if no pincode
      const firstWord = entity_name.split(' ')[0];
      query = query.ilike('primary_name', `%${firstWord}%`);
    }

    const { data: candidates, error } = await query.limit(50);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    // 2. Score candidates using the BBIE Confidence Engine
    const results = (candidates || []).map(business => {
      const sourceRecord = {
        primary_name: entity_name,
        pincode: pincode,
        registered_address: '' 
      };

      const targetRecord = {
        primary_name: business.name,
        registered_address: business.address,
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
