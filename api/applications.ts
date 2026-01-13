import { VercelRequest, VercelResponse } from '@vercel/node';
import { put, del, list } from '@vercel/blob';

// Fallback in-memory storage for development (not persistent across deployments)
let fallbackStorage: any[] = [];

// Helper function to get all applications directly using list result
async function getAllApplicationsFromBlob(): Promise<any[]> {
  try {
    // Single list call to get all blob metadata
    const listResult = await list({ prefix: 'applications/' });

    // Filter for application JSON files
    const appBlobs = listResult.blobs.filter(blob =>
      blob.pathname.endsWith('.json') &&
      !blob.pathname.includes('index.json')
    );

    console.log(`📋 Found ${appBlobs.length} application blobs`);

    // Fetch all application contents in parallel
    const fetchPromises = appBlobs.map(async (blob) => {
      try {
        // Use downloadUrl if available for better performance/caching, or url
        const urlToFetch = (blob as any).downloadUrl || blob.url;

        const response = await fetch(urlToFetch);
        if (!response.ok) {
          console.warn(`Failed to fetch blob ${blob.pathname}: ${response.status}`);
          return null;
        }
        const appData = await response.json();

        // Ensure ID matches the filename if possible, or matches expected ID format
        // Extract ID from pathname: applications/app_123.json -> app_123
        const idFromPath = blob.pathname.replace('applications/', '').replace('.json', '');

        if (appData.id !== idFromPath) {
          // If mismatch, prefer the ID from the filename as it's the source of truth for the list
          appData.id = idFromPath;
        }

        return appData;
      } catch (e) {
        console.error(`Error processing blob ${blob.pathname}:`, e);
        return null;
      }
    });

    const results = await Promise.all(fetchPromises);

    // Filter out nulls
    return results.filter(app => app !== null);
  } catch (error) {
    console.error('Error listing applications from Blob:', error);
    throw error; // Re-throw to be handled by caller
  }
}

// Deprecated: Helper function to get application from Blob Storage
// Kept for delete/update operations that might need specific blob info
async function getApplicationFromBlob(applicationId: string): Promise<any | null> {
  try {
    const blobPath = `applications/${applicationId}.json`;

    // List blobs with the specific pathname to get the blob info
    const listResult = await list({ prefix: blobPath, limit: 1 });

    if (listResult.blobs.length === 0) {
      return null;
    }

    const blob = listResult.blobs[0];

    // Fetch the blob content using the public URL
    const response = await fetch(blob.url);
    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching application ${applicationId} from Blob:`, error);
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    return await createApplication(req, res);
  } else if (req.method === 'GET') {
    return await getApplications(req, res);
  } else if (req.method === 'DELETE') {
    return await deleteApplication(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function createApplication(req: VercelRequest, res: VercelResponse) {
  try {
    const applicationData = req.body;

    // Validate required fields
    if (!applicationData.name || !applicationData.email) {
      return res.status(400).json({ error: 'Missing required fields: name and email are required' });
    }

    // Create application record
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const application = {
      id: applicationId,
      ...applicationData,
      submittedAt: new Date().toISOString(),
      status: applicationData.status || 'pending'
    };

    // Store application in Blob Storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        // Store application as JSON file in Blob Storage
        const blobPath = `applications/${applicationId}.json`;
        const blob = await put(blobPath, JSON.stringify(application), {
          access: 'public',
          contentType: 'application/json',
        });

        console.log('✅ Application stored in Blob Storage:', blob.url);
      } catch (blobError) {
        console.error('Error storing application in Blob:', blobError);
        throw blobError;
      }
    } else {
      // Fallback to in-memory storage if Blob Storage not configured
      console.warn('⚠️ BLOB_READ_WRITE_TOKEN not configured, using fallback storage');
      fallbackStorage.push(application);
    }

    console.log('✅ Application created successfully:', {
      id: application.id,
      name: application.name,
      email: application.email
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error);

    // Provide more detailed error message
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
      // Check for common Blob Storage errors
      if (error.message.includes('BLOB_READ_WRITE_TOKEN') || error.message.includes('token')) {
        errorMessage = 'Blob Storage not configured. Please add Vercel Blob Storage to your project.';
      } else if (error.message.includes('unauthorized') || error.message.includes('permission')) {
        errorMessage = 'Blob Storage permission error. Please check your Vercel configuration.';
      } else if (error.message.includes('storage') || error.message.includes('blob')) {
        errorMessage = 'Storage error. Please try again or contact support.';
      }
    }

    // Log full error for debugging
    console.error('Full error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });

    res.status(500).json({
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error',
      // Only include stack in development
      ...(process.env.NODE_ENV === 'development' && { stack: error instanceof Error ? error.stack : undefined })
    });
  }
}

async function getApplications(req: VercelRequest, res: VercelResponse) {
  try {
    let applications: any[] = [];

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Get from Blob Storage
      try {
        // Use optimized fetching
        applications = await getAllApplicationsFromBlob();
        console.log(`✅ Loaded ${applications.length} applications from Blob Storage`);
      } catch (blobError) {
        console.error('Error fetching from Blob Storage:', blobError);
        // Do NOT fallback to in-memory storage on error, so users can see the configuration error
        throw blobError;
      }
    } else {
      // Fallback to in-memory storage only if token is missing
      console.warn('⚠️ BLOB_READ_WRITE_TOKEN not configured, using fallback storage');
      applications = fallbackStorage;
    }

    // Sort by submission date (newest first)
    applications.sort((a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function deleteApplication(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;

    console.log('🗑️ Delete request received:', { id, method: req.method, query: req.query });

    if (!id || typeof id !== 'string') {
      console.error('❌ Missing or invalid application ID:', id);
      return res.status(400).json({ error: 'Missing application ID' });
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      console.log('📦 Using Blob Storage for deletion');

      try {
        // Strategy: List ALL applications to find the matching ID.
        // This avoids issues with exact path construction guesses and matches how the UI lists them.
        console.log(`🔍 Scanning all applications to find ID: ${id}`);
        // Limit to 1000 is default for Vercel Blob list, should be enough for now. 
        // Pagination would be needed if this scales beyond 1000 active applications.
        const listResult = await list({ prefix: 'applications/', limit: 1000 });

        const blobToDelete = listResult.blobs.find(blob => {
          // Normalize path to ID for comparison
          // matches logic in getAllApplicationsFromBlob
          const blobId = blob.pathname
            .replace('applications/', '')
            .replace('.json', '');

          return blobId === id;
        });

        if (blobToDelete) {
          console.log(`✅ Found blob to delete: ${blobToDelete.pathname} (${blobToDelete.url})`);
          await del(blobToDelete.url);
          console.log(`✅ Deleted blob successfully`);
        } else {
          console.warn(`⚠️ Application ${id} not found in Blob Storage listing (${listResult.blobs.length} blobs scanned)`);

          // Debug: print some IDs found to help diagnose why it's missing
          const foundIds = listResult.blobs.slice(0, 5).map(b => b.pathname);
          console.log('Sample of found paths:', foundIds);

          // If not found in blob, checking fallback storage is handled below, 
          // but since this block is strictly for BLOB_READ_WRITE_TOKEN being true,
          // we should probably 404.
          return res.status(404).json({ error: 'Application not found' });
        }
      } catch (blobError) {
        console.error('❌ Error deleting from Blob Storage:', blobError);
        throw blobError;
      }
    } else {
      console.log('💾 Using fallback in-memory storage for deletion');
      // Fallback to in-memory storage
      const beforeCount = fallbackStorage.length;
      fallbackStorage = fallbackStorage.filter(app => app.id !== id);
      const afterCount = fallbackStorage.length;
      console.log(`✅ Deleted from fallback storage: ${beforeCount} -> ${afterCount} applications`);
    }

    console.log('✅ Application deleted successfully:', id);
    res.status(200).json({ success: true, id, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting application:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
