import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Realistic Karnataka Business Name Components
const prefixes = ["Sri", "Namma", "Karnataka", "Royal", "Global", "Tech", "Mysuru", "Bengaluru", "Kaveri", "Deccan", "Vijaya", "Bharat", "Silicon", "Karunadu", "Hoysala", "Ganga", "Southern", "Apex", "Prime", "Elite"];
const middles = ["Innovations", "Enterprises", "Industries", "Traders", "Software", "Textiles", "Exports", "Solutions", "Ventures", "Technologies", "Services", "Manufacturing", "Builders", "Logistics", "Farms", "Agro", "Plastics", "Electronics", "Consulting", "Motors"];
const suffixes = ["Pvt Ltd", "Limited", "LLP", "Co.", "Agency", "Group", "Corporation", "Inc.", "Partners", "Associates"];
const departments = ["GST", "Factories", "Labour", "Shops_Establishment", "Pollution_Control"];
const cities = ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Dharwad", "Tumakuru", "Shivamogga", "Ballari", "Kalaburagi"];

// Helper to generate a random PAN
function generatePAN() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  let pan = '';
  for (let i = 0; i < 5; i++) pan += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 4; i++) pan += nums.charAt(Math.floor(Math.random() * nums.length));
  pan += chars.charAt(Math.floor(Math.random() * chars.length));
  return pan;
}

// Helper to generate a random GSTIN from a PAN
function generateGSTIN(pan) {
  return `29${pan}1Z${Math.floor(Math.random() * 9) + 1}`;
}

// Generate the 50 Master Businesses
function generateMasterBusinesses(count) {
  const businesses = [];
  for (let i = 1; i <= count; i++) {
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const m = middles[Math.floor(Math.random() * middles.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = `${p} ${m} ${s}`;
    const pan = generatePAN();

    businesses.push({
      ubid: `KA-UBID-${10000 + i}`,
      pan: pan,
      gstin: Math.random() > 0.2 ? generateGSTIN(pan) : null, // 20% won't have GSTIN
      primary_name: name,
      normalized_name: name.toUpperCase(),
      registered_address: `Industrial Area, ${cities[Math.floor(Math.random() * cities.length)]}, Karnataka`,
      activity_status: Math.random() > 0.1 ? 'active' : 'dormant'
    });
  }
  return businesses;
}

// Generate messy source records
function generateSourceRecords(masterBusinesses) {
  const sources = [];
  const resolutionEvents = [];

  masterBusinesses.forEach((biz, index) => {
    // 1. A clean exact match from one department
    sources.push({
      business_id: biz.id, // Will be linked
      department: departments[Math.floor(Math.random() * departments.length)],
      source_id: `SRC-${Math.floor(Math.random() * 90000) + 10000}`,
      entity_name: biz.primary_name,
      pan: biz.pan,
      gstin: biz.gstin,
      raw_data: { address: biz.registered_address }
    });

    // 2. A messy match (typos, maybe missing PAN) - only for some to populate the review queue
    if (index < 30) { // Force the first 30 to have messy records
      const isMissingPan = Math.random() > 0.5;

      // Deliberately introduce a typo (e.g., lowercase, missing spaces, misspelled)
      const typoName = biz.primary_name.replace('a', 'e').replace('o', 'u').toLowerCase();

      sources.push({
        business_id: null, // Left null to simulate "pending resolution"
        department: departments[Math.floor(Math.random() * departments.length)],
        source_id: `SRC-MESSY-${Math.floor(Math.random() * 90000)}`,
        entity_name: typoName,
        pan: Math.random() > 0.2 ? biz.pan : null, // Only 20% missing PAN
        gstin: Math.random() > 0.4 ? biz.gstin : null, // 60% will have GSTIN for better matching demo
        raw_data: { address: biz.registered_address.replace('Karnataka', 'KA') }
      });
    }
  });

  return { sources };
}

async function clearTables() {
  console.log("🧹 Clearing existing data...");
  const { error: err1 } = await supabase.from('resolution_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: err2 } = await supabase.from('source_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: err3 } = await supabase.from('businesses').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  if (err1 || err2 || err3) console.error("Error clearing tables:", err1 || err2 || err3);
}

async function seed() {
  await clearTables();
  console.log("🌱 Starting Database Seeding (100 Businesses)...");

  // Generate 100 unique Master Businesses
  const rawMasters = generateMasterBusinesses(100);

  // 1. Insert Master Businesses
  const { data: businesses, error: bizError } = await supabase
    .from('businesses')
    .insert(rawMasters)
    .select();

  if (bizError) {
    console.error("Error inserting businesses:", bizError);
    return;
  }
  console.log(`✅ Inserted ${businesses.length} Master Businesses`);

  // 2. Generate and Insert Source Records
  const { sources } = generateSourceRecords(businesses);

  const { data: insertedSources, error: sourceError } = await supabase
    .from('source_records')
    .insert(sources)
    .select();

  if (sourceError) {
    console.error("Error inserting source records:", sourceError);
    return;
  }
  console.log(`✅ Inserted ${insertedSources.length} Source Records from various departments`);

  // 3. Create Pending Resolution Events for the "Messy" records
  const pendingSources = insertedSources.filter(s => s.business_id === null);
  const resolutionEvents = pendingSources.map(source => {
    // Find the original business it was supposed to match to create a realistic event
    // In our generator, the messy records are created sequentially for the first 30 businesses
    const targetBiz = businesses.find(b => source.entity_name.includes(b.primary_name.split(' ')[0].replace('a', 'e').toLowerCase()));

    return {
      source_record_id: source.id,
      potential_business_id: targetBiz ? targetBiz.id : businesses[0].id,
      match_score: (Math.random() * (0.85 - 0.55) + 0.55).toFixed(2), // Score between 55% and 85%
      status: 'pending',
      ai_reasoning: 'Fuzzy match detected high similarity in entity name, but PAN/GSTIN inconsistencies require manual verification.'
    };
  });

  const { error: resError } = await supabase
    .from('resolution_events')
    .insert(resolutionEvents);

  if (resError) {
    console.error("Error inserting resolution events:", resError);
    return;
  }
  console.log(`✅ Inserted ${resolutionEvents.length} Pending Resolution Events for the Human Review Queue`);

  console.log("🎉 Seeding Complete! Huge dataset is ready for the Hackathon Demo.");
}

seed();
