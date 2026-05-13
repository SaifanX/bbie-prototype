require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MASTER_BUSINESSES = [
  { name: "KARNATAKA CONSULTING LIMITED", address: "42, 4th Block, Koramangala, Bengaluru", ubid: "UBID-KA-001" },
  { name: "CAUVERY SOFTWARE PRIVATE LIMITED", address: "100 Feet Road, Indiranagar, Bengaluru", ubid: "UBID-KA-002" },
  { name: "SILICON ELECTRONICS PVT LTD", address: "Electronic City Phase 1, Bengaluru", ubid: "UBID-KA-003" }
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

async function bootstrap() {
  console.log("🚀 Starting Master Registry Bootstrap (2026 Edition)...");

  for (const b of MASTER_BUSINESSES) {
    console.log(`📡 Generating 3072-dim embedding for: ${b.name}`);
    const embedding = await generateEmbedding(`${b.name} ${b.address}`);
    
    const { error } = await supabase.from('businesses').upsert({
      primary_name: b.name,
      registered_address: b.address,
      ubid: b.ubid,
      embedding: embedding,
      confidence_score: 1.0,
      activity_status: 'active'
    }, { onConflict: 'ubid' });

    if (error) {
      console.error(`❌ Error seeding ${b.name}:`, error);
    } else {
      console.log(`✅ Seeded: ${b.name}`);
    }
  }

  console.log("⭐ Bootstrap Complete!");
}

bootstrap();
