import { VercelRequest, VercelResponse } from '@vercel/node';
import { put, del, list } from '@vercel/blob';

// Fallback in-memory storage for development (not persistent across deployments)
let fallbackStorage: any[] = [];

// Helper function to get applications list from Blob Storage
async function getApplicationsList(): Promise<string[]> {
  try {
    const listResult = await list({ prefix: 'applications/' });
    return listResult.blobs
      .filter(blob => blob.pathname.endsWith('.json') && !blob.pathname.includes('index.json'))
      .map(blob => blob.pathname.replace('applications/', '').replace('.json', ''));
  } catch (error) {
    console.error('Error getting applications list from Blob:', error);
    return [];
  }
}

// Helper function to get application from Blob Storage
async function getApplicationFromBlob(applicationId: string): Promise<any | null> {
  try {
    const blobPath = `applications/${applicationId}.json`;
    
    // List blobs with the specific pathname to get the blob info
    const listResult = await list({ prefix: blobPath, limit: 1 });
    
    if (listResult.blobs.length === 0) {
      return null;
    }
    
    const blob = listResult.blobs[0];
    
    // Use downloadUrl if available, otherwise use url
    const blobUrl = blob.downloadUrl || blob.url;
    
    // Fetch the blob content using the public URL
    const response = await fetch(blobUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch blob ${blobPath}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const application = await response.json();
    return application;
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
  // #region agent log
  const fs = await import('fs').catch(() => null);
  const logPath = 'c:\\Users\\shrey\\OneDrive\\Desktop\\Bucks-Capital\\.cursor\\debug.log';
  // #endregion
  try {
    // #region agent log
    if (fs) {
      const logEntry = JSON.stringify({location:'api/applications.ts:27',message:'API received request',data:{method:req.method,headers:Object.keys(req.headers).reduce((acc,key)=>{acc[key]=String(req.headers[key]).substring(0,200);return acc;},{}),bodyKeys:Object.keys(req.body||{}),bodyTypes:Object.keys(req.body||{}).reduce((acc,key)=>{const val=req.body[key];acc[key]={type:typeof val,isNull:val===null,isUndefined:val===undefined,value:typeof val==='string'?val.substring(0,100):typeof val==='object'&&val!==null?`[Object:${Object.keys(val).join(',')}]`:String(val),length:typeof val==='string'?val.length:undefined},{}),contentType:req.headers['content-type']},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})+'\n';
      fs.appendFileSync(logPath, logEntry, 'utf8');
    }
    // #endregion
    const applicationData = req.body;

    // #region agent log
    if (fs) {
      const logEntry = JSON.stringify({location:'api/applications.ts:32',message:'Validating required fields',data:{hasName:!!applicationData.name,nameType:typeof applicationData.name,nameValue:applicationData.name?String(applicationData.name).substring(0,50):undefined,hasEmail:!!applicationData.email,emailType:typeof applicationData.email,emailValue:applicationData.email?String(applicationData.email).substring(0,50):undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})+'\n';
      fs.appendFileSync(logPath, logEntry, 'utf8');
    }
    // #endregion

    // Validate required fields
    if (!applicationData.name || !applicationData.email) {
      // #region agent log
      if (fs) {
        const logEntry = JSON.stringify({location:'api/applications.ts:35',message:'Validation failed - missing fields',data:{missingName:!applicationData.name,missingEmail:!applicationData.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})+'\n';
        fs.appendFileSync(logPath, logEntry, 'utf8');
      }
      // #endregion
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
    
    // #region agent log
    if (fs) {
      const logEntry = JSON.stringify({location:'api/applications.ts:43',message:'Application created successfully',data:{applicationId,hasName:!!application.name,hasEmail:!!application.email,allFields:Object.keys(application)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})+'\n';
      fs.appendFileSync(logPath, logEntry, 'utf8');
    }
    // #endregion

    // Store application in Blob Storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // #region agent log
      if (fs) {
        const appSize = JSON.stringify(application).length;
        const logEntry = JSON.stringify({location:'api/applications.ts:75',message:'Before Blob storage',data:{hasBlobToken:!!process.env.BLOB_READ_WRITE_TOKEN,applicationId,appSize,hasResume:!!application.resume},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})+'\n';
        fs.appendFileSync(logPath, logEntry, 'utf8');
      }
      // #endregion
      
      try {
        // Store application as JSON file in Blob Storage
        const blobPath = `applications/${applicationId}.json`;
        const blob = await put(blobPath, JSON.stringify(application), {
          access: 'public',
          contentType: 'application/json',
        });
        
        // #region agent log
        if (fs) {
          const logEntry = JSON.stringify({location:'api/applications.ts:90',message:'Blob storage successful',data:{applicationId,blobUrl:blob.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})+'\n';
          fs.appendFileSync(logPath, logEntry, 'utf8');
        }
        // #endregion
        
        console.log('✅ Application stored in Blob Storage:', blob.url);
      } catch (blobError) {
        // #region agent log
        if (fs) {
          const logEntry = JSON.stringify({location:'api/applications.ts:98',message:'Blob storage error',data:{errorMessage:blobError instanceof Error?blobError.message:String(blobError),errorStack:blobError instanceof Error?blobError.stack:undefined,errorName:blobError instanceof Error?blobError.name:undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})+'\n';
          fs.appendFileSync(logPath, logEntry, 'utf8');
        }
        // #endregion
        console.error('Error storing application in Blob:', blobError);
        throw blobError;
      }
    } else {
      // Fallback to in-memory storage if Blob Storage not configured
      console.warn('⚠️ BLOB_READ_WRITE_TOKEN not configured, using fallback storage');
      fallbackStorage.push(application);
      // #region agent log
      if (fs) {
        const logEntry = JSON.stringify({location:'api/applications.ts:110',message:'Using fallback storage',data:{fallbackCount:fallbackStorage.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})+'\n';
        fs.appendFileSync(logPath, logEntry, 'utf8');
      }
      // #endregion
    }

    console.log('✅ Application created successfully:', {
      id: application.id,
      name: application.name,
      email: application.email
    });

    res.status(201).json(application);
  } catch (error) {
    // #region agent log
    const fs = await import('fs').catch(() => null);
    const logPath = 'c:\\Users\\shrey\\OneDrive\\Desktop\\Bucks-Capital\\.cursor\\debug.log';
    if (fs) {
      const logEntry = JSON.stringify({location:'api/applications.ts:66',message:'Error in createApplication',data:{errorMessage:error instanceof Error?error.message:String(error),errorStack:error instanceof Error?error.stack:undefined,errorName:error instanceof Error?error.name:undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})+'\n';
      fs.appendFileSync(logPath, logEntry, 'utf8');
    }
    // #endregion
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
        const applicationsList = await getApplicationsList();
        console.log('📋 Fetching applications from Blob, found:', applicationsList.length);
        
        // Fetch all applications in parallel
        const applicationPromises = applicationsList.map(appId => getApplicationFromBlob(appId));
        const fetchedApplications = await Promise.all(applicationPromises);
        
        // Filter out null results and ensure IDs match
        applications = fetchedApplications
          .filter((app, index) => {
            if (!app) {
              console.warn(`⚠️ Application ${applicationsList[index]} not found in Blob`);
              return false;
            }
            // Ensure ID matches
            if (app.id !== applicationsList[index]) {
              console.warn(`⚠️ ID mismatch: blob has ${applicationsList[index]}, but application.id is ${app.id}`);
              app.id = applicationsList[index];
            }
            return true;
          });
        
        console.log(`✅ Loaded ${applications.length} applications from Blob Storage`);
      } catch (blobError) {
        console.error('Error fetching from Blob Storage:', blobError);
        // Fallback to in-memory storage on error
        applications = fallbackStorage;
        console.warn('⚠️ Falling back to in-memory storage');
      }
    } else {
      // Fallback to in-memory storage
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
        // Delete the application file from Blob Storage
        const blobPath = `applications/${id}.json`;
        
        // First check if it exists
        const existingApp = await getApplicationFromBlob(id);
        if (!existingApp) {
          // Try with app_ prefix if not found
          const appIdWithPrefix = id.startsWith('app_') ? id : `app_${id}`;
          const altApp = await getApplicationFromBlob(appIdWithPrefix);
          if (altApp) {
            // Delete the alternate path
            await del(`applications/${appIdWithPrefix}.json`);
            console.log(`✅ Deleted application: ${appIdWithPrefix}`);
          } else {
            console.warn(`⚠️ Application ${id} not found in Blob Storage`);
            return res.status(404).json({ error: 'Application not found' });
          }
        } else {
          // Delete the blob
          await del(blobPath);
          console.log(`✅ Deleted application from Blob Storage: ${blobPath}`);
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

