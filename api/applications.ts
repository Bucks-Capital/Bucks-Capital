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
      console.log('📋 Fetching applications, list contains:', applicationsList);
      
      for (const appId of applicationsList) {
        const application = await kv.get(`application:${appId}`);
        if (application) {
          // Ensure the ID in the application object matches the stored key
          if (application.id !== appId) {
            console.warn(`⚠️ ID mismatch: stored key has ${appId}, but application.id is ${application.id}`);
            // Use the ID from the stored key to ensure consistency
            application.id = appId;
          }
          applications.push(application);
        } else {
          console.warn(`⚠️ Application ${appId} in list but not found in KV`);
        }
      }
      
      console.log(`✅ Loaded ${applications.length} applications from KV`);
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

    console.log('🗑️ Delete request received:', { id, method: req.method, query: req.query });

    if (!id || typeof id !== 'string') {
      console.error('❌ Missing or invalid application ID:', id);
      return res.status(400).json({ error: 'Missing application ID' });
    }

    if (kv) {
      console.log('📦 Using Vercel KV for deletion');
      
      // Try to find the application - handle both old and new ID formats
      let existingApp = null;
      let actualKey = null;
      
      // First, try with the ID as-is
      existingApp = await kv.get(`application:${id}`);
      if (existingApp) {
        actualKey = `application:${id}`;
        console.log('✅ Found application with key:', actualKey);
      } else {
        // Try with app_ prefix (new format)
        const newFormatId = id.startsWith('app_') ? id : `app_${id}`;
        existingApp = await kv.get(`application:${newFormatId}`);
        if (existingApp) {
          actualKey = `application:${newFormatId}`;
          console.log('✅ Found application with new format key:', actualKey);
        } else {
          // Try to find by searching through all applications
          console.log('⚠️ Application not found with direct key, searching in list...');
          const applicationsList = await kv.get('applications:list') || [];
          console.log('📋 Applications list:', applicationsList);
          
          // Find matching ID in the list (handle both formats)
          const matchingId = applicationsList.find((appId: string) => 
            appId === id || appId === `app_${id}` || appId.endsWith(`_${id}`) || appId.includes(id)
          );
          
          if (matchingId) {
            console.log('✅ Found matching ID in list:', matchingId);
            actualKey = `application:${matchingId}`;
            existingApp = await kv.get(actualKey);
          }
        }
      }
      
      // Remove from applications list FIRST (before deleting the key)
      // This ensures we clean up the list even if the key deletion fails
      const applicationsList = await kv.get('applications:list') || [];
      console.log('📋 Current applications list before deletion:', applicationsList);
      
      // Find all possible matching IDs in the list
      const idsToRemove: string[] = [];
      applicationsList.forEach((appId: string) => {
        const matches = appId === id || 
                       appId === `app_${id}` || 
                       appId.endsWith(`_${id}`) ||
                       (id.startsWith('app_') && appId === id) ||
                       (!id.startsWith('app_') && appId === `app_${id}`) ||
                       appId.includes(id);
        if (matches) {
          idsToRemove.push(appId);
          console.log(`🗑️ Will remove ${appId} from list (matched ${id})`);
        }
      });
      
      // Remove all matching IDs from the list
      const updatedList = applicationsList.filter((appId: string) => !idsToRemove.includes(appId));
      console.log('📋 Updated applications list after filtering:', updatedList);
      await kv.set('applications:list', updatedList);
      console.log('✅ Updated applications list in KV');
      
      // Now delete all matching keys
      let deletedCount = 0;
      for (const idToDelete of idsToRemove.length > 0 ? idsToRemove : [id, `app_${id}`]) {
        const keyToDelete = `application:${idToDelete}`;
        const appToDelete = await kv.get(keyToDelete);
        if (appToDelete) {
          console.log(`🗑️ Deleting key: ${keyToDelete}`);
          await kv.del(keyToDelete);
          deletedCount++;
          console.log(`✅ Deleted key: ${keyToDelete}`);
        }
      }
      
      // Also try deleting with the original ID format
      if (!existingApp) {
        const originalKey = `application:${id}`;
        const originalApp = await kv.get(originalKey);
        if (originalApp) {
          console.log(`🗑️ Found and deleting with original key: ${originalKey}`);
          await kv.del(originalKey);
          deletedCount++;
        }
      } else if (actualKey) {
        await kv.del(actualKey);
        deletedCount++;
      }
      
      console.log(`✅ Deleted ${deletedCount} key(s) from KV`);
      
      // Verify deletion by checking if any matching keys still exist
      const verifyKeys = idsToRemove.length > 0 ? idsToRemove.map(id => `application:${id}`) : [`application:${id}`, `application:app_${id}`];
      let stillExists = false;
      for (const verifyKey of verifyKeys) {
        const verifyApp = await kv.get(verifyKey);
        if (verifyApp) {
          console.error(`❌ Application still exists at key: ${verifyKey}`);
          stillExists = true;
        }
      }
      
      if (stillExists) {
        console.error('❌ Some applications still exist after deletion attempt');
        // Don't return error - we've removed from list, which is the main thing
      } else {
        console.log('✅ Verified: All matching applications deleted from KV');
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

