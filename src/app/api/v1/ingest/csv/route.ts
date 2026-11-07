import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processRecord } from '@/utils/engine';
import { translateKannadaToEnglish } from '@/utils/gemini';
import { hasKannada } from '@/utils/normalize';
import { parse } from 'csv-parse/sync';

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

    // 2. Extract CSV content
    let csvContent = '';
    let department = 'External_Upload';
    let columnMapping: Record<string, string> = {};

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
      csvContent = await file.text();
      
      const deptParam = formData.get('department') as string;
      if (deptParam) department = deptParam;
      
      const mappingParam = formData.get('mapping') as string;
      if (mappingParam) {
        try {
          columnMapping = JSON.parse(mappingParam);
        } catch (_) {}
      }
    } else {
      // Expect raw CSV text in body
      csvContent = await request.text();
    }

    if (!csvContent.trim()) {
      return NextResponse.json({ error: 'CSV content is empty' }, { status: 400 });
    }

    // 3. Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    if (records.length === 0) {
      return NextResponse.json({ error: 'No records found in CSV' }, { status: 400 });
    }

    // 4. Batch Process Rows
    const results = [];
    let autoMergedCount = 0;
    let triageCount = 0;
    let newEntityCount = 0;
    let totalKannadaTranslated = 0;

    // To prevent API timeouts in a live demo, we'll limit the max records in a single batch to 50
    const limit = Math.min(records.length, 50);
    
    for (let i = 0; i < limit; i++) {
      const row = records[i];
      
      // Apply column mapping if provided
      let entity_name = row[columnMapping.entity_name || 'entity_name'] || row['name'] || row['Name'] || row['business_name'] || '';
      let address = row[columnMapping.address || 'address'] || row['address'] || row['Address'] || row['location'] || '';
      let pincode = row[columnMapping.pincode || 'pincode'] || row['pincode'] || row['Pincode'] || row['pin'] || '';
      let pan = row[columnMapping.pan || 'pan'] || row['pan'] || row['PAN'] || '';
      let gstin = row[columnMapping.gstin || 'gstin'] || row['gstin'] || row['GSTIN'] || '';
      let source_id = row[columnMapping.source_id || 'source_id'] || row['id'] || row['ID'] || `CSV-${i}-${Date.now()}`;

      if (!entity_name) continue;

      const originalName = entity_name;
      const originalAddress = address;

      // Translate Kannada if found
      let nameTranslated = false;
      let addrTranslated = false;

      if (hasKannada(entity_name)) {
        entity_name = await translateKannadaToEnglish(entity_name);
        nameTranslated = true;
        totalKannadaTranslated++;
      }
      if (address && hasKannada(address)) {
        address = await translateKannadaToEnglish(address);
        addrTranslated = true;
      }

      // Insert record
      const recordId = crypto.randomUUID();
      const updatedRawData = {
        ...row,
        pincode: pincode || undefined,
        original_kannada_name: nameTranslated ? originalName : undefined,
        original_kannada_address: addrTranslated ? originalAddress : undefined,
        translation_method: nameTranslated || addrTranslated ? 'Gemini 2.5 Flash' : undefined
      };

      const { error: dbError } = await supabaseAdmin
        .from('source_records')
        .insert({
          id: recordId,
          entity_name,
          department,
          source_id,
          pan: pan || null,
          gstin: gstin || null,
          address: address || null,
          resolved: false,
          raw_data: updatedRawData
        });

      if (dbError) {
        console.error(`Error inserting row ${i}:`, dbError);
        continue;
      }

      // Run entity resolution (await it to gather metrics)
      try {
        const resolution = await processRecord(recordId);
        if (resolution.status === 'resolved') autoMergedCount++;
        else if (resolution.status === 'triage') triageCount++;
        else if (resolution.status === 'new_entity') newEntityCount++;
        
        results.push({
          row_index: i,
          entity_name,
          record_id: recordId,
          status: resolution.status,
          score: resolution.score,
          verdict: resolution.verdict
        });
      } catch (err: any) {
        results.push({
          row_index: i,
          entity_name,
          record_id: recordId,
          status: 'error',
          error: err.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      skipped: records.length - results.length,
      metrics: {
        total_ingested: results.length,
        kannada_translated: totalKannadaTranslated,
        auto_merged: autoMergedCount,
        sent_to_triage: triageCount,
        new_entities: newEntityCount
      },
      results
    });

  } catch (err: any) {
    console.error('CSV Ingestion API Error:', err);
    return NextResponse.json({ error: err.message || 'Invalid request body' }, { status: 400 });
  }
}
