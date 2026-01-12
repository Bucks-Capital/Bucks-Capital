// Form configuration for Bucks Capital application
// This can be easily updated to match the Google Form questions

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'radio' | 'checkbox' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  checkboxText?: string; // For checkbox fields
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    accept?: string; // For file uploads
  };
  description?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  fields: FormField[];
}

// Updated form configuration to match the Google Form questions
export const formSections: FormSection[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic contact and personal details',
    icon: 'User',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Enter your full name',
        required: true,
        validation: { minLength: 2 }
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'your.email@example.com',
        required: true
      }
    ]
  },
  {
    id: 'academic',
    title: 'Academic Information',
    description: 'Your educational background',
    icon: 'GraduationCap',
    fields: [
      {
        id: 'grade',
        type: 'select',
        label: 'Grade',
        placeholder: 'Select your grade',
        required: true,
        options: ['Freshman', 'Sophomore', 'Junior', 'Senior']
      },
      {
        id: 'highSchoolName',
        type: 'text',
        label: 'High School Name',
        placeholder: 'Enter your high school name',
        required: true,
        validation: { minLength: 2 }
      }
    ]
  },
  {
    id: 'position',
    title: 'Position & Experience',
    description: 'Tell us about your interest and experience',
    icon: 'Briefcase',
    fields: [
      {
        id: 'availablePositions',
        type: 'select',
        label: 'Available Positions',
        placeholder: 'Select a position',
        required: true,
        options: [
          'Macro Analyst',
          'Equity Analyst',
          'Quantitative Analyst'
        ]
      },
      {
        id: 'businessFinanceExperience',
        type: 'textarea',
        label: 'Any Business/Finance Experience?',
        placeholder: 'Describe any relevant business or finance experience you have...',
        required: true,
        validation: { minLength: 10 }
      },
      {
        id: 'resume',
        type: 'file',
        label: 'Resume (PDF, TXT, DOCX)',
        placeholder: 'Upload your resume as a PDF, TXT, or DOCX',
        required: true,
        validation: {
          accept: '.pdf,.txt,.docx'
        }
      },
      {
        id: 'uniqueQuality',
        type: 'textarea',
        label: 'What is one quality or unique experience that other applicants may lack compared to you?',
        placeholder: 'Tell us what makes you unique and valuable to Bucks Capital...',
        required: true,
        validation: { minLength: 20 }
      }
    ]
  },
  {
    id: 'commitment',
    title: 'Commitment Agreement',
    description: 'Please confirm your understanding of the time commitment',
    icon: 'Calendar',
    fields: [
      {
        id: 'commitmentAgreement',
        type: 'checkbox',
        label: 'Understand that Bucks Capital can be a large time commitment and investment. While we are flexible in our schedules, we expect a certain amount of contribution from each member in order to further Bucks Capital.',
        checkboxText: 'I Understand.',
        required: true
      }
    ]
  }
];

// Generate Zod schema from form configuration
export const generateFormSchema = () => {
  const schemaFields: Record<string, any> = {};
  
  formSections.forEach(section => {
    section.fields.forEach(field => {
      let fieldSchema;
      
      switch (field.type) {
        case 'email':
          fieldSchema = field.required 
            ? z.string().trim().email('Please enter a valid email address')
            : z.string().trim().email('Please enter a valid email address').optional();
          break;
        case 'select':
          if (field.options && field.options.length > 0) {
            // Validate that the value is one of the allowed options (case-insensitive, trimmed)
            fieldSchema = field.required
              ? z.string().trim().refine(
                  (val) => field.options!.some(opt => opt.trim().toLowerCase() === val.trim().toLowerCase()),
                  { message: `Please select a valid ${field.label.toLowerCase()}` }
                )
              : z.string().trim().refine(
                  (val) => !val || field.options!.some(opt => opt.trim().toLowerCase() === val.trim().toLowerCase()),
                  { message: `Please select a valid ${field.label.toLowerCase()}` }
                ).optional();
          } else {
            // Fallback if no options provided
            fieldSchema = field.required
              ? z.string().trim().min(1, `${field.label} is required.`)
              : z.string().trim().optional();
          }
          break;
        case 'number':
          fieldSchema = field.required
            ? z.string().trim().min(1, `${field.label} is required.`)
            : z.string().trim().optional();
          break;
        case 'textarea':
          fieldSchema = field.required
            ? z.string().trim().min(field.validation?.minLength || 1, `${field.label} is required.`)
            : z.string().trim().optional();
          break;
        case 'file':
          fieldSchema = field.required
            ? z.any().refine((file) => file && file !== null, `${field.label} is required.`)
            : z.any().optional();
          break;
        case 'checkbox':
          fieldSchema = field.required
            ? z.boolean().refine((val) => val === true, `You must agree to ${field.label}`)
            : z.boolean().optional();
          break;
        default:
          fieldSchema = field.required
            ? z.string().trim().min(field.validation?.minLength || 1, `${field.label} is required.`)
            : z.string().trim().optional();
      }
      
      schemaFields[field.id] = fieldSchema;
    });
  });
  
  return z.object(schemaFields);
};

// Import zod for schema generation
import * as z from 'zod';
