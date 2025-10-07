-- Fix duplicate assessment responses and add unique constraint
-- Run this in your Supabase SQL Editor

-- Step 1: Find and display duplicates (optional - for review)
SELECT 
    assessment_id, 
    question_id, 
    COUNT(*) as duplicate_count,
    array_agg(id) as response_ids
FROM assessment_responses 
GROUP BY assessment_id, question_id 
HAVING COUNT(*) > 1
ORDER BY assessment_id, question_id;

-- Step 2: Create a temporary table with deduplicated data
-- Keep the most recent response for each assessment_id + question_id combination
CREATE TEMP TABLE clean_responses AS
SELECT DISTINCT ON (assessment_id, question_id) 
    id,
    assessment_id,
    question_id,
    question_text,
    answer_text,
    score,
    created_at
FROM assessment_responses
ORDER BY assessment_id, question_id, created_at DESC;

-- Step 3: Delete all existing assessment responses
DELETE FROM assessment_responses;

-- Step 4: Insert the clean data back
INSERT INTO assessment_responses (
    id,
    assessment_id,
    question_id,
    question_text,
    answer_text,
    score,
    created_at
)
SELECT 
    id,
    assessment_id,
    question_id,
    question_text,
    answer_text,
    score,
    created_at
FROM clean_responses;

-- Step 5: Now add the unique constraint
ALTER TABLE assessment_responses 
ADD CONSTRAINT unique_assessment_question 
UNIQUE(assessment_id, question_id);

-- Step 6: Verify the constraint was added successfully
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'assessment_responses'::regclass 
AND conname = 'unique_assessment_question';