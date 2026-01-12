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



    try {
      // Handle file storage - upload to Vercel Blob Storage
      let resumeData = null;
      if (data.resume && data.resume instanceof File) {


        // Convert file to base64 for upload
        const base64Data = await fileToBase64(data.resume);
        // Remove data URL prefix (data:application/pdf;base64,)
        const base64Content = base64Data.split(',')[1] || base64Data;

        // Upload to Vercel Blob Storage
        try {
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
            console.warn('⚠️ Resume upload failed, storing with base64 data:', errorData);
            // Fallback: Store as base64 if upload fails (for backward compatibility)
            resumeData = {
              name: data.resume.name,
              type: data.resume.type,
              size: data.resume.size,
              lastModified: data.resume.lastModified,
              data: base64Data, // Fallback to base64 if blob upload fails
              uploadError: errorData.error || 'Upload failed'
            };
          } else {
            const uploadResult = await uploadResponse.json();

            resumeData = {
              name: data.resume.name,
              type: data.resume.type,
              size: data.resume.size,
              lastModified: data.resume.lastModified,
              url: uploadResult.url, // Store blob URL instead of base64 data
              pathname: uploadResult.pathname
            };
          }
        } catch (uploadError) {
          console.warn('⚠️ Resume upload error, storing with base64 data:', uploadError);
          // Fallback: Store as base64 if upload fails
          resumeData = {
            name: data.resume.name,
            type: data.resume.type,
            size: data.resume.size,
            lastModified: data.resume.lastModified,
            data: base64Data, // Fallback to base64 if blob upload fails
            uploadError: uploadError instanceof Error ? uploadError.message : 'Upload failed'
          };
        }


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



      // Send to API endpoint
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationPayload)
      });



      if (!response.ok) {


        // Safely parse error response - handle cases where response isn't JSON
        let errorData: any = {};
        const contentType = response.headers.get('content-type');
        const responseText = await response.text(); // Read once

        if (contentType && contentType.includes('application/json')) {
          try {
            if (responseText) {
              errorData = JSON.parse(responseText);
            }
          } catch (parseError) {
            // If JSON parsing fails, use status text
            errorData = { error: `Server error (${response.status}): ${response.statusText}`, details: responseText.substring(0, 200) };
          }
        } else {
          // Non-JSON response (like 404 HTML page)
          let errorMsg = `Server error (${response.status}): ${response.statusText || 'Unknown error'}`;

          if (response.status === 404) {
            errorMsg = 'API endpoint not found. The application API routes require Vercel CLI to run in development. Please run "npx vercel dev" instead of "npm run dev", or deploy to Vercel for production use.';
          } else if (response.status === 500) {
            // Try to extract error from HTML if it's an error page
            const errorMatch = responseText.match(/<pre[^>]*>([^<]+)<\/pre>/i) || responseText.match(/Error: ([^\n]+)/i);
            if (errorMatch) {
              errorMsg = `Server error: ${errorMatch[1]}`;
            } else if (responseText.includes('BLOB_READ_WRITE_TOKEN')) {
              errorMsg = 'Blob Storage not configured. Please add Vercel Blob Storage to your project in the Vercel Dashboard.';
            }
          }

          errorData = { error: errorMsg, details: responseText.substring(0, 500) };
        }



        throw new Error(errorData.error || 'Failed to submit application');
      }

      const submittedApplication = await response.json();

      console.log('✅ Application submitted successfully:', submittedApplication);

      setIsSubmitted(true);

      // Auto-close modal after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (error) {

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
