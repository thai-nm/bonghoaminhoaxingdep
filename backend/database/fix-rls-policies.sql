-- Quick fix for RLS policies to allow user registration
-- Run this in Supabase SQL Editor to fix the registration issue

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own achievement stats" ON achievement_stats;
DROP POLICY IF EXISTS "Users can insert own achievement stats" ON achievement_stats;
DROP POLICY IF EXISTS "Users can update own achievement stats" ON achievement_stats;
DROP POLICY IF EXISTS "Users can delete own achievement stats" ON achievement_stats;

-- Create new policies that allow registration
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Achievement stats policies with registration support
CREATE POLICY "Allow achievement stats creation" ON achievement_stats
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own achievement stats" ON achievement_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own achievement stats" ON achievement_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own achievement stats" ON achievement_stats
    FOR DELETE USING (auth.uid() = user_id);
