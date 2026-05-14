import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// 🏛️ THE GOLDEN REGISTRY (Verified Truth)
const MASTER_REGISTRY = [
  { name: "KARNATAKA CONSULTING LIMITED", address: "42, 4th Block, Koramangala, Bengaluru", pincode: "560034", pan: "ABCDE1234F", ubid: "UBID-KA-001" },
  { name: "CAUVERY SOFTWARE PRIVATE LIMITED", address: "100 Feet Road, Indiranagar, Bengaluru", pincode: "560038", pan: "FGHIJ5678K", ubid: "UBID-KA-002" },
  { name: "SRI SAI ENTERPRISES", address: "M.G. Road, Bengaluru", pincode: "560001", pan: "KLMNO9012P", ubid: "UBID-KA-003" },
  { name: "SRI SAI ENTERPRISES", address: "Station Road, Hubli", pincode: "580020", pan: "QRSTU3456V", ubid: "UBID-KA-004" }
];

// 📝 FRAGMENTED SIGNALS (The Investigation)
const MESSY_RECORDS = [
  // KA-001: Name Typos
  { name: "KERUNADU CUNSULTING LIMITED", address: "Koramangala 4th Blk, BLR", pincode: "560034", pan: "ABCDE1234F", dept: "Taxation" },
  { name: "Karnatake Consulting", address: "Bengaluru, KA", pincode: "560034", pan: "ABCDE1234F", dept: "Udyam" },
  
  // KA-002: Address Shift
  { name: "CAUVERY SOFT PVT LTD", address: "100ft Rd, Indiranagar", pincode: "560038", pan: "FGHIJ5678K", dept: "Registrar" },
  
  // KA-003 vs KA-004: Name Collision Trap
  { name: "Sri Sai Enterprises", address: "MG Road, Bangalore", pincode: "560001", pan: "KLMNO9012P", dept: "Labour" },
  { name: "S.S. Enterprises", address: "Hubballi, Station Rd", pincode: "580020", pan: "QRSTU3456V", dept: "Safety" },
  
  // New Fragmentation: BALAJI TRADERS
  { name: "Balaji Traders", address: "Commercial Street, BLR", pincode: "560001", pan: "XYZAB1122C", dept: "Taxation" },
  { name: "Balaaji Traders", address: "Comm Street, Bengaluru", pincode: "560001", pan: "XYZAB1122C", dept: "MSME" },
  
  // Anomaly: Identifier Collision Trap
  { name: "National Trading Co", address: "Delhi Gate, New Delhi", pincode: "110002", pan: "ABCDE1234F", dept: "Trade" } // Same PAN as KA-001 but different name/city
];

async function generateEmbedding(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Embedding Error:", error);
    return new Array(3072).fill(0);
  }
}

async function run() {
  console.log("🧹 Wiping old noise...");
  await supabase.from('resolution_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('activity_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('source_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('businesses').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("✨ Seeding Golden Registry...");
  for (const b of MASTER_REGISTRY) {
    console.log(`📡 Vectorizing: ${b.name}`);
    const denseString = `${b.name} | ${b.address} | ${b.pincode}`;
    const embedding = await generateEmbedding(denseString);
    await supabase.from('businesses').insert({
      primary_name: b.name,
      registered_address: b.address,
      pincode: b.pincode,
      pan: b.pan,
      ubid: b.ubid,
      embedding: embedding,
      confidence_score: 1.0,
      activity_status: 'active'
    });
  }

  console.log("📝 Seeding Messy Source Records...");
  for (const r of MESSY_RECORDS) {
    await supabase.from('source_records').insert({
      entity_name: r.name,
      address: r.address,
      pincode: r.pincode,
      pan: r.pan,
      department: r.dept,
      resolved: false
    });
  }

  console.log("📡 Seeding Deterministic Activity Events...");
  const { data: createdBiz } = await supabase.from('businesses').select('id, ubid');
  
  if (createdBiz) {
    for (const biz of createdBiz) {
      if (biz.ubid === 'UBID-KA-001') {
        // High Activity
        await supabase.from('activity_events').insert([
          { business_id: biz.id, event_type: 'GST_FILING', event_date: new Date().toISOString(), description: 'Monthly GST-3B return filed.' },
          { business_id: biz.id, event_type: 'INSPECTION', event_date: new Date(Date.now() - 10 * 86400000).toISOString(), description: 'Clean audit report.' }
        ]);
      } else if (biz.ubid === 'UBID-KA-002') {
        // Dormancy Sequence: Last event was 14 months ago
        await supabase.from('activity_events').insert([
          { business_id: biz.id, event_type: 'LICENSE_RENEWAL', event_date: new Date(Date.now() - 420 * 86400000).toISOString(), description: 'Trade license renewed (Expired).' }
        ]);
      }
      // KA-003 and KA-004 stay at 0 events -> Flagged as potential non-compliance
    }
  }

  console.log("🧠 Seeding Historical Learning Feedback...");
  const { data: sourceRecs } = await supabase.from('source_records').select('id, entity_name');
  if (sourceRecs && createdBiz) {
    // KA-001: Human Approved the match
    await supabase.from('resolution_events').insert([
      { 
        source_id: sourceRecs[0]?.id, 
        business_id: createdBiz.find((b: any) => b.ubid === 'UBID-KA-001')?.id,
        status: 'approved',
        match_score: 0.98,
        match_type: 'IDENTIFIER',
        feedback: 'Perfect match on PAN and phonetic name.'
      },
      { 
        source_id: sourceRecs[1]?.id, 
        business_id: createdBiz.find((b: any) => b.ubid === 'UBID-KA-001')?.id,
        status: 'approved',
        match_score: 0.85,
        match_type: 'FUZZY',
        feedback: 'Address matches Koramangala 4th block.'
      },
      // Conflict Case: Human corrected the AI
      { 
        source_id: sourceRecs[6]?.id, // National Trading Co
        business_id: createdBiz.find((b: any) => b.ubid === 'UBID-KA-001')?.id,
        status: 'rejected',
        match_score: 0.92, // AI thought it was KA-001 because of PAN
        match_type: 'IDENTIFIER',
        feedback: 'PAN matches but Name and City are completely different. This is an identity theft anomaly.'
      }
    ]);
  }

  console.log("⭐ Database is now a FORENSIC BATTLEFIELD with LEARNING DATA!");
}

run();
