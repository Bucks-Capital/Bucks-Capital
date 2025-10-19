# Bucks Capital Booking System - Setup Guide

This guide will walk you through setting up all the environment variables and external services needed for the booking system.

## 🚀 Quick Start

1. **Copy the environment template:**
   ```bash
   cp env.example .env.local
   ```

2. **Follow the setup steps below for each service**

3. **Deploy to Vercel with environment variables**

---

## 📋 Step-by-Step Setup

### 1. Google Calendar Integration

#### A. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Bucks Capital Booking" and create

#### B. Enable Google Calendar API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

#### C. Create Service Account
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: "bucks-capital-booking"
4. Description: "Service account for booking system"
5. Click "Create and Continue"
6. Skip role assignment for now
7. Click "Done"

#### D. Generate Service Account Key
1. Click on your new service account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Download the JSON file

#### E. Extract Credentials
From the downloaded JSON file, copy:
- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_PRIVATE_KEY` (keep the quotes and \n characters)

#### F. Share Calendar with Service Account
1. Go to [Google Calendar](https://calendar.google.com/)
2. Create a new calendar called "Bucks Capital Bookings"
3. Go to calendar settings → "Share with specific people"
4. Add the service account email (from step E)
5. Give it "Make changes to events" permission

---

### 2. Email Service Setup

Choose ONE of the following options:

#### Option A: SendGrid (Recommended)

1. **Sign up for SendGrid:**
   - Go to [SendGrid](https://sendgrid.com/)
   - Create a free account (100 emails/day)

2. **Get API Key:**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name: "Bucks Capital Booking"
   - Permissions: "Full Access"
   - Copy the API key

3. **Set Environment Variables:**
   ```env
   SENDGRID_API_KEY=your-api-key-here
   SENDGRID_FROM_EMAIL=noreply@buckscapital.org
   SENDGRID_FROM_NAME=Bucks Capital
   ```

#### Option B: Gmail SMTP

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

3. **Set Environment Variables:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM_EMAIL=noreply@buckscapital.org
   SMTP_FROM_NAME=Bucks Capital
   ```

---

### 3. Vercel KV Database (Marketplace)

#### A. Add KV from Marketplace
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to "Storage" tab
3. Click "Browse Marketplace" or "Add Integration"
4. Search for "KV" or "Redis"
5. Select a KV provider (Upstash, Redis Cloud, etc.)
6. Add to your project

#### B. Automatic Configuration
1. Vercel will automatically add environment variables
2. No manual configuration needed
3. Available in all environments (development, preview, production)
4. Environment variables will be:
   - `VERCEL_KV_REST_API_URL`
   - `VERCEL_KV_REST_API_TOKEN`

---

### 4. Team Member Credentials

Update the team member credentials in your `.env.local`:

```env
# Replace with actual team member emails
TEAM_MEMBER_1_EMAIL=john@buckscapital.org
TEAM_MEMBER_1_PASSWORD=secure-password-123

TEAM_MEMBER_2_EMAIL=sarah@buckscapital.org
TEAM_MEMBER_2_PASSWORD=secure-password-456

TEAM_MEMBER_3_EMAIL=michael@buckscapital.org
TEAM_MEMBER_3_PASSWORD=secure-password-789
```

**Security Note:** Use strong, unique passwords for each team member.

---

### 5. Company Information

Update your company details:

```env
COMPANY_NAME=Bucks Capital
COMPANY_EMAIL=info@buckscapital.org
COMPANY_PHONE=267-945-7717
COMPANY_WEBSITE=https://buckscapital.org
```

---

## 🔧 Complete .env.local Example

Here's what your complete `.env.local` should look like:

```env
# Google Calendar Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=booking-service@bucks-capital-123456.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Team Member Credentials
TEAM_MEMBER_1_EMAIL=john@buckscapital.org
TEAM_MEMBER_1_PASSWORD=JohnSecurePass123!
TEAM_MEMBER_2_EMAIL=sarah@buckscapital.org
TEAM_MEMBER_2_PASSWORD=SarahSecurePass456!
TEAM_MEMBER_3_EMAIL=michael@buckscapital.org
TEAM_MEMBER_3_PASSWORD=MichaelSecurePass789!

# Email Service (SendGrid)
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
SENDGRID_FROM_EMAIL=noreply@buckscapital.org
SENDGRID_FROM_NAME=Bucks Capital

# Company Information
COMPANY_NAME=Bucks Capital
COMPANY_EMAIL=info@buckscapital.org
COMPANY_PHONE=267-945-7717
COMPANY_WEBSITE=https://buckscapital.org
DEFAULT_TIMEZONE=America/New_York

# Booking Settings
BOOKING_ADVANCE_NOTICE_HOURS=24
BOOKING_CANCELLATION_HOURS=2
BOOKING_REMINDER_HOURS=24
```

---

## 🚀 Deployment to Vercel

### 1. Install Dependencies
```bash
npm install @vercel/kv googleapis
```

### 2. Set Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Add each variable from your `.env.local` file
4. Make sure to set them for "Production", "Preview", and "Development"

### 3. Deploy
```bash
# Push to your repository
git add .
git commit -m "Add booking system"
git push origin main

# Vercel will automatically deploy
```

---

## ✅ Testing Your Setup

### 1. Test Team Member Login
1. Visit `/team-availability`
2. Try logging in with team member credentials
3. You should see the availability management interface

### 2. Test Booking Flow
1. Visit `/booking`
2. Go through the complete booking process
3. Check that Google Calendar events are created
4. Verify email notifications are sent

### 3. Check Logs
1. Go to Vercel Dashboard → Functions
2. Check the logs for any errors
3. Monitor Google Calendar API usage

---

## 🔍 Troubleshooting

### Common Issues:

#### "Google Calendar API Error"
- Check service account permissions
- Verify calendar is shared with service account
- Ensure private key format is correct

#### "Email Not Sending"
- Verify SendGrid API key is correct
- Check email service configuration
- Test with a simple email first

#### "KV Database Connection Error"
- Verify Vercel KV is properly configured
- Check environment variables in Vercel dashboard
- Ensure database is created and active

#### "Team Member Login Fails"
- Check email/password combinations
- Verify environment variables are set correctly
- Check browser console for errors

---

## 📞 Support

If you encounter any issues:
- Email: shreyasRaju3249@gmail.com
- Phone: 267-945-7717

---

## 🎉 You're All Set!

Once everything is configured:
1. Team members can manage their availability at `/team-availability`
2. Clients can book meetings at `/booking`
3. All bookings will automatically sync to Google Calendar
4. Email notifications will be sent automatically

The booking system is now fully functional and ready for production use!
