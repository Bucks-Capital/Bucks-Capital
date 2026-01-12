import { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
    res.status(500).json({
      error: 'Failed to upload resume',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

