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

  const handleSubmit = async (data: ApplicationData) => {
    setIsSubmitting(true);
    
    try {
      // Store the application data in localStorage
      const applications = JSON.parse(localStorage.getItem('bucksCapitalApplications') || '[]');
      
      // Handle file storage - convert File to base64 for localStorage
      let resumeData = null;
      if (data.resume) {
        resumeData = {
          name: data.resume.name,
          type: data.resume.type,
          size: data.resume.size,
          lastModified: data.resume.lastModified,
          data: await fileToBase64(data.resume)
        };
      }
      
      const newApplication = {
        ...data,
        resume: resumeData,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      applications.push(newApplication);
      localStorage.setItem('bucksCapitalApplications', JSON.stringify(applications));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      
      // Auto-close modal after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
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
