# NGS Security Assessment Platform - Database Setup Guide

## Overview

This guide will help you set up a Supabase database to replace the mock data with real data that can be viewed and managed through the admin dashboard.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your NGS Assessment Platform project

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `ngs-assessment-platform`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings > API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your Supabase credentials:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key-here
   ```

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database/schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create the following tables:
- `users` - Store user information
- `assessments` - Track assessment sessions
- `assessment_responses` - Individual question responses
- `consultations` - Consultation booking requests
- `admins` - Admin user accounts

## Step 5: Configure Row Level Security (Optional)

The provided schema includes basic RLS policies that allow public access. For production, you may want to implement more restrictive policies:

```sql
-- Example: Only allow users to see their own data
DROP POLICY "Allow public access" ON users;
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id);
```

## Step 6: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to:
   - Create a new assessment through the home page
   - Complete the assessment
   - Check if responses appear in the admin dashboard

## Step 7: Verify Data in Supabase

1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. Check that data appears in your tables:
   - `users` should show registered users
   - `assessments` should show completed assessments
   - `assessment_responses` should show individual answers
   - `consultations` should show booking requests

## Admin Dashboard Access

Default admin credentials:
- **Username**: `admin`
- **Password**: `admin123`

## Database Schema Overview

### Tables Structure

#### `users`
- Stores user registration information
- Links to assessments and consultations

#### `assessments`
- Tracks assessment sessions
- Automatically calculates risk levels
- Links to users and responses

#### `assessment_responses`
- Individual question answers
- Linked to specific assessments
- Includes scoring information

#### `consultations`
- Consultation booking requests
- Links to users and assessments
- Status tracking (pending, scheduled, etc.)

#### `admins`
- Admin user accounts
- Secure authentication

## Features Enabled by Database Integration

### Real-time Admin Dashboard
- Live statistics from actual data
- Real user responses and scores
- Conversion tracking
- Performance metrics

### Data Visualization
- Score distribution charts
- Completion trend analysis
- Risk level breakdowns
- User engagement metrics

### User Management
- Track individual users
- View detailed assessment histories
- Monitor completion rates
- Analyze response patterns

## Troubleshooting

### Common Issues

1. **"supabase is not defined" error**
   - Check that your `.env` file is properly configured
   - Ensure environment variables start with `REACT_APP_`
   - Restart your development server after adding env variables

2. **Database connection errors**
   - Verify your Supabase URL and API key
   - Check that your Supabase project is active
   - Ensure RLS policies allow your operations

3. **No data appearing**
   - Check browser console for JavaScript errors
   - Verify data is being saved in Supabase Table Editor
   - Check network tab for failed API requests

### Getting Help

- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Join Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- Review error messages in browser console

## Production Deployment

For production deployment:

1. **Security**: Review and tighten RLS policies
2. **Environment**: Use production Supabase instance
3. **Monitoring**: Set up Supabase monitoring and alerts
4. **Backup**: Configure regular database backups
5. **Performance**: Monitor query performance and optimize as needed

## Data Export

To export assessment data:

```sql
-- Export all assessment results
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    u.company_name,
    a.total_score,
    a.risk_level,
    a.completed_at
FROM assessments a
JOIN users u ON u.id = a.user_id
WHERE a.status = 'completed'
ORDER BY a.completed_at DESC;
```

## Next Steps

1. Complete the database setup following this guide
2. Test the assessment flow end-to-end
3. Review admin dashboard functionality
4. Customize the database schema if needed
5. Set up production environment

Your NGS Security Assessment Platform is now ready with full database integration!