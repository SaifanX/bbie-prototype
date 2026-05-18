import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string
);

// 🏛️ THE BENGALURU MSME GOLDEN REGISTRY ANCHORS (Used only to generate messy source signals)
const MASTER_REGISTRY = [
  { name: "SLV IYENGAR BAKERY & SWEETS", address: "80 Feet Road, 4th Block, Koramangala, Bengaluru", pincode: "560034", pan: "BLRSL1234F", ubid: "UBID-KA-001", sector: "Food & Hospitality" },
  { name: "SRI MANJUNATHA UPAHARA", address: "DVG Road, Basavanagudi, Bengaluru", pincode: "560004", pan: "BLRMA5678K", ubid: "UBID-KA-002", sector: "Food & Hospitality" },
  { name: "BHYRAVESHWARA PROVISION STORE", address: "Dr. Rajkumar Road, Rajajinagar, Bengaluru", pincode: "560010", pan: "BLRBH9012P", ubid: "UBID-KA-003", sector: "Retail" },
  { name: "NANDINI MILK AGENCY & PARLOUR", address: "Sample Marg, Malleswaram, Bengaluru", pincode: "560003", pan: "BLRNA3456V", ubid: "UBID-KA-004", sector: "Retail" },
  { name: "MARUTHI MOTOR WORKS & GARAGE", address: "JC Road, Kalasipalya, Bengaluru", pincode: "560002", pan: "BLRMM0001C", ubid: "UBID-KA-005", sector: "Automotive" },
  { name: "BALAJI HARDWARE & SANITARYWARE", address: "BVK Iyengar Road, Chickpet, Bengaluru", pincode: "560053", pan: "BLRBA0002H", ubid: "UBID-KA-006", sector: "Hardware" },
  { name: "SP ROAD ELECTRONICS & CABLES", address: "Sadarpatrappa Road, City Market, Bengaluru", pincode: "560002", pan: "BLRSP0003E", ubid: "UBID-KA-007", sector: "Electronics" },
  { name: "MYSORE SAREE UDYOG", address: "Mahatma Gandhi Road, Bengaluru", pincode: "560001", pan: "BLRMY0004S", ubid: "UBID-KA-008", sector: "Textiles" },
  { name: "VENKATESHWARA GARMENTS", address: "Magadi Main Road, Kamakshipalya, Bengaluru", pincode: "560079", pan: "BLRVE0005G", ubid: "UBID-KA-009", sector: "Textiles" },
  { name: "TAAZA THINDI CONDIMENTS", address: "24th Main, Jayanagar 4th T Block, Bengaluru", pincode: "560041", pan: "BLRTA0006T", ubid: "UBID-KA-010", sector: "Food & Hospitality" }
];

// 📝 FRAGMENTED SIGNALS (Authentic Bengaluru Shop Variations)
const MESSY_RECORDS = [
  { name: "SLV IYENGAR BAKERY", address: "Koramangala 4th Blk, BLR", pincode: "560034", pan: "BLRSL1234F", dept: "Taxation" },
  { name: "S.L.V. Bakery & Sweets", address: "80ft Rd Koramangala, Bengaluru", pincode: "560034", pan: "BLRSL1234F", dept: "Udyam" },
  { name: "Sri Lakshmi Venkateshwara Bakery", address: "Koramangala, Bangalore", pincode: "560034", pan: "BLRSL1234F", dept: "FSSAI" },
  { name: "Manjunatha Tiffins", address: "DVG Rd Basavanagudi", pincode: "560004", pan: "BLRMA5678K", dept: "Labour" },
  { name: "Sri Manjunath Upahar", address: "Basavanagudi, BLR", pincode: "560004", pan: "BLRMA5678K", dept: "Municipal" },
  { name: "Bhairaveshwara General Stores", address: "Rajajinagar Dr Rajkumar Rd", pincode: "560010", pan: "BLRBH9012P", dept: "Taxation" },
  { name: "Bhyraveshwara Traders", address: "Rajajinagar, Bengaluru", pincode: "560010", pan: "BLRBH9012P", dept: "MSME" },
  { name: "Nandini Booth #42", address: "Malleswaram 8th Cross", pincode: "560003", pan: "BLRNA3456V", dept: "FSSAI" },
  { name: "KMF Nandini Parlour", address: "Malleswaram, Bangalore", pincode: "560003", pan: "BLRNA3456V", dept: "Municipal" },
  { name: "Maruti Motor Works", address: "JC Road, Bangalore", pincode: "560002", pan: "BLRMM0001C", dept: "GST" },
  { name: "Sri Maruthi Auto Works", address: "Kalasipalya JC Rd", pincode: "560002", pan: "BLRMM0001C", dept: "Labour" },
  { name: "Balaji Hardware", address: "BVK Iyengar Rd Chickpet", pincode: "560053", pan: "BLRBA0002H", dept: "Taxation" },
  { name: "Balaji Pipes & Sanitary", address: "Chickpet, Bengaluru", pincode: "560053", pan: "BLRBA0002H", dept: "TradeLicense" },
  { name: "Balaaji Hardware", address: "Chickpet Main Rd, BLR", pincode: "560053", pan: "BLRBA0002H", dept: "GST" },
  { name: "SP ROAD ELEC & CABLES", address: "Sadarpatrappa Rd, BLR", pincode: "560002", pan: "BLRSP0003E", dept: "Taxation" },
  { name: "S.P. Road Electronics", address: "City Market SP Road", pincode: "560002", pan: "BLRSP0003E", dept: "MSME" },
  { name: "MYSORE SAREE UDYOG PVT LTD", address: "MG Road, Bengaluru", pincode: "560001", pan: "BLRMY0004S", dept: "GST" },
  { name: "Mysore Silks & Sarees", address: "M.G. Road, Bangalore", pincode: "560001", pan: "BLRMY0004S", dept: "TradeLicense" },
  { name: "VENKATESHWARA GARMENTS", address: "Magadi Rd Kamakshipalya", pincode: "560079", pan: "BLRVE0005G", dept: "EPFO" },
  { name: "Sri Venkateshwara Garments", address: "Kamakshipalya, BLR", pincode: "560079", pan: "BLRVE0005G", dept: "Labour" },
  { name: "TAAZA THINDI", address: "Jayanagar 4th T Blk", pincode: "560041", pan: "BLRTA0006T", dept: "FSSAI" },
  { name: "Taaza Thindi Darshini", address: "24th Main Jayanagar, Bengaluru", pincode: "560041", pan: "BLRTA0006T", dept: "Municipal" }
];

function injectTypo(str: string): string {
  if (str.length < 5) return str;
  const chars = str.split('');
  const idx = Math.floor(Math.random() * (chars.length - 2));
  const temp = chars[idx];
  chars[idx] = chars[idx + 1];
  chars[idx + 1] = temp;
  return chars.join('');
}

function abbreviate(str: string): string {
  return str
    .replace(/Private Limited/gi, 'Pvt Ltd')
    .replace(/Limited/gi, 'Ltd')
    .replace(/Corporation/gi, 'Corp')
    .replace(/Enterprises/gi, 'Entp')
    .replace(/Solutions/gi, 'Sols')
    .replace(/Provision Store/gi, 'Prov Store')
    .replace(/Hardware/gi, 'H/W')
    .replace(/Electronics/gi, 'Elec');
}

function phoneticShift(str: string): string {
  return str
    .replace(/Shree/gi, 'Sri')
    .replace(/Sree/gi, 'Sri')
    .replace(/Enter/gi, 'Entr')
    .replace(/Bakery/gi, 'Bake')
    .replace(/Store/gi, 'Strs');
}

async function run() {
  console.log("🧹 Wiping ALL tables to establish a pristine zero-business demo starting state...");
  await supabase.from('resolution_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('activity_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('source_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('source_records_archive').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('businesses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('system_logs').delete().neq('stage', 'PIN_CONFIG');
  await supabase.from('resolution_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Ensure PIN config exists
  const { data: pinCfg } = await supabase.from('system_logs').select('id').eq('stage', 'PIN_CONFIG').limit(1);
  if (!pinCfg || pinCfg.length === 0) {
    await supabase.from('system_logs').insert({ stage: 'PIN_CONFIG', message: 'Chess@ble', severity: 'info' });
  }

  console.log("📝 Seeding Authentic Bengaluru MSME Storyline Records into source_records...");
  for (const r of MESSY_RECORDS) {
    const { error: mErr } = await supabase.from('source_records').insert({
      entity_name: r.name,
      address: r.address,
      raw_data: { pincode: r.pincode, pan: r.pan, address: r.address, gstin: `29${r.pan}1Z5` },
      pan: r.pan,
      department: r.dept,
      source_id: `SRC-${Math.floor(100000 + Math.random() * 900000)}`,
      resolved: false
    });
    if (mErr) console.error(`❌ Core Messy Insert Error (${r.name}):`, mErr);
  }

  // --- HIGH VOLUME CSV SEEDING (300+ MESSY SOURCE RECORDS ONLY) ---
  const CSV_PATH = path.join(process.cwd(), 'scratch', 'national_registry.csv');
  if (fs.existsSync(CSV_PATH)) {
    console.log("📑 Ingesting High-Volume Messy Source Signals from national_registry.csv...");
    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    // Take 95 sample records to reach 300+ source records
    const csvSample = records.slice(0, 95);
    const sourceRecordsBatch = [];

    const bangaloreLocalities = [
      'Koramangala 7th Block, Bengaluru', 'Jayanagar 9th Block, Bengaluru',
      'Malleswaram 18th Cross, Bengaluru', 'Indiranagar 100ft Road, Bengaluru',
      'Whitefield Main Road, Bengaluru', 'HSR Layout Sector 2, Bengaluru',
      'Marathahalli Outer Ring Road, Bengaluru', 'BTM Layout 2nd Stage, Bengaluru',
      'JP Nagar 5th Phase, Bengaluru', 'Rajajinagar 3rd Block, Bengaluru',
      'Basavanagudi Gandhi Bazaar, Bengaluru', 'Chickpet Main Road, Bengaluru'
    ];

    for (let i = 0; i < csvSample.length; i++) {
      const rec = csvSample[i] as any; // 🛠️ Fixed TS Error
      const baseName = rec.name || `BENGALURU ENTERPRISE ${i}`;
      const rawLocation = bangaloreLocalities[i % bangaloreLocalities.length];
      const pan = `BLR${Math.floor(10000 + Math.random() * 90000)}X`;
      const pincode = `5600${Math.floor(10 + Math.random() * 89)}`;

      const messy1 = abbreviate(baseName);
      const messy2 = injectTypo(messy1);
      const messy3 = phoneticShift(baseName);
      const depts = ['GSTN', 'MCA-21', 'Udyam', 'EPFO', 'TradeLicense', 'FSSAI', 'LabourDept'];

      sourceRecordsBatch.push({
        entity_name: messy1,
        address: rawLocation,
        raw_data: { pincode, pan, address: rawLocation, gstin: `29${pan}1Z1` },
        pan,
        department: depts[Math.floor(Math.random() * depts.length)],
        source_id: `SRC-${Math.floor(100000 + Math.random() * 900000)}`,
        resolved: false
      });

      sourceRecordsBatch.push({
        entity_name: messy2,
        address: rawLocation,
        raw_data: { pincode, pan, address: rawLocation, gstin: `29${pan}1Z1` },
        pan,
        department: depts[Math.floor(Math.random() * depts.length)],
        source_id: `SRC-${Math.floor(100000 + Math.random() * 900000)}`,
        resolved: false
      });

      sourceRecordsBatch.push({
        entity_name: messy3,
        address: rawLocation,
        raw_data: { pincode, pan, address: rawLocation, gstin: `29${pan}1Z1` },
        pan,
        department: depts[Math.floor(Math.random() * depts.length)],
        source_id: `SRC-${Math.floor(100000 + Math.random() * 900000)}`,
        resolved: false
      });
    }

    console.log(`📝 Inserting ${sourceRecordsBatch.length} CSV Messy Source Records in bulk...`);
    const { error: sErr } = await supabase.from('source_records').insert(sourceRecordsBatch);
    if (sErr) console.error("CSV Source Records Insert Error:", sErr);
  } else {
    console.warn("⚠️ national_registry.csv not found, skipping high volume expansion.");
  }

  console.log("📡 Seeding 120+ Departmental Activity Events linked to source records...");
  const { data: sourceRecs } = await supabase.from('source_records').select('id, department, entity_name').limit(120);
  
  if (sourceRecs && sourceRecs.length > 0) {
    const activityBatch = sourceRecs.map((rec: any, idx: number) => {
      const events = [
        { type: 'GST_FILING', desc: 'Monthly GST-3B return filed successfully with Commercial Taxes Dept.', dept: 'GSTN' },
        { type: 'EPFO_PAYMENT', desc: 'Monthly Provident Fund (PF) contribution remitted for 14 employees.', dept: 'EPFO' },
        { type: 'INSPECTION', desc: 'BBMP routine trade license & safety inspection completed. Status: Compliant.', dept: 'TradeLicense' },
        { type: 'LICENSE_RENEWAL', desc: 'Annual Trade License renewed with BBMP West Zone office.', dept: 'TradeLicense' },
        { type: 'FSSAI_AUDIT', desc: 'Food safety & hygiene audit conducted by State FSSAI officer. Rating: Excellent.', dept: 'FSSAI' },
        { type: 'LABOUR_FILING', desc: 'Karnataka Shops & Establishments Act annual return submitted.', dept: 'LabourDept' },
        { type: 'UDYAM_REGISTRATION', desc: 'MSME Udyam Registration certificate generated successfully.', dept: 'Udyam' },
        { type: 'TAX_DEDUCTION', desc: 'Professional Tax (PT) monthly deduction remitted to State Treasury.', dept: 'Taxation' }
      ];

      const ev = events[idx % events.length];
      const daysAgo = Math.floor(Math.random() * 360); // Random date within the last 12 months
      const eventDate = new Date(Date.now() - daysAgo * 86400000).toISOString();

      return {
        event_type: ev.type,
        department: rec.department || ev.dept,
        event_date: eventDate,
        metadata: { description: ev.desc, verified_by: `Officer #${Math.floor(100 + Math.random() * 900)}`, entity: rec.entity_name },
        source_record_id: rec.id,
        business_id: null
      };
    });

    console.log(`📡 Inserting ${activityBatch.length} Activity Events in bulk...`);
    const { error: aErr } = await supabase.from('activity_events').insert(activityBatch);
    if (aErr) console.error("Activity Events Insert Error:", aErr);
  }

  console.log("⭐ BHARAT BUSINESS INTELLIGENCE ENGINE: Pristine Bengaluru MSME Demo Seeding Complete!");
  console.log("📊 Starting State: 0 Businesses | 300+ Messy Source Records | 120+ Activity Events");
  console.log("🚀 Ready for Live Resolution Demo Flow in front of the Mentor Judges!");
}

run();
