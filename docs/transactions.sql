-- BBIE Transactional Integrity: approve_merge_transaction
-- This function ensures that human-approved merges are executed atomically.
-- Either all records are linked and events resolved, or none are.

CREATE OR REPLACE FUNCTION approve_merge_transaction(
    p_event_id UUID,
    p_source_record_id UUID,
    p_target_business_id UUID,
    p_resolver_id TEXT
) RETURNS VOID AS $$
DECLARE
    v_entity_name TEXT;
    v_pincode TEXT;
    v_pan TEXT;
    v_gstin TEXT;
BEGIN
    -- 1. Get metadata from the source record for batch resolution
    SELECT entity_name, pincode INTO v_entity_name, v_pincode
    FROM source_records
    WHERE id = p_source_record_id;

    -- 2. Resolve the primary event
    UPDATE resolution_events
    SET status = 'approved',
        resolved_at = NOW(),
        resolved_by = p_resolver_id
    WHERE id = p_event_id;

    -- 3. Link the primary source record
    UPDATE source_records
    SET business_id = p_target_business_id,
        resolved = TRUE
    WHERE id = p_source_record_id;

    -- 4. BATCH RESOLUTION: Find other pending events with EXACT same name and pincode for this target
    -- This handles the "Batch Resolution" logic atomically in the database
    UPDATE resolution_events
    SET status = 'approved',
        resolved_at = NOW(),
        resolved_by = 'batch_resolver'
    WHERE id IN (
        SELECT re.id
        FROM resolution_events re
        JOIN source_records sr ON re.source_record_id = sr.id
        WHERE re.status = 'pending'
          AND re.potential_business_id = p_target_business_id
          AND sr.entity_name = v_entity_name
          AND sr.pincode = v_pincode
          AND sr.id != p_source_record_id
    );

    UPDATE source_records
    SET business_id = p_target_business_id,
        resolved = TRUE
    WHERE id IN (
        SELECT sr.id
        FROM source_records sr
        JOIN resolution_events re ON re.source_record_id = sr.id
        WHERE re.status = 'approved'
          AND re.resolved_by = 'batch_resolver'
          AND re.potential_business_id = p_target_business_id
          AND sr.entity_name = v_entity_name
          AND sr.pincode = v_pincode
    );

    -- 5. MASTER DATA ENRICHMENT
    -- Fetch identifiers from business and source to see if we can enrich the Golden Record
    SELECT pan, gstin INTO v_pan, v_gstin FROM businesses WHERE id = p_target_business_id;
    
    -- (Logic for enrichment could be expanded here if raw_data was easily accessible in SQL)
    -- For now, we focus on linking and status.

    -- 6. ACTIVITY LINKING: Link unassigned activity events by PAN/GSTIN
    UPDATE activity_events
    SET business_id = p_target_business_id
    WHERE business_id IS NULL
      AND (
          (v_pan IS NOT NULL AND pan = v_pan)
          OR 
          (v_gstin IS NOT NULL AND gstin = v_gstin)
      );

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_new_entity_transaction(
    p_event_id UUID,
    p_source_record_id UUID,
    p_ubid TEXT,
    p_name TEXT,
    p_address TEXT,
    p_pincode TEXT
) RETURNS UUID AS $$
DECLARE
    v_new_business_id UUID;
BEGIN
    -- 1. Create the new business record
    INSERT INTO businesses (ubid, name, address, pincode, status, created_at, updated_at)
    VALUES (p_ubid, p_name, p_address, p_pincode, 'active', NOW(), NOW())
    RETURNING id INTO v_new_business_id;

    -- 2. Resolve the primary event
    UPDATE resolution_events
    SET status = 'approved',
        resolved_at = NOW(),
        resolved_by = 'human_reviewer'
    WHERE id = p_event_id;

    -- 3. Link the primary source record
    UPDATE source_records
    SET business_id = v_new_business_id,
        resolved = TRUE
    WHERE id = p_source_record_id;

    -- 4. BATCH RESOLUTION: Link other pending records with same Name + Pincode
    UPDATE source_records
    SET business_id = v_new_business_id,
        resolved = TRUE
    WHERE id IN (
        SELECT id FROM source_records
        WHERE entity_name = p_name
          AND pincode = p_pincode
          AND business_id IS NULL
    );

    UPDATE resolution_events
    SET status = 'approved',
        resolved_at = NOW(),
        resolved_by = 'batch_resolver'
    WHERE source_record_id IN (
        SELECT id FROM source_records
        WHERE business_id = v_new_business_id
    ) AND status = 'pending';

    RETURN v_new_business_id;
END;
$$ LANGUAGE plpgsql;
