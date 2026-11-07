import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SURNAMES = ["Gowda", "Shetty", "Murthy", "Rao", "Singh", "Gupta", "Agarwal", "Iyer", "Menon", "Patil", "Deshmukh", "Reddy", "Naidu", "Chauhan", "Mehta", "Shah", "Kulkarni", "Joshi", "Bose", "Chatterjee"];
const SUFFIXES = ["Enterprises", "Traders", "Solutions", "Industries", "Logistics", "Ventures", "Agro", "Infratech", "Digital", "Systems", "Manufacturing", "Textiles", "Associates", "Group", "Agency", "Works", "Corporation", "Engineering", "Consultancy", "Global"];
const SECTORS = ["Manufacturing", "Services", "Retail", "Wholesale", "Agro-Processing", "IT Services", "Logistics", "Textiles", "Construction", "Food & Beverage"];
const AREAS = ["Peenya", "BTM Layout", "Yeshwanthpur", "Whitefield", "Electronic City", "Rajajinagar", "Jayanagar", "Koramangala", "Indiranagar", "Malleshwaram", "Bommasandra", "HSR Layout"];

const genPAN = () => `ABCDE${Math.floor(1000 + Math.random() * 9000)}F`;
const genGSTIN = (pan: string) => `29${pan}1Z5`;
const DEPARTMENTS = ["Factories_&_Boilers", "Labour_Department", "Shops_&_Establishments", "Commercial_Taxes"];

const KANNADA_TRANSLATION_MAP: Record<string, string> = {
  "Gowda": "ಗೌಡ",
  "Shetty": "ಶೆಟ್ಟಿ",
  "Murthy": "ಮೂರ್ತಿ",
  "Rao": "ರಾವ್",
  "Singh": "ಸಿಂಗ್",
  "Gupta": "ಗುಪ್ತಾ",
  "Agarwal": "ಅಗರ್ವಾಲ್",
  "Iyer": "ಅಯ್ಯರ್",
  "Menon": "ಮೆನನ್",
  "Patil": "ಪಾಟೀಲ್",
  "Deshmukh": "ದೇಶ್‌ಮುಖ್",
  "Reddy": "ರೆಡ್ಡಿ",
  "Naidu": "ನಾಯ್ಡು",
  "Chauhan": "ಚೌಹಾಣ್",
  "Mehta": "ಮೆಹ್ತಾ",
  "Shah": "ಶಾ",
  "Kulkarni": "ಕುಲಕರ್ಣಿ",
  "Joshi": "ಜೋಶಿ",
  "Bose": "ಬೋಸ್",
  "Chatterjee": "ಚಟರ್ಜಿ",
  "Enterprises": "ಎಂಟರ್‌ಪ್ರೈಸಸ್",
  "Traders": "ಟ್ರೇಡರ್ಸ್",
  "Solutions": "ಸೊಲ್ಯೂಷನ್ಸ್",
  "Industries": "ಇಂಡಸ್ಟ್ರೀಸ್",
  "Logistics": "ಲಾಜಿಸ್ಟಿಕ್ಸ್",
  "Ventures": "ವೆಂಚರ್ಸ್",
  "Agro": "ಆಗ್ರೋ",
  "Infratech": "ಇನ್ಫ್ರಾಟೆಕ್",
  "Digital": "ಡಿಜಿಟಲ್",
  "Systems": "ಸಿಸ್ಟಮ್ಸ್",
  "Manufacturing": "ಮ್ಯಾನುಫ್ಯಾಕ್ಚರಿಂಗ್",
  "Textiles": "ಟೆಕ್ಸ್‌ಟೈಲ್ಸ್",
  "Associates": "ಅಸೋಸಿಯೇಟ್ಸ್",
  "Group": "ಗ್ರೂಪ್",
  "Agency": "ಏಜೆನ್ಸಿ",
  "Works": "ವರ್ಕ್ಸ್",
  "Corporation": "ಕಾರ್ಪೊರೇಷನ್",
  "Engineering": "ಇಂಜಿನಿಯರಿಂಗ್",
  "Consultancy": "ಕನ್ಸಲ್ಟೆನ್ಸಿ",
  "Global": "ಗ್ಲೋಬಲ್",
  "Peenya": "ಪೀಣ್ಯ",
  "BTM Layout": "ಬಿಟಿಎಂ ಲೇಔಟ್",
  "Yeshwanthpur": "ಯಶವಂತಪುರ",
  "Whitefield": "ವೈಟ್‌ಫೀಲ್ಡ್",
  "Electronic City": "ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ",
  "Rajajinagar": "ರಾಜಾಜಿನಗರ",
  "Jayanagar": "ಜಯನಗರ",
  "Koramangala": "ಕೋರಮಂಗಲ",
  "Indiranagar": "ಇಂದಿರಾನಗರ",
  "Malleshwaram": "ಮಲ್ಲೇಶ್ವರಂ",
  "Bommasandra": "ಬೊಮ್ಮಸಂದ್ರ",
  "HSR Layout": "ಎಚ್‌ಎಸ್‌ಆರ್ ಲೇಔಟ್",
  "Bangalore": "ಬೆಂಗಳೂರು",
  "Bengaluru": "ಬೆಂಗಳೂರು",
  "& Sons": "ಮತ್ತು ಪುತ್ರರು",
  "&": "ಮತ್ತು",
  "and": "ಮತ್ತು",
  "Sons": "ಪುತ್ರರು",
  "Pvt Ltd": "ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್",
  "Pvt": "ಪ್ರೈವೇಟ್",
  "Ltd": "ಲಿಮಿಟೆಡ್"
};

function translateToKannadaOffline(text: string): string {
  let result = text;
  Object.entries(KANNADA_TRANSLATION_MAP).forEach(([eng, kan]) => {
    const regex = new RegExp(`\\b${eng}\\b`, 'gi');
    result = result.replace(regex, kan);
  });
  return result;
}

function sparseMask(text: string): string {
  return text.split(' ').map(word => {
    if (word.length <= 2) return word;
    return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
  }).join(' ');
}

async function seedData() {
  console.log("🧹 Performing forensic wipe for high-quality demo data...");
  
  await supabase.from('businesses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('source_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('resolution_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('activity_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('system_logs').delete().neq('stage', 'PIN_CONFIG');
  const { data: pinCfg } = await supabase.from('system_logs').select('id').eq('stage', 'PIN_CONFIG').limit(1);
  if (!pinCfg || pinCfg.length === 0) {
    await supabase.from('system_logs').insert({ stage: 'PIN_CONFIG', message: 'Chess@ble', severity: 'info' });
  }

  console.log("🌱 Generating 100 UNIQUE realistic business identities...");
  
  const goldenSeeds = [];
  const usedNames = new Set();

  while (goldenSeeds.length < 100) {
    const surname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    const area = AREAS[Math.floor(Math.random() * AREAS.length)];
    const sector = SECTORS[Math.floor(Math.random() * SECTORS.length)];
    
    // Create variety: "Surname & Sons Suffix", "Surname Suffix", "Area Surname Suffix"
    let name = "";
    const rand = Math.random();
    if (rand < 0.3) name = `${surname} & Sons ${suffix}`;
    else if (rand < 0.6) name = `${surname} ${suffix}`;
    else name = `${area} ${suffix}`;

    if (!usedNames.has(name)) {
      usedNames.add(name);
      const pan = genPAN();
      goldenSeeds.push({
        id: randomUUID(),
        name,
        pan,
        gstin: genGSTIN(pan),
        address: `${Math.floor(Math.random() * 500)} / ${Math.floor(Math.random() * 50)}, ${area}, Bangalore`,
        pincode: `5600${Math.floor(10 + Math.random() * 80)}`,
        sector
      });
    }
  }

  console.log("🧩 Shattering into 300 unique Government source fragments...");
  
  const sourceRecords = [];
  const activityEvents = [];

  for (const seed of goldenSeeds) {
    const fragmentCount = 3;
    // Determine if this seed should generate a Kannada fragment (approx ~30% of seeds)
    const shouldBeKannada = (seed.pan.charCodeAt(5) % 3 === 0);

    for (let f = 0; f < fragmentCount; f++) {
      const dept = DEPARTMENTS[f % DEPARTMENTS.length];
      let entityName = seed.name;
      
      // Apply forensic variations (Simulating data entry errors/abbreviations)
      if (f === 1) entityName = entityName.toUpperCase();
      if (f === 2) {
        entityName = entityName
          .replace("Enterprises", "Entp")
          .replace("Solutions", "Sol")
          .replace("Industries", "Ind")
          .replace("Logistics", "Log")
          .replace("Systems", "Sys")
          .replace("Corporation", "Corp")
          .replace("Manufacturing", "Mfg")
          .replace("Consultancy", "Cons")
          .replace(" & Sons ", " & S ");
      }
      
      let addressVal = seed.address + (f === 1 ? `, ${seed.pincode}` : "");

      // Translate third fragment (f === 2) to Kannada if matched
      if (shouldBeKannada && f === 2) {
        entityName = translateToKannadaOffline(entityName);
        addressVal = translateToKannadaOffline(addressVal);
      }

      const recordId = randomUUID();
      sourceRecords.push({
        id: recordId,
        entity_name: entityName,
        department: dept,
        source_id: `SRC-${f}-${seed.pan || 'NA'}`,
        pan: f === 0 ? seed.pan : (Math.random() > 0.4 ? seed.pan : null),
        gstin: f === 0 ? seed.gstin : (Math.random() > 0.4 ? seed.gstin : null),
        address: addressVal,
        resolved: false,
        raw_data: {
          original_name: seed.name,
          masked_name: sparseMask(seed.name),
          pan: seed.pan,
          gstin: seed.gstin,
          address: seed.address,
          pincode: seed.pincode,
          sector: seed.sector,
          language: shouldBeKannada && f === 2 ? 'Kannada' : 'English'
        }
      });

      activityEvents.push({
        source_record_id: recordId,
        event_type: f === 0 ? "REGISTRATION" : (f === 1 ? "TAX_FILING" : "AUDIT_RENEWAL"),
        event_date: new Date(Date.now() - Math.random() * 20000000000).toISOString(),
        department: dept,
        metadata: { pan: seed.pan, amount: Math.floor(Math.random() * 100000) }
      });
    }
  }

  console.log(`🚀 Injecting ${sourceRecords.length} fragments into the resolution node...`);
  
  for (let i = 0; i < sourceRecords.length; i += 50) {
    await supabase.from('source_records').insert(sourceRecords.slice(i, i + 50));
  }

  for (let i = 0; i < activityEvents.length; i += 50) {
    await supabase.from('activity_events').insert(activityEvents.slice(i, i + 50));
  }

  console.log("✅ High-Quality Seeding Complete. 100 Unique Identities | 300 Forensic Fragments.");
}

seedData().catch(console.error);
