# ⛓️ BBIE Resolution Pipeline

This document details the forensic data flow from raw signal ingestion to the generation of the **Golden Record (UBID)**.

## 1. Normalization (The Cleanse)
Raw business data from MCA, GSTN, and Udyam is passed through a deterministic normalization engine.
*   **Address Standardizing**: Stripping noisy characters, standardizing "Street" vs "St", and extracting Pincodes.
*   **Entity Cleaning**: Removing "Pvt Ltd", "LLP", etc., to expose the core trade name.

## 2. Block Generation
To optimize performance, entities are grouped into "Blocks" based on high-level similarities (e.g., same Pincode or same PAN prefix). This reduces the search space from N² to manageable clusters.

## 3. Similarity Scoring (Hybrid Metric)
Every pair within a block is compared using a weighted composite score:
*   **Identifier Match (40%)**: Exact or partial matches on GSTIN/PAN.
*   **Semantic Address Similarity (30%)**: Jaro-Winkler distance between normalized address strings.
*   **Vector Similarity (30%)**: Cosine similarity of trade name embeddings (Gemini).

## 4. Arbitration & Verdict
*   **High Confidence (>0.85)**: Automated merging into a UBID.
*   **Ambiguous (0.6 - 0.85)**: Passed to the **Forensic Agent (Gemini)** for a verdict based on historical drift and activity overlap.
*   **Low Confidence (<0.6)**: Maintained as separate identity fragments.

## 5. Persistence
Verdicts are written to the `resolution_logs` in Supabase, and the `source_records` are linked via the `ubid` foreign key.
