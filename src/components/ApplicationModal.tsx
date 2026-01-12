import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DynamicApplicationForm from './DynamicApplicationForm';
import { CheckCircle, X } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  grade: string;
  gpa: string;
  school: string;
  position: string;
  experience: string;
  motivation: string;
  availability: string;
  additionalInfo?: string;
}

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // #region agent log
    const logData = Object.keys(data).reduce((acc: any, key: string) => {
      const val = data[key];
      acc[key] = {
        type: typeof val,
        isFile: val instanceof File,
        isNull: val === null,
        isUndefined: val === undefined,
        value: val instanceof File ? `[File:${val.name}]` : String(val).substring(0, 100),
        length: typeof val === 'string' ? val.length : undefined
      };
      return acc;
    }, {});
    fetch('http://127.0.0.1:7242/ingest/74f189f6-03bb-4080-9d31-a84bf6d202fb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'ApplicationModal.tsx:47',
        message: 'handleSubmit entry - raw form data',
        data: { rawData: logData },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'B'
      })
    }).catch(() => {});
    // #endregion
    
    try {
      // Handle file storage - upload to Vercel Blob Storage
      let resumeData = null;
      if (data.resume && data.resume instanceof File) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/74f189f6-03bb-4080-9d31-a84bf6d202fb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'ApplicationModal.tsx:82',
            message: 'Processing file for upload',
            data: {
              fileName: data.resume.name,
              fileType: data.resume.type,
              fileSize: data.resume.size,
              isFile: data.resume instanceof File
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'D'
          })
        }).catch(() => {});
        // #endregion
        
        // Convert file to base64 for upload
        const base64Data = await fileToBase64(data.resume);
        // Remove data URL prefix (data:application/pdf;base64,)
        const base64Content = base64Data.split(',')[1] || base64Data;
        
        // Upload to Vercel Blob Storage
        const uploadResponse = await fetch('/api/resume-upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: `resumes/${Date.now()}_${data.resume.name}`,
            contentType: data.resume.type,
            fileData: base64Content
          })
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to upload resume file');
        }

        const uploadResult = await uploadResponse.json();
        
        resumeData = {
          name: data.resume.name,
          type: data.resume.type,
          size: data.resume.size,
          lastModified: data.resume.lastModified,
          url: uploadResult.url, // Store blob URL instead of base64 data
          pathname: uploadResult.pathname
        };
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/74f189f6-03bb-4080-9d31-a84bf6d202fb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'ApplicationModal.tsx:120',
            message: 'File uploaded to Blob Storage',
            data: {
              resumeDataName: resumeData.name,
              resumeDataUrl: resumeData.url,
              resumeDataPathname: resumeData.pathname
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'D'
          })
        }).catch(() => {});
        // #endregion
      }
      
      // Prepare application data for API
      const applicationPayload = {
        name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        email: data.email,
        grade: data.grade,
        highSchoolName: data.highSchoolName || data.school,
        availablePositions: data.availablePositions || data.position,
        businessFinanceExperience: data.businessFinanceExperience || data.experience,
        resume: resumeData,
        uniqueQuality: data.uniqueQuality || data.motivation,
        commitmentAgreement: data.commitmentAgreement || false,
        status: 'pending'
      };

      // #region agent log
      const payloadLogData = Object.keys(applicationPayload).reduce((acc: any, key: string) => {
        const val = applicationPayload[key];
        acc[key] = {
          type: typeof val,
          isNull: val === null,
          isUndefined: val === undefined,
          value: typeof val === 'string' ? val.substring(0, 100) : typeof val === 'object' && val !== null ? `[Object:${Object.keys(val).join(',')}]` : String(val),
          length: typeof val === 'string' ? val.length : undefined
        };
        return acc;
      }, {});
      fetch('http://127.0.0.1:7242/ingest/74f189f6-03bb-4080-9d31-a84bf6d202fb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'ApplicationModal.tsx:111',
          message: 'Payload before API call',
          data: { payload: payloadLogData },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'B'
        })
      }).catch(() => {});
      // #endregion

      // Send to API endpoint
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationPayload)
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/74f189f6-03bb-4080-9d31-a84bf6d202fb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'ApplicationModal.tsx:125',
          message: 'API response received',
          data: {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries())
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'B'
        })
      }).catch(() => {});
      // #endregion

      if (!response.ok) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/74f189f6-03bb-4080-9d31-a84bf6d202fb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'ApplicationModal.tsx:201',
            message: 'API error response received',
            data: { 
              status: response.status, 
              statusText: response.statusText,
              contentType: response.headers.get('content-type'),
              url: response.url
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'B'
          })
        }).catch(() => {});
        // #endregion
        
        // Safely parse error response - handle cases where response isn't JSON
        let errorData: any = {};
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const text = await response.text();
            if (text) {
              errorData = JSON.parse(text);
            }
          } catch (parseError) {
            // If JSON parsing fails, use status text
            errorData = { error: `Server error (${response.status}): ${response.statusText}` };
          }
        } else {
          // Non-JSON response (like 404 HTML page)
          const text = await response.text();
          errorData = { 
            error: response.status === 404 
              ? 'API endpoint not found. The application API routes require Vercel CLI to run in development. Please run "npx vercel dev" instead of "npm run dev", or deploy to Vercel for production use.'
              : `Server error (${response.status}): ${response.statusText || 'Unknown error'}`
          };
        }
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/74f189f6-03bb-4080-9d31-a84bf6d202fb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'ApplicationModal.tsx:230',
            message: 'Parsed error data',
            data: { errorData, status: response.status },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'B'
          })
        }).catch(() => {});
        // #endregion
        
        throw new Error(errorData.error || 'Failed to submit application');
      }

      const submittedApplication = await response.json();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/74f189f6-03bb-4080-9d31-a84bf6d202fb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'ApplicationModal.tsx:210',
          message: 'Application submitted successfully',
          data: { applicationId: submittedApplication.id },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'B'
        })
      }).catch(() => {});
      // #endregion
      console.log('✅ Application submitted successfully:', submittedApplication);
      
      setIsSubmitted(true);
      
      // Auto-close modal after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
      
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/74f189f6-03bb-4080-9d31-a84bf6d202fb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'ApplicationModal.tsx:246',
          message: 'Error caught in handleSubmit',
          data: {
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
            errorName: error instanceof Error ? error.name : undefined
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'B'
        })
      }).catch(() => {});
      // #endregion
      console.error('Error submitting application:', error);
      alert(`There was an error submitting your application: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Application Form</DialogTitle>
          <DialogDescription>
            Fill out the application form to join Bucks Capital
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 h-8 w-8 p-0 hover:bg-gray-100"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {isSubmitted ? (
            // Success state
            <div className="p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Application Submitted Successfully!
              </h2>
              <p className="text-lg text-foreground/80 mb-6">
                Thank you for your interest in joining Bucks Capital. We've received your application and will review it carefully.
              </p>
              <p className="text-foreground/60 mb-8">
                You can expect to hear back from us within 1-2 weeks. If you have any questions, feel free to contact us at{' '}
                <a href="mailto:info@buckscapital.org" className="text-primary hover:underline">
                  info@buckscapital.org
                </a>
              </p>
              <div className="text-sm text-foreground/50">
                This window will close automatically in a few seconds...
              </div>
            </div>
          ) : (
            // Application form
            <DynamicApplicationForm onSubmit={handleSubmit} isLoading={isSubmitting} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
