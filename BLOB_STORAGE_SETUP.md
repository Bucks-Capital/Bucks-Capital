# Vercel Blob Storage Setup Guide

This guide will help you set up Vercel Blob Storage to store resume files for the application system.

## Why Vercel Blob Storage?

- **Free Tier**: 1GB storage, 100GB bandwidth per month
- **Seamless Integration**: Works perfectly with Vercel deployments
- **No Size Limits**: Unlike KV (2MB limit), Blob Storage can handle large files
- **Public URLs**: Files are accessible via public URLs

## Setup Steps

### 1. Install Dependencies

```bash
npm install @vercel/blob
```

### 2. Add Vercel Blob Storage to Your Project

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the **Storage** tab
4. Click **"Browse Marketplace"** or **"Add Integration"**
5. Search for **"Blob"** or **"Vercel Blob"**
6. Click **"Add"** to add Blob Storage to your project

### 3. Environment Variables (Automatic)

Vercel will automatically add these environment variables:
- `BLOB_READ_WRITE_TOKEN` - Token for reading/writing to Blob Storage

These are automatically available in all environments (development, preview, production).

### 4. Verify Setup

After adding Blob Storage:
- The environment variables will be automatically configured
- You can verify in Vercel Dashboard → Settings → Environment Variables
- The `BLOB_READ_WRITE_TOKEN` should be present

## How It Works

1. **File Upload**: When a user submits an application with a resume:
   - The file is converted to base64
   - Sent to `/api/resume-upload` endpoint
   - Uploaded to Vercel Blob Storage
   - Returns a public URL

2. **Storage**: The application is stored in KV with:
   - Resume metadata (name, type, size)
   - Blob Storage URL (not the file data)
   - This keeps KV storage small and efficient

3. **Retrieval**: When viewing applications:
   - The resume URL is retrieved from KV
   - Files can be downloaded directly from the Blob Storage URL

## File Structure

Resumes are stored with the path: `resumes/{timestamp}_{filename}`

Example: `resumes/1704123456789_john_doe_resume.pdf`

## Free Tier Limits

- **Storage**: 1GB free
- **Bandwidth**: 100GB/month free
- **Files**: Unlimited files
- **File Size**: Up to 4.5GB per file

For most use cases, the free tier is more than sufficient.

## Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is not defined"

**Solution**: Make sure you've added Blob Storage from the Vercel Dashboard. The token is automatically added as an environment variable.

### Error: "Failed to upload resume"

**Solution**: 
1. Check that Blob Storage is added to your project
2. Verify the `BLOB_READ_WRITE_TOKEN` environment variable exists
3. Check Vercel function logs for detailed error messages

### Files Not Accessible

**Solution**: Files uploaded with `access: 'public'` are publicly accessible. If you need private files, change the access setting in `api/resume-upload.ts`.

## Production Considerations

1. **File Validation**: The current implementation accepts any file type. Consider adding validation for file types and sizes.

2. **File Cleanup**: Consider implementing a cleanup job for old applications if storage becomes an issue.

3. **Access Control**: Currently files are public. For sensitive resumes, consider:
   - Using signed URLs with expiration
   - Implementing authentication for file access
   - Using private access with authentication

## Next Steps

After setup:
1. Deploy to Vercel (or push changes)
2. Test the application form with a resume file
3. Verify the file is uploaded and accessible
4. Check the admin panel to see the resume URL

