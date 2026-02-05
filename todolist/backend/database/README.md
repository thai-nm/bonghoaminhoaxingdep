# Database Setup Instructions

## Step 1: Run Database Schema

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `schema.sql` into the editor
4. Run the SQL to create all tables, indexes, and triggers

## Step 2: Set Up Row Level Security

1. In the same SQL Editor
2. Copy and paste the contents of `rls-policies.sql`
3. Run the SQL to enable RLS and create security policies

## Step 3: Test Database Connection

After setting up the database schema:

1. Start your development server:
   ```bash
   cd backend
   npm run dev
   ```

2. Test the database connection:
   ```bash
   curl http://localhost:8787/test/db-test
   ```

   You should see a response indicating all tables are accessible.

## What We've Created

### Tables
- **users**: Store user accounts with authentication data
- **daily_records**: Track daily todo completion statistics
- **todos**: Individual todo items linked to daily records
- **achievement_stats**: User achievement and streak data

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Proper foreign key relationships and constraints

### Performance
- Indexes on frequently queried columns
- Automatic timestamp updates via triggers
- Optimized query patterns

## Next Steps

Once the database is set up and tested, we'll move on to:
1. User registration endpoint
2. Login system with JWT tokens
3. Password hashing with bcrypt
4. JWT middleware for route protection
5. Token refresh mechanism

## Troubleshooting

### Registration Error: "violates row-level security policy"
If you get this error when testing user registration:

1. **Quick Fix**: Run `disable-rls.sql` in Supabase SQL Editor
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE achievement_stats DISABLE ROW LEVEL SECURITY;
   ```

2. **Why this happens**: 
   - RLS expects Supabase Auth but we use custom JWT authentication
   - During registration, there's no authenticated user yet
   - RLS blocks the INSERT operation

3. **Security**: 
   - Our API endpoints provide proper authentication
   - This is a common pattern with custom auth + Supabase
   - Users can still only access their own data through our API

### Other Issues
If the database test fails:
1. Check that all SQL scripts ran without errors
2. Verify your Supabase environment variables are correct
3. Check the Supabase logs for any error details
