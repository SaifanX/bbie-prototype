import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const eventTypes = [
  { type: 'gst_filing', departments: ['GST_NETWORK'] },
  { type: 'inspection', departments: ['POLLUTION_BOARD', 'LABOUR_MINISTRY', 'FACTORIES'] },
  { type: 'renewal', departments: ['SHOPS_ESTABLISHMENT', 'TRADE_LICENSE'] },
  { type: 'utility_usage', departments: ['BESCOM', 'BWSSB'] }
];

async function seedEvents() {
  console.log("🌱 Seeding Activity Events...");

  const { data: businesses, error: bizError } = await supabase
    .from('businesses')
    .select('id, primary_name');

  if (bizError) {
    console.error("Error fetching businesses:", bizError);
    return;
  }

  const events = [];
  
  businesses.forEach(biz => {
    // Generate 3-8 random events per business in the last 12 months
    const numEvents = Math.floor(Math.random() * 6) + 3;
    
    for (let i = 0; i < numEvents; i++) {
      const eventInfo = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const date = new Date();
      date.setMonth(date.getMonth() - Math.floor(Math.random() * 12));
      date.setDate(date.getDate() - Math.floor(Math.random() * 28));

      events.push({
        business_id: biz.id,
        event_type: eventInfo.type,
        event_date: date.toISOString(),
        department: eventInfo.departments[Math.floor(Math.random() * eventInfo.departments.length)],
        metadata: {
          description: `Automatic activity signal detected for ${biz.primary_name}`,
          confidence: (Math.random() * 0.2 + 0.8).toFixed(2)
        }
      });
    }
  });

  const { error: eventError } = await supabase
    .from('activity_events')
    .insert(events);

  if (eventError) {
    console.error("Error inserting events:", eventError);
    return;
  }

  // Update last_activity_at for each business
  console.log("🔄 Updating business activity timestamps...");
  for (const biz of businesses) {
     const bizEvents = events.filter(e => e.business_id === biz.id);
     const lastEvent = bizEvents.sort((a, b) => new Date(b.event_date) - new Date(a.event_date))[0];
     
     await supabase
       .from('businesses')
       .update({ last_activity_at: lastEvent.event_date })
       .eq('id', biz.id);
  }

  console.log(`✅ Seeded ${events.length} activity events!`);
}

seedEvents();
