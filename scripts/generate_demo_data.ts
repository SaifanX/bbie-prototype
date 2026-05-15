import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_TEMPLATES = [
  { name: "Sri Manjunatha Provision Stores", sector: "Retail", address: "BTM Layout, Bangalore" },
  { name: "S.K. Enterprises", sector: "Manufacturing", address: "Peenya Industrial Area, Bangalore" },
  { name: "Venkateshwara Silk House", sector: "Textiles", address: "Chickpet, Bangalore" },
  { name: "Gowda & Sons Hardware", sector: "Construction", address: "Yeshwanthpur, Bangalore" },
  { name: "Basaveshwara Traders", sector: "Wholesale", address: "APMC Yard, Yeshwanthpur" },
  { name: "Anjaneya Coffee Works", sector: "Food & Beverage", address: "Malleshwaram, Bangalore" },
  { name: "Cauvery Silk Emporium", sector: "Textiles", address: "MG Road, Bangalore" },
  { name: "Lakshmi Narasimha Swamy Flour Mill", sector: "Food Processing", address: "Rajajinagar, Bangalore" },
  { name: "Shiva Shanti General Stores", sector: "Retail", address: "Jayanagar 4th Block" },
  { name: "Maruthi Automobiles", sector: "Automotive", address: "Koramangala, Bangalore" },
];

// Helper to generate realistic PAN and GSTIN
const genPAN = () => `ABCDE${Math.floor(1000 + Math.random() * 9000)}F`;
const genGSTIN = (pan: string) => `29${pan}1Z5`;

const DEPARTMENTS = ["Factories_&_Boilers", "Labour_Department", "Shops_&_Establishments", "Commercial_Taxes"];

function sparseMask(text: string): string {
  return text.split(' ').map(word => {
    if (word.length <= 2) return word;
    return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
  }).join(' ');
}

async function seedData() {
  console.log("🧹 Wiping existing data for Cold Start demo...");
  
  await supabase.from('businesses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('source_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('resolution_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('activity_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('system_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("🌱 Generating 100 Golden Seeds...");
  
  const goldenSeeds = [];
  for (let i = 0; i < 100; i++) {
    const template = SEED_TEMPLATES[i % SEED_TEMPLATES.length];
    const name = i < SEED_TEMPLATES.length ? template.name : `${template.name} #${i + 1}`;
    const pan = genPAN();
    goldenSeeds.push({
      id: randomUUID(),
      name,
      pan,
      gstin: genGSTIN(pan),
      address: template.address,
      pincode: `5600${Math.floor(10 + Math.random() * 80)}`,
      sector: template.sector
    });
  }

  console.log("🧩 Shattering into exactly 300 Source Records...");
  
  const sourceRecords = [];
  const activityEvents = [];

  for (const seed of goldenSeeds) {
    // Generate exactly 3 fragments per seed to reach 300 total
    const fragmentCount = 3;
    
    for (let f = 0; f < fragmentCount; f++) {
      const dept = DEPARTMENTS[f % DEPARTMENTS.length];
      let entityName = seed.name;
      
      // Apply "Shatter" variations
      if (f === 1) entityName = entityName.toUpperCase();
      if (f === 2) {
        entityName = entityName
          .replace("Provision Stores", "P. Stores")
          .replace("Enterprises", "Entp")
          .replace("House", "Hse")
          .replace("Hardware", "Hw")
          .replace("Traders", "Tdr")
          .replace("Works", "Wks")
          .replace("Emporium", "Emp")
          .replace("Flour Mill", "F. Mill")
          .replace("General Stores", "G. Stores")
          .replace("Automobiles", "Auto");
      }
      
      const recordId = randomUUID();
      sourceRecords.push({
        id: recordId,
        entity_name: entityName,
        department: dept,
        source_id: `SRC-${f}-${seed.pan || 'NA'}`,
        pan: f === 0 ? seed.pan : (Math.random() > 0.4 ? seed.pan : null),
        gstin: f === 0 ? seed.gstin : (Math.random() > 0.4 ? seed.gstin : null),
        address: seed.address + (f === 1 ? ", 2nd Floor" : ""),
        resolved: false,
        raw_data: {
          original_name: seed.name,
          masked_name: sparseMask(seed.name),
          pan: seed.pan,
          gstin: seed.gstin,
          address: seed.address,
          pincode: seed.pincode
        }
      });

      // Generate Activity Events for this record
      activityEvents.push({
        source_record_id: recordId,
        event_type: f === 0 ? "REGISTRATION" : (f === 1 ? "TAX_FILING" : "LICENSE_RENEWAL"),
        event_date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        department: dept,
        metadata: { pan: seed.pan, gstin: seed.gstin, amount: Math.floor(Math.random() * 50000) }
      });
    }
  }

  // Batch insert
  console.log(`🚀 Pushing ${sourceRecords.length} records to Supabase...`);
  
  for (let i = 0; i < sourceRecords.length; i += 50) {
    const { error } = await supabase.from('source_records').insert(sourceRecords.slice(i, i + 50));
    if (error) console.error("Error inserting source_records:", error);
  }

  for (let i = 0; i < activityEvents.length; i += 50) {
    const { error } = await supabase.from('activity_events').insert(activityEvents.slice(i, i + 50));
    if (error) console.error("Error inserting activity_events:", error);
  }

  console.log("✅ Seeding Complete. Dashboard is now in COLD START mode with exactly 300 fragments.");
}

seedData().catch(console.error);
