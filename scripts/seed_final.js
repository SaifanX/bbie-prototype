import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const prefixes = ["Sri", "Namma", "Karnataka", "Royal", "Global", "Mysuru", "Bengaluru", "Kaveri", "Deccan", "Vijaya", "Bharat", "Silicon", "Karunadu", "Hoysala", "Ganga", "Southern", "Apex", "Prime", "Elite"];
const middles = ["Innovations", "Enterprises", "Industries", "Traders", "Software", "Textiles", "Exports", "Solutions", "Ventures", "Technologies", "Services", "Manufacturing", "Builders", "Logistics", "Farms", "Agro", "Plastics", "Electronics", "Consulting", "Motors"];
const suffixes = ["Pvt Ltd", "Limited", "LLP", "Co.", "Agency", "Group", "Corporation", "Inc.", "Partners", "Associates"];
const departments = ["GST", "Factories", "Labour", "Shops_Establishment", "Pollution_Control"];
const cities = ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Dharwad", "Tumakuru", "Shivamogga", "Ballari", "Kalaburagi"];

function generatePAN() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  let pan = '';
  for (let i = 0; i < 5; i++) pan += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 4; i++) pan += nums.charAt(Math.floor(Math.random() * nums.length));
  pan += chars.charAt(Math.floor(Math.random() * chars.length));
  return pan;
}

function generateGSTIN(pan) {
  return `29${pan}1Z${Math.floor(Math.random() * 9) + 1}`;
}

async function seedFinal() {
  console.log("🧹 Resetting Database for Final Demo...");
  await supabase.from('resolution_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('activity_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('source_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('businesses').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("🌱 Seeding 40 Realistic Bharat Businesses...");
  const businesses = [];
  for (let i = 0; i < 40; i++) {
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const m = middles[Math.floor(Math.random() * middles.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = `${p} ${m} ${s}`;
    const pan = generatePAN();
    
    businesses.push({
      ubid: `KA-UBID-${10000 + i}`,
      pan: pan,
      gstin: generateGSTIN(pan),
      primary_name: name,
      normalized_name: name.toUpperCase(),
      registered_address: `Industrial Area, ${cities[Math.floor(Math.random() * cities.length)]}, KA`,
      activity_status: 'active',
      confidence_score: 1.0,
      last_activity_at: new Date().toISOString()
    });
  }
  const { data: insertedBiz, error: bizError } = await supabase.from('businesses').insert(businesses).select();
  if (bizError) console.error(bizError);

  console.log("🌱 Seeding 60 Messy Source Records (Fragmentation Story)...");
  const sourceRecords = [];
  for (let i = 0; i < 60; i++) {
    if (i < 30) {
      // 30 records that match the clean businesses (typos, case sensitivity, missing spaces)
      const targetBiz = insertedBiz[i % 40];
      const messyName = targetBiz.primary_name.toLowerCase().replace(/\s/g, '');
      sourceRecords.push({
        department: departments[i % departments.length],
        source_id: `SRC-${2000 + i}`,
        entity_name: messyName,
        pan: Math.random() > 0.3 ? targetBiz.pan : null,
        raw_data: { address: targetBiz.registered_address.replace('Karnataka', 'KA') }
      });
    } else {
      // 30 completely new records (Small Kirana shops/local enterprises)
      const p = prefixes[Math.floor(Math.random() * prefixes.length)];
      const m = middles[Math.floor(Math.random() * middles.length)];
      sourceRecords.push({
        department: departments[i % departments.length],
        source_id: `SRC-NEW-${3000 + i}`,
        entity_name: `${p} ${m} Enterprise`,
        pan: generatePAN(),
        raw_data: { address: `${cities[Math.floor(Math.random() * cities.length)]}, Karnataka` }
      });
    }
  }
  const { data: insertedRecords, error: recordError } = await supabase.from('source_records').insert(sourceRecords).select();
  if (recordError) console.error(recordError);

  console.log("🌱 Seeding 5 Resolution Events (Human Review Queue)...");
  const resolutionEvents = [];
  for (let i = 0; i < 5; i++) {
    resolutionEvents.push({
      source_record_id: insertedRecords[i].id,
      potential_business_id: insertedBiz[i].id,
      match_score: 0.65 + (i * 0.04),
      status: 'pending',
      ai_reasoning: "Phonetic similarity is 92%, but PAN is missing in the source department record. Requires human verification."
    });
  }
  await supabase.from('resolution_events').insert(resolutionEvents);

  console.log("🌱 Seeding Activity Signal Stream...");
  const activityEvents = [];
  insertedBiz.forEach(biz => {
    const numEvents = Math.floor(Math.random() * 8) + 4;
    for (let j = 0; j < numEvents; j++) {
      const date = new Date();
      date.setMonth(date.getMonth() - Math.floor(Math.random() * 12));
      activityEvents.push({
        business_id: biz.id,
        event_type: 'GST_PAYMENT',
        event_date: date.toISOString(),
        department: 'GST_NETWORK',
        metadata: { amount: Math.floor(Math.random() * 50000), status: 'SUCCESS' }
      });
    }
  });
  await supabase.from('activity_events').insert(activityEvents);

  console.log("✅ REALISTIC BHARAT SEEDING COMPLETE!");
}

seedFinal();
