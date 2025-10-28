# 🚀 Supabase Backend Setup Guide

This guide will help you set up Supabase as your backend for the Bucks Capital booking system.

## 📋 Prerequisites

- A Supabase account (free tier available)
- Your Vercel project deployed
- Access to your project's environment variables

## 🛠️ Step-by-Step Setup

### 1. Create Supabase Project

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Click "New Project"**
3. **Fill in project details:**
   - Organization: Select your organization
   - Name: `bucks-capital-booking`
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to your users
4. **Click "Create new project"**
5. **Wait for setup to complete** (2-3 minutes)

### 2. Get Your Supabase Credentials

1. **Go to Settings → API**
2. **Copy the following:**
   - Project URL (e.g., `https://your-project-id.supabase.co`)
   - anon public key (starts with `eyJ...`)

### 3. Set Up Database Schema

1. **Go to SQL Editor in your Supabase dashboard**
2. **Copy the contents of `supabase/schema.sql`**
3. **Paste and run the SQL script**
4. **Verify tables were created:**
   - `team_members`
   - `availability`
   - `bookings`
   - `auth_users`

### 4. Configure Environment Variables

1. **In your Vercel dashboard:**
   - Go to your project
   - Click "Settings" → "Environment Variables"
   - Add the following variables:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

2. **For local development:**
   - Copy these to your `.env.local` file

### 5. Update Your Application

1. **Install Supabase dependencies:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Update your API endpoints to use Supabase:**
   - Replace `/api/availability-simple` with `/api/availability-supabase`
   - Replace `/api/auth/login-simple` with `/api/auth/login-supabase`
   - Replace `/api/bookings-simple` with `/api/bookings-supabase`

### 6. Test Your Setup

1. **Deploy your changes to Vercel**
2. **Test team member login**
3. **Test availability saving**
4. **Test booking creation**

## 🔧 Configuration Options

### Row Level Security (RLS)

Your database has RLS enabled for security. You can adjust policies in the Supabase dashboard:

1. **Go to Authentication → Policies**
2. **Review and modify policies as needed**

### Authentication

The current setup uses simple password authentication. For production, consider:

1. **Supabase Auth** - Built-in authentication system
2. **OAuth providers** - Google, GitHub, etc.
3. **Magic links** - Passwordless authentication

### Database Backups

Supabase automatically backs up your database:
- **Free tier**: 7 days of backups
- **Pro tier**: 30 days of backups
- **Point-in-time recovery** available

## 🚨 Important Security Notes

1. **Never commit your Supabase credentials to git**
2. **Use environment variables for all sensitive data**
3. **Review and test your RLS policies**
4. **Consider using Supabase Auth for production**

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid API key"**
   - Check your `SUPABASE_ANON_KEY` is correct
   - Ensure you're using the anon key, not the service role key

2. **"Table doesn't exist"**
   - Run the schema.sql script in Supabase SQL Editor
   - Check table names match exactly

3. **"Permission denied"**
   - Check your RLS policies
   - Ensure your anon key has proper permissions

### Getting Help

- **Supabase Docs**: https://supabase.com/docs
- **Discord Community**: https://discord.supabase.com
- **GitHub Issues**: https://github.com/supabase/supabase/issues

## 🎉 Next Steps

Once Supabase is set up:

1. **Test all functionality**
2. **Set up proper authentication**
3. **Configure email notifications**
4. **Set up Google Calendar integration**
5. **Deploy to production**

Your booking system will now have a robust, scalable backend! 🚀
