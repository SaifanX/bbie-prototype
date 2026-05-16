-- Enable pgvector extension for semantic search
create extension if not exists vector;

-- National System of Record (The Gold Standard)
create table if not exists public.businesses (
    id uuid primary key default gen_random_uuid(),
    ubid text unique not null,
    name text not null,
    legal_name text,
    address text,
    pincode text,
    sector text,
    status text default 'active',
    incorporation_date date,
    pan text,
    gstin text,
    embedding vector(3072), -- For semantic name matching
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Resolution Activity (The Messy Input Stream)
create table if not exists public.resolution_logs (
    id uuid primary key default gen_random_uuid(),
    source_system text not null, -- e.g., 'GSTN', 'BANK-A'
    raw_payload jsonb not null,  -- The messy input
    resolved_ubid uuid references public.businesses(id),
    confidence_score float,
    verdict text, -- 'resolved', 'triage', 'flagged'
    forensic_audit jsonb, -- The 5-step trace history
    created_at timestamptz default now()
);

-- Create a spatial index for faster name matching
create index if not exists businesses_name_idx on public.businesses using gin (name gin_trgm_ops);
-- Note: hnsw index omitted for 3072-dim vectors (exceeds pgvector 2000-dim limit for hnsw)

-- Forensic Audit Trail
create table if not exists public.audit_trail (
    id uuid primary key default gen_random_uuid(),
    business_id uuid references public.businesses(id),
    event_type text not null,
    description text,
    metadata jsonb,
    created_at timestamptz default now()
);

-- Resolved Source Records Vault (The Messy Vault)
create table if not exists public.source_records_archive (
    id uuid primary key,
    business_id uuid references public.businesses(id) on delete set null,
    department varchar not null,
    source_id varchar not null,
    entity_name text not null,
    pan varchar,
    gstin varchar,
    raw_data jsonb,
    reported_date timestamptz,
    created_at timestamptz default now(),
    resolved boolean default true,
    address text,
    embedding vector(3072),
    archived_at timestamptz default now()
);
