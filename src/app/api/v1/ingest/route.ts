import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processRecord } from '@/utils/engine';
import { translateKannadaToEnglish } from '@/utils/gemini';
import { hasKannada } from '@/utils/normalize';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
);

export async function POST(request: NextRequest) {
  try {
    // 1. Authorization check
    const token = request.headers.get('x-bbie-token') || request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing API token' }, { status: 401 });
    }
    
    // 2. Parse body
    const body = await request.json();
    let { entity_name, department, source_id, pan, gstin, address, pincode, raw_data } = body;

    if (!entity_name) {
      return NextResponse.json({ error: 'entity_name is required' }, { status: 400 });
    }
    if (!department) {
      return NextResponse.json({ error: 'department is required' }, { status: 400 });
    }

    const originalName = entity_name;
    const originalAddress = address || '';

    // 3. Multilingual Translation (Kannada -> English)
    let nameTranslated = false;
    let addrTranslated = false;

    if (hasKannada(entity_name)) {
      entity_name = await translateKannadaToEnglish(entity_name);
      nameTranslated = true;
    }
    if (address && hasKannada(address)) {
      address = await translateKannadaToEnglish(address);
      addrTranslated = true;
    }

    // 4. Insert into source_records
    const recordId = crypto.randomUUID();
    const updatedRawData = {
      ...(raw_data || {}),
      pincode: pincode || undefined,
      original_kannada_name: nameTranslated ? originalName : undefined,
      original_kannada_address: addrTranslated ? originalAddress : undefined,
      translation_method: nameTranslated || addrTranslated ? 'Gemini 2.5 Flash' : undefined
    };

    const { data: record, error } = await supabaseAdmin
      .from('source_records')
      .insert({
        id: recordId,
        entity_name,
        department,
        source_id: source_id || `EXT-${Date.now()}`,
        pan: pan || null,
        gstin: gstin || null,
        address: address || null,
        resolved: false,
        raw_data: updatedRawData
      })
      .select('*')
      .single();

    if (error) {
      console.error('Database ingestion error:', error);
      return NextResponse.json({ error: `Database insertion failed: ${error.message}` }, { status: 500 });
    }

    // 5. Fire resolution engine asynchronously in the background
    processRecord(recordId).catch(err => {
      console.error(`Error in background resolution for record ${recordId}:`, err);
    });

    return NextResponse.json({
      success: true,
      message: 'Source record ingested successfully. Entity resolution queued.',
      record_id: recordId,
      status: 'queued',
      normalized_record: {
        entity_name,
        address,
        pincode,
        pan,
        gstin
      }
    }, { status: 201 });

  } catch (err: any) {
    console.error('Ingestion API Error:', err);
    return NextResponse.json({ error: err.message || 'Invalid request body' }, { status: 400 });
  }
}
