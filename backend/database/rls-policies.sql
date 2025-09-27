-- Row Level Security Policies for Todo Garden
-- Run this AFTER creating the schema

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_stats ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Allow user registration (INSERT without authentication)
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Daily records policies
-- Users can only access their own daily records
CREATE POLICY "Users can view own daily records" ON daily_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily records" ON daily_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily records" ON daily_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily records" ON daily_records
    FOR DELETE USING (auth.uid() = user_id);

-- Todos policies
-- Users can only access their own todos
CREATE POLICY "Users can view own todos" ON todos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos" ON todos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos" ON todos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos" ON todos
    FOR DELETE USING (auth.uid() = user_id);

-- Achievement stats policies
-- Allow initial achievement stats creation during registration
CREATE POLICY "Allow achievement stats creation" ON achievement_stats
    FOR INSERT WITH CHECK (true);

-- Users can only access their own achievement stats
CREATE POLICY "Users can view own achievement stats" ON achievement_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own achievement stats" ON achievement_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own achievement stats" ON achievement_stats
    FOR DELETE USING (auth.uid() = user_id);
