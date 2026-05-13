export {};
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MASTER_REGISTRY = [
  { name: "KARNATAKA CONSULTING LIMITED", address: "42, 4th Block, Koramangala, Bengaluru", ubid: "UBID-KA-001" },
  { name: "CAUVERY SOFTWARE PRIVATE LIMITED", address: "100 Feet Road, Indiranagar, Bengaluru", ubid: "UBID-KA-002" },
  { name: "SILICON ELECTRONICS PVT LTD", address: "Electronic City Phase 1, Bengaluru", ubid: "UBID-KA-003" }
];

const MESSY_RECORDS = [
  { name: "KERUNADU CUNSULTING LIMITED", source: "GST", dept: "Taxation" },
  { name: "CAUVERY SOFT PVT LTD", source: "MCA", dept: "Registrar" },
  { name: "silicon-electronics-pvt-ltd", source: "PF", dept: "Labour" },
  { name: "Karnatake Consulting", source: "MSME", dept: "Udyam" },
  { name: "Cauvery Software (India) Limited", source: "Factories", dept: "Safety" }
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
    const denseString = `${b.name} | ${b.address}`;
    const embedding = await generateEmbedding(denseString);
    await supabase.from('businesses').insert({
      primary_name: b.name,
      registered_address: b.address,
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
      source_system: r.source,
      department: r.dept,
      resolved: false
    });
  }

  console.log("📡 Seeding Deterministic Activity Events...");
  // Fetch the businesses we just created to get their real IDs
  const { data: createdBiz } = await supabase.from('businesses').select('id, ubid');
  
  if (createdBiz) {
    for (const biz of createdBiz) {
      if (biz.ubid === 'UBID-KA-001') {
        // Active: Recent filings
        await supabase.from('activity_events').insert([
          { business_id: biz.id, event_type: 'GST_FILING', event_date: new Date().toISOString(), description: 'Monthly GST-3B return filed successfully.' },
          { business_id: biz.id, event_type: 'INSPECTION', event_date: new Date(Date.now() - 30 * 86400000).toISOString(), description: 'Routine safety audit completed - No violations.' }
        ]);
      } else if (biz.ubid === 'UBID-KA-002') {
        // Dormant: One old event
        await supabase.from('activity_events').insert([
          { business_id: biz.id, event_type: 'LICENSE_RENEWAL', event_date: new Date(Date.now() - 400 * 86400000).toISOString(), description: 'Annual trade license renewal.' }
        ]);
      }
      // UBID-KA-003 stays at 0 events -> Closed
    }
  }

  console.log("⭐ Database is now PRISTINE and FORENSICALLY SOUND!");
}

run();
