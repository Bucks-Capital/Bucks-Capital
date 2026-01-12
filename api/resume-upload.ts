import { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Blob Storage is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('⚠️ BLOB_READ_WRITE_TOKEN not configured. Blob Storage may not be set up.');
      return res.status(503).json({
        error: 'Blob Storage not configured',
        details: 'Please add Vercel Blob Storage to your project in the Vercel Dashboard',
      });
    }

    const { filename, contentType, fileData } = req.body;

    if (!filename || !fileData) {
      return res.status(400).json({ error: 'Missing filename or file data' });
    }

    // Upload file to Vercel Blob Storage
    const blob = await put(filename, Buffer.from(fileData, 'base64'), {
      access: 'public',
      contentType: contentType || 'application/octet-stream',
    });

    console.log('✅ Resume uploaded to Blob Storage:', blob.url);

    res.status(200).json({
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Provide helpful error messages
    let userMessage = 'Failed to upload resume';
    if (errorMessage.includes('BLOB_READ_WRITE_TOKEN') || errorMessage.includes('token')) {
      userMessage = 'Blob Storage not configured. Please add Vercel Blob Storage to your project.';
    } else if (errorMessage.includes('unauthorized') || errorMessage.includes('permission')) {
      userMessage = 'Blob Storage permission error. Please check your Vercel configuration.';
    }
    
    res.status(500).json({
      error: userMessage,
      details: errorMessage,
    });
  }
}

