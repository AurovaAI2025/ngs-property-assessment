-- Safer approach: Remove only duplicate rows, keeping the most recent ones
-- Run this in your Supabase SQL Editor

-- Step 1: Check what duplicates we have
SELECT 
    assessment_id, 
    question_id, 
    COUNT(*) as duplicate_count,
    MIN(created_at) as earliest,
    MAX(created_at) as latest
FROM assessment_responses 
GROUP BY assessment_id, question_id 
HAVING COUNT(*) > 1
ORDER BY assessment_id, question_id;

-- Step 2: Delete only the older duplicate entries, keep the most recent one
WITH duplicates_to_delete AS (
    SELECT id
    FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                PARTITION BY assessment_id, question_id 
                ORDER BY created_at DESC
            ) as rn
        FROM assessment_responses
    ) ranked
    WHERE rn > 1  -- Keep the first (most recent) row, delete others
)
DELETE FROM assessment_responses 
WHERE id IN (SELECT id FROM duplicates_to_delete);

-- Step 3: Verify no duplicates remain
SELECT 
    assessment_id, 
    question_id, 
    COUNT(*) as count_should_be_1
FROM assessment_responses 
GROUP BY assessment_id, question_id 
HAVING COUNT(*) > 1;

-- Step 4: Add the unique constraint (should work now)
ALTER TABLE assessment_responses 
ADD CONSTRAINT unique_assessment_question 
UNIQUE(assessment_id, question_id);

-- Step 5: Verify the constraint was added
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    'SUCCESS' as status
FROM pg_constraint 
WHERE conrelid = 'assessment_responses'::regclass 
AND conname = 'unique_assessment_question';