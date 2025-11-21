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
      // Handle file storage - convert File to base64
      let resumeData = null;
      if (data.resume && data.resume instanceof File) {
        resumeData = {
          name: data.resume.name,
          type: data.resume.type,
          size: data.resume.size,
          lastModified: data.resume.lastModified,
          data: await fileToBase64(data.resume)
        };
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
        const errorData = await response.json();
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
