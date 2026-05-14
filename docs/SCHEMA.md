# BBIE Database Schema & Resolution Logic

This document details the data architecture of the Bharat Business Intelligence Engine (BBIE), designed to handle the complexity of heterogeneous business data across India.

## 1. Core Entities

### `businesses`
The "Golden Record" table. Represents unique, verified business entities.
- `id`: UUID (Primary Key)
- `ubid`: Unique Bharat ID (Format: `BBIE-XXXX-XXXX`)
- `primary_name`: The canonical name of the business.
- `registered_address`: The verified headquarters address.
- `activity_status`: Live status (Active, Dormant, Liquidated).
- `incorporation_date`: Official date of start.

### `source_records`
Raw data ingested from various sources (GST, MCA, MSME, PF).
- `id`: UUID
- `business_id`: Foreign key to `businesses` (if resolved).
- `source_system`: e.g., 'MCA_FILING', 'GST_PORTAL'.
- `raw_data`: JSONB blob of the original input.
- `is_verified`: Boolean indicating if this record is part of a verified entity.

### `resolution_events`
The bridge table where the BBIE Engine proposes merges.
- `id`: UUID
- `source_record_id`: The "Dirty" record.
- `target_business_id`: The "Clean" entity it might belong to.
- `score`: Confidence level (0-100) based on fuzzy/vector matching.
- `status`: `pending`, `approved`, `rejected`.

## 2. Entity Resolution Pipeline

1. **Ingestion**: Raw records are loaded into `source_records`.
2. **Vector Scan**: The engine generates embeddings for the new record and compares them against existing `businesses`.
3. **Fuzzy Logic**: If high semantic similarity is found, a secondary fuzzy matching check is run on fields like PAN, address, and directors.
4. **Human-in-the-Loop**: Any match with a score between 60% and 95% is sent to the **Review Workspace** for human review.
5. **Resolution**: Upon approval, the `source_record` is linked to the `business` and the "Golden Record" is updated with any missing data (data enrichment).

## 3. Data Integrity
- **Verified Badge**: Only entities in the `businesses` table with at least two supporting `source_records` receive the "Verified" status in the Registry.
- **Fraud Detection**: Discrepancies between source records (e.g., different addresses for the same GSTIN) are flagged for manual investigation.
