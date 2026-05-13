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
    const embedding = await generateEmbedding(`${b.name} ${b.address}`);
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

  console.log("⭐ Database is now PRISTINE and ready for demo!");
}

run();
