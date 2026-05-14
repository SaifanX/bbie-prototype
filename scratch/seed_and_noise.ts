import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// Initialize Supabase (Use service role key if available for bulk bypass RLS, otherwise anon is fine for demo)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const CSV_PATH = path.join(__dirname, 'national_registry.csv');

// --- Forensic Noise Logic ---

function injectTypo(str: string): string {
    if (str.length < 5) return str;
    const chars = str.split('');
    const idx = Math.floor(Math.random() * (chars.length - 1));
    // Swap adjacent characters
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
        .replace(/Solutions/gi, 'Sols');
}

function phoneticShift(str: string): string {
    return str
        .replace(/Shree/gi, 'Sri')
        .replace(/Sree/gi, 'Sri')
        .replace(/Enter/gi, 'Entr')
        .replace(/Technology/gi, 'Tech');
}

async function seedData() {
    console.log('🏛️ BBIE: Starting Forensic Seeding...');

    if (!fs.existsSync(CSV_PATH)) {
        console.error('❌ Error: national_registry.csv not found in scratch/');
        return;
    }

    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
    });

    console.log(`📑 Ingested ${records.length} records from Registry Anchor.`);

    // Take a sample for the demo (e.g., 50 records)
    const sample = records.slice(0, 50);

    for (const record of sample) {
        const officialName = record.name;
        const rawLocation = record.location || '';
        const primaryCity = rawLocation.split('+')[0].trim();
        const ubid = `UBID-${primaryCity.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

        console.log(`> SEEDING: ${officialName} [${ubid}]`);

        // 1. Insert into Businesses (The Gold Standard)
        const { data: business, error: bError } = await supabase
            .from('businesses')
            .upsert({
                ubid,
                name: officialName,
                address: rawLocation,
                pincode: Math.floor(110001 + Math.random() * 800000).toString(), // Random Indian Pincode
                sector: record.domain || 'General',
                status: 'active'
            })
            .select()
            .single();

        if (bError) {
            console.error(`❌ Business Insert Error: ${bError.message}`);
            continue;
        }

        // 2. Generate and Insert Messy Logs (The Noise)
        const messyName1 = abbreviate(officialName);
        const messyName2 = injectTypo(messyName1);
        const messyName3 = phoneticShift(officialName);

        const noisyVersions = [messyName1, messyName2, messyName3];

        for (const noisyName of noisyVersions) {
            if (noisyName === officialName) continue;

            const { error: lError } = await supabase
                .from('resolution_logs')
                .insert({
                    source_system: ['GSTN', 'MCA-21', 'RBI-GATEWAY'][Math.floor(Math.random() * 3)],
                    raw_payload: { name: noisyName, location: rawLocation },
                    resolved_ubid: business.id,
                    confidence_score: 0.85 + Math.random() * 0.14,
                    verdict: 'resolved',
                    forensic_audit: {
                        steps: [
                            "Ingestion: Received raw signal from departmental buffer.",
                            "Sovereignty Shield: PII tokens generated and hashed.",
                            "Vectorization: Semantic fingerprint created.",
                            "Alignment: Matched against National Registry anchor.",
                            "Issuance: Resolved to Golden UBID."
                        ]
                    }
                });

            if (lError) console.error(`❌ Log Insert Error: ${lError.message}`);
        }
    }

    console.log('✅ BBIE: Seeding and Noise Injection Complete.');
}

seedData().catch(console.error);
