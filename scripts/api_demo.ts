/**
 * BBIE API Demonstration Script
 * Use this to show the identity resolution layer in action at the hackathon.
 */

async function runDemo() {
  const baseUrl = "http://localhost:3001/api/v1";
  
  console.log("\n💎 BBIE: Bharat Business Intelligence Engine - API DEMO");
  console.log("========================================================\n");

  // 1. Identity Resolution Example
  console.log("🚀 STEP 1: Resolving a fragmented identity...");
  console.log("Query: { name: 'Mphasis Limited', pincode: '570992' }\n");

  try {
    const resolveRes = await fetch(`${baseUrl}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entity_name: "Mphasis Limited",
        pincode: "570992",
        sovereignty_mask: true
      })
    });

    const resolveData = await resolveRes.json();
    // console.log("DEBUG RESOLVE:", JSON.stringify(resolveData, null, 2));
    
    if (resolveData.results && resolveData.results.length > 0) {
      const topMatch = resolveData.results[0];
      console.log("✅ MATCH FOUND!");
      console.log(`UBID: ${topMatch.ubid}`);
      console.log(`Confidence Score: ${(topMatch.score * 100).toFixed(2)}%`);
      console.log(`Reasoning: ${topMatch.reasoning.join(", ")}`);
      console.log(`Masked Name: ${topMatch.business.name}\n`);

      // 2. Dossier Retrieval Example
      console.log(`📂 STEP 2: Retrieving full dossier for ${topMatch.ubid}...`);
      const dossierRes = await fetch(`${baseUrl}/business/${topMatch.ubid}?include_audit=true`);
      const dossierData = await dossierRes.json();

      console.log("📄 DOSSIER DATA:");
      console.log(JSON.stringify(dossierData.data, null, 2));
      console.log("\n🛡️ VERIFICATION STATUS:", dossierData.verification_status);
      
    } else {
      console.log("❌ No matching businesses found in the Registry.");
    }

  } catch (error) {
    console.error("❌ ERROR: Could not connect to the API. Make sure 'npm run dev' is running!");
  }
}

runDemo();
