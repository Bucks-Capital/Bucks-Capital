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
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { GraduationCap, User, Mail, Phone, MapPin, Calendar, Briefcase, FileText, LucideIcon, Upload, CheckSquare } from 'lucide-react';
import { formSections, generateFormSchema, FormField as ConfigFormField } from '@/config/formConfig';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  GraduationCap,
  Upload,
  CheckSquare,
};

interface DynamicApplicationFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const DynamicApplicationForm: React.FC<DynamicApplicationFormProps> = ({ onSubmit, isLoading = false }) => {
  const formSchema = generateFormSchema();
  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formSections.reduce((acc, section) => {
      section.fields.forEach(field => {
        if (field.type === 'checkbox') {
          acc[field.id] = false;
        } else if (field.type === 'file') {
          acc[field.id] = null;
        } else {
          acc[field.id] = '';
        }
      });
      return acc;
    }, {} as any),
    mode: 'onChange', // This will help with real-time validation
  });

  const handleSubmit = (data: FormData) => {
    // #region agent log
    const formLogData = Object.keys(data).reduce((acc: any, key: string) => {
      const val = data[key];
      acc[key] = {
        type: typeof val,
        isFile: val instanceof File,
        isNull: val === null,
        isUndefined: val === undefined,
        value: val instanceof File ? `[File:${val.name}]` : String(val).substring(0, 100),
        length: typeof val === 'string' ? val.length : undefined,
        charCodes: typeof val === 'string' ? Array.from(val.substring(0, 20)).map(c => c.charCodeAt(0)) : undefined
      };
      return acc;
    }, {});
    fetch('http://127.0.0.1:7242/ingest/74f189f6-03bb-4080-9d31-a84bf6d202fb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'DynamicApplicationForm.tsx:69',
        message: 'Form submit - raw data before processing',
        data: { formData: formLogData },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A'
      })
    }).catch(() => {});
    // #endregion
    onSubmit(data);
  };

  const renderField = (field: ConfigFormField) => {
    const commonProps = {
      control: form.control,
      name: field.id,
      render: ({ field: formField }: any) => (
        <FormItem>
          {field.type !== 'checkbox' && (
            <FormLabel className="text-black">
              {field.label} {field.required && '*'}
            </FormLabel>
          )}
          <FormControl>
            {field.type === 'textarea' ? (
              <Textarea 
                placeholder={field.placeholder}
                className="min-h-[120px]"
                {...formField}
              />
            ) : field.type === 'select' ? (
              <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === 'file' ? (
              <div className="flex flex-col gap-2">
                <Input 
                  type="file"
                  accept={field.validation?.accept || ".pdf"}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    formField.onChange(file);
                  }}
                  className="h-20 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {formField.value && (
                  <span className="text-sm text-primary flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    {formField.value.name}
                  </span>
                )}
              </div>
            ) : field.type === 'checkbox' ? (
              <div className="space-y-3">
                <p className="text-sm text-black">{field.label}</p>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={field.id}
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                  <label 
                    htmlFor={field.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {field.checkboxText || 'I agree'}
                  </label>
                </div>
              </div>
            ) : (
              <Input 
                type={field.type}
                placeholder={field.placeholder}
                {...formField}
              />
            )}
          </FormControl>
          {field.description && (
            <FormDescription>{field.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      ),
    };

    return <FormField key={field.id} {...commonProps} />;
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
          Fill out the application form below to join Bucks Capital.
        </p>
      </div>

      {/* Position Descriptions Information Box */}
      <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Position Descriptions</h3>
            <div className="space-y-4 text-sm text-primary/80">
              <div>
                <h4 className="font-semibold text-primary mb-1">Equity Analyst</h4>
                <p>Manages coverage of 1–3 equity positions within the portfolio. Requires a solid understanding of fundamental analysis and familiarity with technical indicators to support idea generation, valuation, and ongoing position monitoring.</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-1">Macro Analyst</h4>
                <p>Analyzes macroeconomic trends and their impact on markets, with focus areas including global economic indicators, geopolitical developments, currency markets, and overall market structure. Responsible for generating actionable insights that inform portfolio allocation and risk positioning.</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-1">Quantitative Analyst</h4>
                <p>Focuses on risk analytics, development of tools and GUIs, and backtesting strategies for both the Macro and Equity teams. Must have proficiency in Python and general coding skills, along with a working knowledge of financial statistics and modeling techniques.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {
            // #region agent log
            const errorLogData = Object.keys(errors).reduce((acc: any, key: string) => {
              const error = errors[key];
              acc[key] = {
                message: error?.message,
                type: error?.type,
                value: error?.ref?.value,
                valueType: typeof error?.ref?.value,
                valueLength: typeof error?.ref?.value === 'string' ? error?.ref?.value.length : undefined,
                charCodes: typeof error?.ref?.value === 'string' ? Array.from(error.ref.value.substring(0, 50)).map((c: string) => c.charCodeAt(0)) : undefined
              };
              return acc;
            }, {});
            console.error('Form validation errors:', errorLogData);
            fetch('http://127.0.0.1:7242/ingest/74f189f6-03bb-4080-9d31-a84bf6d202fb', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'DynamicApplicationForm.tsx:230',
                message: 'Form validation errors',
                data: { errors: errorLogData, allErrors: errors },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'A'
              })
            }).catch(() => {});
            // #endregion
          })} className="space-y-8">
            {formSections.map((section) => {
              const IconComponent = iconMap[section.icon || 'User'];
              
              return (
                <div key={section.id} className="space-y-6">
                  <div className="flex items-center mb-4">
                    {IconComponent && <IconComponent className="h-5 w-5 text-primary mr-2" />}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
                      {section.description && (
                        <p className="text-foreground/70 text-sm mt-1">{section.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className={`grid gap-6 ${
                    section.fields.length === 1 ? 'grid-cols-1' :
                    section.fields.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {section.fields.map(renderField)}
                  </div>
                </div>
              );
            })}

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

export default DynamicApplicationForm;
