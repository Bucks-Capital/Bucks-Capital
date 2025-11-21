import { VercelRequest, VercelResponse } from '@vercel/node';

// Try to import KV, but don't fail if it's not available
let kv: any = null;
try {
  const kvModule = await import('@vercel/kv');
  kv = kvModule.kv;
} catch (error) {
  console.log('KV not available, using fallback storage');
}

// Fallback in-memory storage for development (not persistent across deployments)
let fallbackStorage: any[] = [];

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

    // Store application
    if (kv) {
      // Store in Vercel KV
      await kv.set(`application:${applicationId}`, application);
      
      // Add to applications list
      const applicationsList = await kv.get('applications:list') || [];
      applicationsList.push(applicationId);
      await kv.set('applications:list', applicationsList);
    } else {
      // Fallback to in-memory storage
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
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getApplications(req: VercelRequest, res: VercelResponse) {
  try {
    let applications: any[] = [];

    if (kv) {
      // Get from Vercel KV
      const applicationsList = await kv.get('applications:list') || [];
      
      for (const appId of applicationsList) {
        const application = await kv.get(`application:${appId}`);
        if (application) {
          applications.push(application);
        }
      }
    } else {
      // Fallback to in-memory storage
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

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing application ID' });
    }

    if (kv) {
      // Delete from Vercel KV
      await kv.del(`application:${id}`);
      
      // Remove from applications list
      const applicationsList = await kv.get('applications:list') || [];
      const updatedList = applicationsList.filter((appId: string) => appId !== id);
      await kv.set('applications:list', updatedList);
    } else {
      // Fallback to in-memory storage
      fallbackStorage = fallbackStorage.filter(app => app.id !== id);
    }

    console.log('✅ Application deleted:', id);
    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

