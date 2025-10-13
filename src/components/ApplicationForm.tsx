import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { GraduationCap, User, Mail, Phone, MapPin, Calendar, Briefcase, FileText } from 'lucide-react';

// Form validation schema
const applicationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  grade: z.string().min(1, 'Please select your grade'),
  gpa: z.string().min(1, 'Please enter your GPA'),
  school: z.string().min(1, 'Please enter your school'),
  position: z.string().min(1, 'Please select a position'),
  experience: z.string().min(10, 'Please provide at least 10 characters about your experience'),
  motivation: z.string().min(20, 'Please provide at least 20 characters about your motivation'),
  availability: z.string().min(1, 'Please select your availability'),
  additionalInfo: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  onSubmit: (data: ApplicationFormData) => void;
  isLoading?: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit, isLoading = false }) => {
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      grade: '',
      gpa: '',
      school: '',
      position: '',
      experience: '',
      motivation: '',
      availability: '',
      additionalInfo: '',
    },
  });

  const handleSubmit = (data: ApplicationFormData) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Join Bucks Capital</h2>
        <p className="text-foreground/80 text-lg">
          Fill out the application form below to join our investment program
        </p>
      </div>

      <Card className="p-8 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="email" 
                            placeholder="your.email@example.com" 
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="tel" 
                            placeholder="(555) 123-4567" 
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <GraduationCap className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-foreground">Academic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="9">9th Grade</SelectItem>
                          <SelectItem value="10">10th Grade</SelectItem>
                          <SelectItem value="11">11th Grade</SelectItem>
                          <SelectItem value="12">12th Grade</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPA *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          max="4" 
                          placeholder="3.5" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Central Bucks High School West" 
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Position and Experience Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Briefcase className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-foreground">Position & Experience</h3>
              </div>
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position of Interest *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="equity-analyst">Equity Analyst</SelectItem>
                        <SelectItem value="macro-analyst">Macro Analyst</SelectItem>
                        <SelectItem value="head-of-equity">Head of Equity</SelectItem>
                        <SelectItem value="general-member">General Member</SelectItem>
                        <SelectItem value="other">Other (specify in additional info)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relevant Experience *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe any relevant experience in finance, business, or investing. Include any clubs, courses, or personal projects..."
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why do you want to join Bucks Capital? *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain your interest in finance, what you hope to learn, and how you plan to contribute to the team..."
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Availability Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-foreground">Availability</h3>
              </div>
              
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Meeting Availability *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible - any day/time</SelectItem>
                        <SelectItem value="weekdays-morning">Weekdays - Morning</SelectItem>
                        <SelectItem value="weekdays-afternoon">Weekdays - Afternoon</SelectItem>
                        <SelectItem value="weekdays-evening">Weekdays - Evening</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                        <SelectItem value="specific">Specific times (explain below)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Information Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-foreground">Additional Information</h3>
              </div>
              
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information you'd like to share, specific time constraints, or questions you have..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold px-12 py-4 rounded-full transition-all duration-300 hover:shadow-xl text-lg min-w-[200px]"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ApplicationForm;
