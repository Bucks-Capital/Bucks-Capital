-- Bucks Capital Booking System Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Team Members Table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability Table (for both recurring and one-time)
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20), -- For recurring availability (Monday, Tuesday, etc.)
    start_time TIME, -- For recurring availability
    end_time TIME, -- For recurring availability
    date DATE, -- For one-time availability
    is_active BOOLEAN DEFAULT true,
    type VARCHAR(20) NOT NULL CHECK (type IN ('recurring', 'onetime')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    meeting_type VARCHAR(100) NOT NULL,
    meeting_date DATE NOT NULL,
    meeting_time TIME NOT NULL,
    meeting_duration INTEGER NOT NULL, -- in minutes
    google_meet_link TEXT,
    google_calendar_event_id TEXT,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auth Users Table (for team member authentication)
CREATE TABLE auth_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'team_member' CHECK (role IN ('admin', 'team_member')),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default team members
INSERT INTO team_members (name, email, role, bio) VALUES
('Shreyas Raju', 'shreyasRaju3249@gmail.com', 'Chief Technology Officer', 'Leading technology initiatives and digital transformation at Bucks Capital.'),
('Zahin Mulji', 'muljizahin@gmail.com', 'Chief Investment Officer', 'Overseeing investment strategies and portfolio management.'),
('Harrison Cornwell', 'harrisonecornwell@gmail.com', 'Chief Financial Officer', 'Managing financial operations and strategic planning.');

-- Insert default auth users (with hashed passwords)
-- Note: In production, use proper password hashing (bcrypt, etc.)
INSERT INTO auth_users (email, team_member_id, role, password_hash) VALUES
('shreyasRaju3249@gmail.com', (SELECT id FROM team_members WHERE email = 'shreyasRaju3249@gmail.com'), 'admin', '$2a$10$example_hash_1'), -- BucksCapital2024!
('muljizahin@gmail.com', (SELECT id FROM team_members WHERE email = 'muljizahin@gmail.com'), 'team_member', '$2a$10$example_hash_2'), -- BucksCapital2024!
('harrisonecornwell@gmail.com', (SELECT id FROM team_members WHERE email = 'harrisonecornwell@gmail.com'), 'team_member', '$2a$10$example_hash_3'); -- BucksCapital2024!

-- Create indexes for better performance
CREATE INDEX idx_availability_team_member ON availability(team_member_id);
CREATE INDEX idx_availability_type ON availability(type);
CREATE INDEX idx_availability_date ON availability(date);
CREATE INDEX idx_bookings_team_member ON bookings(team_member_id);
CREATE INDEX idx_bookings_date ON bookings(meeting_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_auth_users_email ON auth_users(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_auth_users_updated_at BEFORE UPDATE ON auth_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access to team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access to availability" ON availability FOR SELECT USING (true);
CREATE POLICY "Allow public insert on bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Create policies for authenticated users
CREATE POLICY "Allow team members to manage their availability" ON availability FOR ALL USING (true);
CREATE POLICY "Allow team members to view their bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow team members to update their bookings" ON bookings FOR UPDATE USING (true);
