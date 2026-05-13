import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const prefixes = ["Sri", "Namma", "Karnataka", "Royal", "Global", "Tech", "Mysuru", "Bengaluru", "Kaveri", "Deccan"];
const middles = ["Innovations", "Enterprises", "Industries", "Traders", "Software", "Textiles", "Exports"];
const suffixes = ["Pvt Ltd", "Limited", "LLP", "Co."];
const departments = ["GST", "Factories", "Labour", "Shops_Establishment", "Pollution_Control"];

async function prepareDemo() {
  console.log("🧹 Clearing Registry for Demo...");
  await supabase.from('resolution_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('activity_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('source_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('businesses').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("🌱 Seeding 20 Messy Source Records...");
  const sourceRecords = [];
  
  for (let i = 0; i < 20; i++) {
    const name = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${middles[Math.floor(Math.random() * middles.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    const pan = `ABCDE${Math.floor(Math.random() * 9000) + 1000}F`;
    
    // Create 2 records for the same "real" business with typos
    sourceRecords.push({
      department: departments[i % departments.length],
      source_id: `SRC-${1000 + i}`,
      entity_name: name,
      pan: pan,
      raw_data: { address: "Industrial Area, Phase 1, Bengaluru, KA" }
    });

    if (i < 10) { // Add duplicates with messy data
       sourceRecords.push({
         department: departments[(i + 1) % departments.length],
         source_id: `SRC-MESSY-${1000 + i}`,
         entity_name: name.toLowerCase().replace(' ', ''),
         pan: Math.random() > 0.3 ? pan : null, // Missing PAN for some
         raw_data: { address: "Ind. Area, Ph-1, Bangalore" }
       });
    }
  }

  const { error } = await supabase.from('source_records').insert(sourceRecords);
  if (error) console.error(error);
  
  console.log("✅ 30 Messy Source Records Prepared.");

  // 3. Seed Activity Events (Incoming Signals)
  console.log('📡 Seeding 150 activity signals...');
  const activityEvents = [];
  const eventTypes = ['TAX_FILING', 'GST_PAYMENT', 'ELECTRICITY_BILL', 'LICENCE_RENEWAL', 'ADDRESS_CHANGE'];
  const depts = ['GST_DEPARTMENT', 'MINISTRY_OF_CORPORATE_AFFAIRS', 'MUNICIPAL_CORP_REGISTRY', 'LABOUR_DEPT', 'UDYAM_MSME'];

  for (let i = 0; i < 150; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 12)); // Random activity within last year
    
    activityEvents.push({
      event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      event_date: date.toISOString(),
      department: depts[Math.floor(Math.random() * depts.length)],
      metadata: { 
        amount: Math.floor(Math.random() * 100000),
        status: 'SUCCESSFUL',
        source_id: `SIG-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
      }
    });
  }

  const { error: activityError } = await supabase
    .from('activity_events')
    .insert(activityEvents);

  if (activityError) console.error('Error seeding activity:', activityError);

  console.log('🚀 Demo Preparation Complete: Environment is primed for high-fidelity simulation.');
}

prepareDemo();
