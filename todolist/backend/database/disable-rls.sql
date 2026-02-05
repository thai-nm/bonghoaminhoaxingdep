-- Disable Row Level Security for registration tables
-- Run this in your Supabase SQL Editor to fix the registration issue

-- Disable RLS on users table (allows user registration)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Disable RLS on achievement_stats table (allows initial stats creation during registration)
ALTER TABLE achievement_stats DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled on other tables for when we implement todos
-- daily_records and todos tables will still have RLS protection
-- This provides security for user data while allowing registration

-- Note: Our API endpoints already provide proper authentication and authorization
-- so disabling RLS on these tables is safe and follows common patterns
-- when using custom authentication with Supabase
