# BBIE: Instructions to Run

To the Reviewers/Judges: This prototype is built with **Next.js 16 (App Router)** and **Supabase (PostgreSQL)**. Follow these steps to run the BBIE demo locally.

## 1. Prerequisites
- **Node.js**: v20 or higher.
- **NPM**: v10 or higher.
- **Supabase Account**: A project is required for the database and auth layer.

## 2. Environment Configuration
Create a `.env.local` file in the root directory with the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Database Setup (Migrations)
Run the SQL migrations found in the `/supabase/migrations` folder (or use the Supabase SQL Editor) to create:
- `businesses`: The Golden Record registry.
- `source_records`: Raw data from legacy systems.
- `resolution_events`: AI-suggested merges and human-review queue.
- `activity_events`: Part B event stream (GST, utility usage, etc.).

## 4. Preparing the "Judge Reveal" Demo
To demonstrate the engine's power, start with an empty registry and populate it live:

```bash
# 1. Reset the app to a "Dirty" state (0 businesses, 30 messy records)
node scripts/prepare_demo.js

# 2. (Optional) Seed Part B events for the intelligence reports
node scripts/seed_events.js
```

## 5. The Pitch Workflow
1. **Show the Problem**: Open the Dashboard. It will show **0 Businesses**. This is your starting point.
2. **The Simulator**: Go to `/simulator`. Click **"Load Raw Data"** to see the 30 messy records from legacy systems.
3. **Engage Engine**: Click **"Engage Engine"**. The first 10 records will process in **slow-motion**, showing the AI's "Reasoning" modals. This proves the logic works.
4. **The Result**: Once complete, navigate back to the **Dashboard** and **Intelligence Reports**. Show the judges how the registry is now clean, deduplicated, and showing real-time health.

## 6. Running the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the BBIE Dashboard.

---

## 🏗️ Key Navigation for Judges:
1. **Dashboard (/)**: High-level registry health and real-time processing feed.
2. **Verification Workspace (/review)**: Human-in-the-loop interface where the **Real Matching Engine** calculates confidence scores.
3. **Registry Reports (/intelligence)**: Active Intelligence dashboard showing business status (Active/Dormant/Closed) inferred from the event stream.
4. **Simulator (/simulator)**: A visual representation of how raw data is cleaned, normalized, and linked to a UBID.
