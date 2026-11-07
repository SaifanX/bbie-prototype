import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const baseUrl = "http://localhost:3001/api/v1";

async function verifyAll() {
  console.log("🔍 TESTING KANNADA SUPPORT AND INGESTION APIS...");

  // Let's first test the resolve API with a Kannada query
  console.log("\n--- TEST 1: POST /api/v1/resolve with Kannada Entity Name ---");
  const testName = "ಕೃಷ್ಣ ಲಾಜಿಸ್ಟಿಕ್ಸ್"; // Krishna Logistics
  
  try {
    const res = await fetch(`${baseUrl}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entity_name: testName,
        pincode: "560058",
        sovereignty_mask: true
      })
    });
    
    const resText = await res.text();
    console.log("Resolve API HTTP Status Code:", res.status);
    let data;
    try {
      data = JSON.parse(resText);
    } catch (e) {
      console.log("Raw Response Text (first 2000 chars):", resText.substring(0, 2000));
      throw e;
    }
    console.log("Results count:", data.results?.length);
    if (data.results && data.results.length > 0) {
      console.log("Top Match UBID:", data.results[0].ubid);
      console.log("Top Match Name (Masked):", data.results[0].business.name);
      console.log("Score:", data.results[0].score);
      console.log("Reasoning:", data.results[0].reasoning);
    } else {
      console.log("No match found for", testName);
    }
  } catch (err: any) {
    console.error("Test 1 failed:", err.message);
  }

  // Next, test POST /api/v1/ingest (REST Ingestion)
  console.log("\n--- TEST 2: POST /api/v1/ingest (REST Single Record Ingest) ---");
  try {
    const ingestRes = await fetch(`${baseUrl}/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bbie-token': 'sb_publishable_wN_PGCGaXcCnWGrqzrPjmg_xpnOD0iw' // using publishable key as token since route checks x-bbie-token
      },
      body: JSON.stringify({
        entity_name: "ಶೆಟ್ಟಿ ಎಂಟರ್‌ಪ್ರೈಸಸ್", // Shetty Enterprises
        department: "Factories_&_Boilers",
        source_id: `TEST-INGEST-${Date.now()}`,
        pan: "ABCDE9999F",
        address: "ಪೀಣ್ಯ ಇಂಡಸ್ಟ್ರಿಯಲ್ ಏರಿಯಾ",
        pincode: "560058"
      })
    });
    
    const ingestResText = await ingestRes.text();
    let ingestData;
    try {
      ingestData = JSON.parse(ingestResText);
    } catch (e) {
      console.log("Raw Response Text (first 200 chars):", ingestResText.substring(0, 200));
      throw e;
    }
    console.log("Ingest response status:", ingestRes.status);
    console.log("Ingest response data:", JSON.stringify(ingestData, null, 2));
  } catch (err: any) {
    console.error("Test 2 failed:", err.message);
  }

  // Next, test POST /api/v1/ingest/csv (CSV Batch Ingestion)
  console.log("\n--- TEST 3: POST /api/v1/ingest/csv (CSV Ingestion) ---");
  const dummyCsv = `Name,Address,Pincode,PAN
ಕೃಷ್ಣ ಲಾಜಿಸ್ಟಿಕ್ಸ್,ಪೀಣ್ಯ ಇಂಡಸ್ಟ್ರಿಯಲ್ ಏರಿಯಾ,560058,ABCDE1234F
ಮೂರ್ತಿ ಸಿಸ್ಟಮ್ಸ್,ಯಶವಂತಪುರ,560022,ABCDE5678F`;

  try {
    const csvRes = await fetch(`${baseUrl}/ingest/csv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'x-bbie-token': 'sb_publishable_wN_PGCGaXcCnWGrqzrPjmg_xpnOD0iw'
      },
      body: dummyCsv
    });
    
    const csvResText = await csvRes.text();
    let csvData;
    try {
      csvData = JSON.parse(csvResText);
    } catch (e) {
      console.log("Raw Response Text (first 200 chars):", csvResText.substring(0, 200));
      throw e;
    }
    console.log("CSV response status:", csvRes.status);
    console.log("CSV response data:", JSON.stringify(csvData, null, 2));
  } catch (err: any) {
    console.error("Test 3 failed:", err.message);
  }
}

verifyAll();
