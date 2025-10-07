-- NGS Security Assessment Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessments table
CREATE TABLE assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'started' CHECK (status IN ('started', 'completed', 'abandoned')),
    total_score INTEGER DEFAULT 0,
    risk_level VARCHAR(10) CHECK (risk_level IN ('low', 'medium', 'high')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment_responses table
CREATE TABLE assessment_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assessment_id, question_id)
);

-- Create consultations table
CREATE TABLE consultations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company VARCHAR(255),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE admins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_completed_at ON assessments(completed_at);
CREATE INDEX idx_assessment_responses_assessment_id ON assessment_responses(assessment_id);
CREATE INDEX idx_consultations_assessment_id ON consultations(assessment_id);
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_status ON consultations(status);

-- Create Row Level Security (RLS) policies
-- Note: You may want to adjust these based on your security requirements

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Example policies (you may want to customize these)
-- Allow public read/write access for the app (you can make this more restrictive)
CREATE POLICY "Allow public access" ON users FOR ALL USING (true);
CREATE POLICY "Allow public access" ON assessments FOR ALL USING (true);
CREATE POLICY "Allow public access" ON assessment_responses FOR ALL USING (true);
CREATE POLICY "Allow public access" ON consultations FOR ALL USING (true);
CREATE POLICY "Allow public access" ON admins FOR ALL USING (true);

-- Insert a default admin user (password is hashed version of 'admin123')
-- Note: In production, use proper password hashing
INSERT INTO admins (username, email, password_hash) 
VALUES ('admin', 'admin@ngssecurity.co.uk', '$2b$10$example_hash_here');

-- Create a function to calculate risk level based on score
CREATE OR REPLACE FUNCTION calculate_risk_level(score INTEGER)
RETURNS VARCHAR(10) AS $$
BEGIN
    IF score >= 70 THEN
        RETURN 'low';
    ELSIF score >= 40 THEN
        RETURN 'medium';
    ELSE
        RETURN 'high';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set risk level when score is updated
CREATE OR REPLACE FUNCTION update_risk_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.risk_level := calculate_risk_level(NEW.total_score);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assessment_risk_level_trigger
    BEFORE UPDATE ON assessments
    FOR EACH ROW
    WHEN (OLD.total_score IS DISTINCT FROM NEW.total_score)
    EXECUTE FUNCTION update_risk_level();

-- Create a view for admin dashboard statistics
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM assessments) as total_assessments,
    (SELECT COUNT(*) FROM assessments WHERE status = 'completed') as completed_assessments,
    (SELECT COUNT(*) FROM consultations) as consultation_bookings,
    (SELECT COUNT(*) FROM users) as total_users,
    ROUND(
        CASE 
            WHEN (SELECT COUNT(*) FROM assessments) > 0 
            THEN (SELECT COUNT(*) FROM assessments WHERE status = 'completed')::numeric / (SELECT COUNT(*) FROM assessments)::numeric * 100
            ELSE 0
        END, 1
    ) as completion_rate,
    ROUND(
        CASE 
            WHEN (SELECT COUNT(*) FROM assessments WHERE status = 'completed') > 0 
            THEN (SELECT COUNT(*) FROM consultations)::numeric / (SELECT COUNT(*) FROM assessments WHERE status = 'completed')::numeric * 100
            ELSE 0
        END, 1
    ) as conversion_rate;
