require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

async function audit() {
  console.log("\n🛰️ Latest Businesses (Sorted by ID):");
  const { data: latest } = await supabase
    .from('businesses')
    .select('primary_name, ubid, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (latest) {
    latest.forEach(b => console.log(`- ${b.primary_name} (${b.ubid}) [${b.created_at}]`));
  }

  console.log("\n📂 Unresolved Source Records:");
  const { data: unresolved } = await supabase
    .from('source_records')
    .select('entity_name, department')
    .eq('resolved', false);

  if (unresolved) {
    console.log(`Count: ${unresolved.length}`);
    unresolved.slice(0, 5).forEach(r => console.log(`- ${r.entity_name} (${r.department})`));
  }
}

audit();
