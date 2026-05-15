# 🛠️ BBIE: Bharat Business Intelligence Engine
### Theme 1: AI for Bharat — Unified Business Identifier (UBID) + Active Intelligence

**The National System of Record.**

BBIE is a high-trust, forensic-grade intelligence layer designed to resolve fragmented business identities across siloed government department systems. It leverages **Semantic Entity Resolution**, **Vector Similarity Search**, and **LLM-based Reasoning** to create a canonical "Golden Record" for every business in the ecosystem.

---

## 🏛️ Repository Structure

```text
bbie-prototype/
├── docs/                   # Strategic Documentation & Schema
├── scripts/                # Data Generation & Seeding Scripts
├── src/                    # Core Source Code
│   ├── app/                # Next.js App Router (Dashboard, Search, Live Resolution)
│   ├── components/         # Matte Industrial UI Components
│   ├── utils/              # Intelligence Engine (Normalization, Similarity)
│   └── types/              # Unified Schema Definitions
├── .env.local              # Environment Configuration
├── tailwind.config.ts      # Matte Industrial Theme Enforcer
└── package.json            # Core Dependencies
```

---

## 🚀 The Tech Stack

*   **Framework**: Next.js 14+ (App Router), TypeScript.
*   **Design System**: **Matte Industrial (Sovereignty-Grade)**. A high-impact, utilitarian aesthetic using Jet Orange (#ff6b00) and Dusty Grey (#08080a). Zero glow, zero blurs—built for serious governance.
*   **Intelligence Engine**: 
    *   **Gemini Pro**: Semantic Arbitration and Forensic Reasoning.
    *   **Supabase (PostgreSQL)**: Data persistence and Real-time event logging.
    *   **Weighted Similarity**: Hybrid resolution logic (GSTIN, PAN, Address Vector).
*   **Visuals**: Framer Motion for structural logic and state transitions.

---

## 🛡️ Core Capabilities

1.  **UBID Generation**: Automated resolution of 1:N fragmented records into a single identity.
2.  **Forensic Arbitration**: AI-driven reasoning for high-entropy identity collisions.
3.  **Active Intelligence**: Real-time cross-system event monitoring (GSTN, MCA, Udyam).
4.  **Anomaly Detection**: Flagging "Zombie" entities and suspicious identity clusters.
5.  **Resolution Protocol**: A step-by-step transparent audit trail for every entity resolution.

---

## 🛠️ Deployment & Local Setup

1. **Clone & Install**:
   ```bash
   git clone [repository-url]
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env.local` file with the following:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `GEMINI_API_KEY`

3. **Database Seeding**:
   ```bash
   npm run seed
   ```

4. **Launch Engine**:
   ```bash
   npm run dev
   ```
   Access the Governance Hub at `http://localhost:3000`.

---

**Built for the AI for Bharat Hackathon 2026**  
*Enforcing the Single Source of Truth for the National Economy.*
