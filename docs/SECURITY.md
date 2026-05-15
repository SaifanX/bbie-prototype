# 🛡️ BBIE Security & Sovereignty Protocol

The Bharat Business Intelligence Engine is designed with a "Privacy-First" forensic approach to handle sensitive business data.

## 1. Sparse Masking
In the **Live Resolution Workshop**, sensitive data fields (PAN, GSTIN) are subjected to "Sparse Masking" during the reasoning phase.
*   **Logic**: `AAAAA1234A` -> `AAAA*1*3*A`
*   **Purpose**: Allows the AI agent to reason about patterns without exposing full PII in log exports.

## 2. Forensic Isolation
The resolution engine runs in a stateless environment. No source data is cached beyond the immediate resolution window.

## 3. Immutable Audit Log
All entity merging decisions are logged in an immutable table in Supabase.
*   **Traceability**: Every UBID can be traced back to its specific source fragments and the timestamped AI verdict that authorized the link.
*   **Reversibility**: Administrators can trigger a "Fragment Decoupling" if a forensic error is detected.

## 4. Role-Based Governance
The UI modules (Dashboard, Search, Resolution) are segmented by clearance levels.
*   **Observer**: Statistical visibility only.
*   **Auditor**: Search and forensic view enabled.
*   **Governor**: Write access to the resolution engine.

---
**National Economic Security Standard v1.0**
