import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, Trash2, Download, Calendar, User, Mail, Phone, GraduationCap, MapPin, FileText, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown, Home, LogOut, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ApplicationData {
  id: string;
  name: string;
  email: string;
  grade: string;
  highSchoolName: string;
  availablePositions: string;
  businessFinanceExperience: string;
  resume: {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    data?: string; // base64 data (legacy format)
    url?: string; // blob storage URL (new format)
    pathname?: string; // blob pathname
  } | null;
  uniqueQuality: string;
  commitmentAgreement: boolean;
  submittedAt: string;
  status: string;
}

type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'email-asc' | 'email-desc' | 'position-asc' | 'position-desc';

interface ApplicationViewerProps {
  onLogout?: () => void;
}

const ApplicationViewer: React.FC<ApplicationViewerProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);


  useEffect(() => {
    loadApplications();
    // Set up polling to refresh applications every 30 seconds
    const interval = setInterval(loadApplications, 30000);
    return () => clearInterval(interval);
  }, []);

  const migrateLocalStorageToAPI = async () => {
    const stored = localStorage.getItem('bucksCapitalApplications');
    if (!stored) return;

    try {
      const localApps = JSON.parse(stored);
      if (!Array.isArray(localApps) || localApps.length === 0) return;

      console.log(`🔄 Migrating ${localApps.length} applications from localStorage to API...`);
      
      // Migrate each application to the API
      for (const app of localApps) {
        try {
          // Check if application already exists in API (by checking if it has the new ID format)
          // If it's an old localStorage ID (numeric string), migrate it
          if (!app.id || !app.id.startsWith('app_')) {
            const response = await fetch('/api/applications', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...app,
                // Ensure all required fields are present
                name: app.name || 'Unknown',
                email: app.email || 'unknown@example.com',
                status: app.status || 'pending'
              })
            });

            if (response.ok) {
              console.log(`✅ Migrated application: ${app.name || app.id}`);
            }
          }
        } catch (error) {
          console.error(`Error migrating application ${app.id}:`, error);
        }
      }

      // After successful migration, clear localStorage (optional - you might want to keep it as backup)
      // localStorage.removeItem('bucksCapitalApplications');
      console.log('✅ Migration complete');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  };

  const loadApplications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📥 Loading applications from database...');
      const response = await fetch('/api/applications', {
        cache: 'no-store', // Prevent caching
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      if (response.ok) {
        if (isJson) {
          try {
            const data = await response.json();
            console.log(`📥 Loaded ${data?.length || 0} applications from database`);
            console.log('📋 Application IDs:', data?.map((app: any) => app.id) || []);
            setApplications(data || []);
            
            // If API returns empty but localStorage has data, try to migrate
            if (data.length === 0) {
              const stored = localStorage.getItem('bucksCapitalApplications');
              if (stored) {
                try {
                  const localApps = JSON.parse(stored);
                  if (localApps.length > 0) {
                    // Show localStorage data temporarily while migrating
                    setApplications(localApps);
                    // Migrate in background
                    migrateLocalStorageToAPI().then(() => {
                      // Reload after migration
                      loadApplications();
                    });
                  }
                } catch (e) {
                  console.error('Failed to parse localStorage data:', e);
                }
              }
            }
          } catch (jsonError) {
            console.error('Failed to parse JSON response:', jsonError);
            const text = await response.text();
            console.error('Response text:', text.substring(0, 200));
            throw new Error('Invalid JSON response from server');
          }
        } else {
          // Response is not JSON, might be HTML error page
          const text = await response.text();
          console.error('Non-JSON response received:', text.substring(0, 200));
          
          // Check if it's an HTML error page
          if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
            throw new Error('API endpoint returned HTML instead of JSON. The /api/applications endpoint may not be deployed or configured correctly. Please check your Vercel deployment.');
          } else {
            throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
          }
        }
      } else {
        // Error response - try to parse as JSON, but handle non-JSON gracefully
        let errorData;
        if (isJson) {
          try {
            errorData = await response.json();
          } catch (e) {
            const text = await response.text();
            console.error('Error response text:', text.substring(0, 200));
            errorData = { error: response.statusText || 'Unknown error' };
          }
        } else {
          const text = await response.text();
          console.error('Error response (non-JSON):', text.substring(0, 200));
          errorData = { error: `Server error (${response.status}): ${response.statusText}` };
        }
        throw new Error(errorData.error || 'Failed to load applications from database');
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load applications';
      setError(errorMessage);
      
      // Fallback to localStorage for backward compatibility
      const stored = localStorage.getItem('bucksCapitalApplications');
      if (stored) {
        try {
          const localApps = JSON.parse(stored);
          setApplications(localApps);
          console.warn('Using localStorage fallback. Data may not be synced across devices.');
          // Clear the error since we have fallback data
          setError(null);
        } catch (e) {
          console.error('Failed to parse localStorage data:', e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sortApplications = (apps: ApplicationData[], sortOption: SortOption): ApplicationData[] => {
    const sorted = [...apps];
    
    switch (sortOption) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'email-asc':
        return sorted.sort((a, b) => a.email.localeCompare(b.email));
      case 'email-desc':
        return sorted.sort((a, b) => b.email.localeCompare(a.email));
      case 'position-asc':
        return sorted.sort((a, b) => a.availablePositions.localeCompare(b.availablePositions));
      case 'position-desc':
        return sorted.sort((a, b) => b.availablePositions.localeCompare(a.availablePositions));
      default:
        return sorted;
    }
  };

  const sortedApplications = sortApplications(applications, sortBy);

  const handleDeleteClick = (id: string) => {
    setApplicationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const deleteApplication = async () => {
    if (!applicationToDelete) {
      console.error('❌ No application ID to delete');
      return;
    }

    // Find the application to verify the ID format
    const appToDelete = applications.find(app => app.id === applicationToDelete);
    console.log('🗑️ Attempting to delete application:', {
      id: applicationToDelete,
      found: !!appToDelete,
      allIds: applications.map(app => app.id),
      appDetails: appToDelete ? { id: appToDelete.id, name: appToDelete.name } : null
    });

    try {
      const deleteUrl = `/api/applications?id=${encodeURIComponent(applicationToDelete)}`;
      console.log('📡 Delete URL:', deleteUrl);
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Prevent caching
      });

      console.log('📡 Delete response status:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Delete successful:', result);
        
        // Immediately update UI by removing the deleted application from state
        // This provides instant feedback while we reload from database
        const beforeCount = applications.length;
        const updatedApps = applications.filter(app => app.id !== applicationToDelete);
        const afterCount = updatedApps.length;
        setApplications(updatedApps);
        console.log(`🔄 Updated UI: ${beforeCount} -> ${afterCount} applications (removed ${applicationToDelete})`);
        
        // Close modal if the deleted application was selected
        if (selectedApplication?.id === applicationToDelete) {
          setIsModalOpen(false);
          setSelectedApplication(null);
        }
        
        setDeleteDialogOpen(false);
        setApplicationToDelete(null);
        
        // Small delay before reload to ensure database operation completes
        setTimeout(async () => {
          console.log('🔄 Reloading applications from database...');
          await loadApplications();
        }, 500);
      } else {
        // Try to parse error response as JSON, but handle non-JSON gracefully
        let errorData;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            const text = await response.text();
            console.error('❌ Delete error response (non-JSON):', text.substring(0, 200));
            errorData = { error: response.statusText || 'Failed to delete application' };
          }
        } catch (e) {
          console.error('❌ Error parsing delete error response:', e);
          errorData = { error: response.statusText || 'Failed to delete application' };
        }
        throw new Error(errorData.error || 'Failed to delete application');
      }
    } catch (error) {
      console.error('❌ Error deleting application:', error);
      alert(`Failed to delete application: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
    }
  };

  // Helper function to convert base64 data back to File object
  const base64ToFile = (base64Data: string, filename: string, mimeType: string): File => {
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: mimeType });
  };

  const downloadResume = (resumeData: any) => {
    if (!resumeData) return;
    
    // New format: Use blob URL directly
    if (resumeData.url) {
      const a = document.createElement('a');
      a.href = resumeData.url;
      a.download = resumeData.name;
      a.target = '_blank';
      a.click();
    } 
    // Legacy format: Convert base64 to blob URL
    else if (resumeData.data) {
      const file = base64ToFile(
        resumeData.data, 
        resumeData.name, 
        resumeData.type
      );
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = resumeData.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const openPdfViewer = (resumeData: any) => {
    console.log('openPdfViewer called with:', resumeData);
    if (resumeData) {
      // New format: Use blob URL directly
      if (resumeData.url) {
        console.log('Using blob URL:', resumeData.url);
        setPdfUrl(resumeData.url);
        setIsPdfViewerOpen(true);
      } 
      // Legacy format: Convert base64 to blob URL
      else if (resumeData.data) {
        console.log('Converting base64 to file...');
        const file = base64ToFile(resumeData.data, resumeData.name, resumeData.type);
        console.log('Created file:', file);
        const url = URL.createObjectURL(file);
        console.log('Created URL:', url);
        setPdfUrl(url);
        setIsPdfViewerOpen(true);
        console.log('PDF viewer should be open now');
      } else {
        console.log('No resume data or URL missing');
      }
    } else {
      console.log('No resume data');
    }
  };

  const closePdfViewer = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setIsPdfViewerOpen(false);
  };

  const handleClearAllClick = () => {
    setClearAllDialogOpen(true);
  };

  const clearAllApplications = async () => {
    console.log('🗑️ Attempting to clear all applications:', applications.length);
    
    try {
      // Delete each application via API
      const deletePromises = applications.map(async (app) => {
        try {
          console.log('🗑️ Deleting application:', app.id);
          const response = await fetch(`/api/applications?id=${encodeURIComponent(app.id)}`, { 
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Failed to delete ${app.id}:`, response.status, errorText);
            return { success: false, id: app.id, error: response.statusText };
          }
          
          const result = await response.json();
          console.log('✅ Deleted application:', app.id, result);
          return { success: true, id: app.id };
        } catch (error) {
          console.error(`❌ Error deleting ${app.id}:`, error);
          return { success: false, id: app.id, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      });
      
      const results = await Promise.all(deletePromises);
      
      // Check if any deletions failed
      const failures = results.filter(r => !r.success);
      const successes = results.filter(r => r.success);
      
      console.log(`✅ Deleted ${successes.length} applications, ${failures.length} failed`);
      
      if (failures.length > 0) {
        console.warn('⚠️ Some applications failed to delete:', failures);
        alert(`${successes.length} applications deleted, but ${failures.length} failed to delete. Please refresh and try again.`);
      }
      
      // Immediately clear UI state
      setApplications([]);
      setSelectedApplication(null);
      setIsModalOpen(false);
      setIsPdfViewerOpen(false);
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
      
      // Also clear localStorage for backward compatibility
      localStorage.removeItem('bucksCapitalApplications');
      
      setClearAllDialogOpen(false);
      
      // Reload from database to ensure consistency (in background)
      // This ensures we have the latest data, but UI is already cleared
      loadApplications().catch(error => {
        console.error('Error reloading applications after clear all:', error);
        // If reload fails, we already cleared the UI, so it's okay
      });
    } catch (error) {
      console.error('❌ Error clearing applications:', error);
      alert(`Failed to clear all applications: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setClearAllDialogOpen(false);
    }
  };

  const exportApplications = () => {
    const csvContent = [
      ['Name', 'Email', 'Grade', 'High School', 'Position', 'Submitted At', 'Status'],
      ...applications.map(app => [
        app.name,
        app.email,
        app.grade,
        app.highSchoolName,
        app.availablePositions,
        new Date(app.submittedAt).toLocaleDateString(),
        app.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bucks-capital-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-primary/10 text-primary';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Application Viewer</h1>
          <p className="text-sm sm:text-base text-foreground/80">Loading applications...</p>
        </div>
        <Card className="p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Loading...</h2>
          <p className="text-sm sm:text-base text-foreground/80">Fetching applications from database</p>
        </Card>
      </div>
    );
  }

  if (error && applications.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Application Viewer</h1>
            <p className="text-sm sm:text-base text-foreground/80 text-red-600">Error: {error}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={loadApplications}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 flex-1 sm:flex-initial"
            >
              Retry
            </Button>
            {onLogout && (
              <Button 
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 flex-1 sm:flex-initial"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            )}
          </div>
        </div>
        <Card className="p-6 sm:p-8 text-center border-red-200 bg-red-50">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Failed to Load Applications</h2>
          <p className="text-sm sm:text-base text-foreground/80 mb-4">{error}</p>
          <Button onClick={loadApplications} variant="default" className="w-full sm:w-auto">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Application Viewer</h1>
            <p className="text-sm sm:text-base text-foreground/80">
              0 applications submitted
            </p>
          </div>
          <div className="flex gap-2">
            {onLogout && (
              <Button 
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 flex-1 sm:flex-initial"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            )}
          </div>
        </div>
        <Card className="p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">No Applications Yet</h2>
          <p className="text-sm sm:text-base text-foreground/80">
            Applications will appear here once students start submitting them.
          </p>
        </Card>
        <div className="flex justify-center mt-6">
          <Button 
            onClick={() => {
              console.log('Home button clicked');
              navigate('/');
            }}
            variant="default"
            size="default"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Button 
            onClick={() => {
              console.log('Home button clicked');
              navigate('/');
            }}
            variant="default"
            size="default"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
          >
            <Home className="h-4 w-4" />
            <span className="sm:inline">Home</span>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Application Viewer</h1>
            <p className="text-sm sm:text-base text-foreground/80">
              {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
            </p>
          </div>
        </div>
      </div>

      {/* Controls Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center mb-6">
        {/* Sort Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {sortBy.includes('asc') ? (
            <ArrowUp className="h-4 w-4 text-gray-500 flex-shrink-0" />
          ) : sortBy.includes('desc') ? (
            <ArrowDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
          ) : (
            <ArrowUpDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
          )}
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">📅 Newest First</SelectItem>
              <SelectItem value="oldest">📅 Oldest First</SelectItem>
              <SelectItem value="name-asc">👤 Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">👤 Name (Z-A)</SelectItem>
              <SelectItem value="email-asc">📧 Email (A-Z)</SelectItem>
              <SelectItem value="email-desc">📧 Email (Z-A)</SelectItem>
              <SelectItem value="position-asc">💼 Position (A-Z)</SelectItem>
              <SelectItem value="position-desc">💼 Position (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons - Mobile Responsive */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button 
            onClick={loadApplications}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 flex-1 sm:flex-initial"
            disabled={isLoading}
            title="Refresh applications from database"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          {onLogout && (
            <Button 
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 flex-1 sm:flex-initial"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          )}
          <Button 
            onClick={exportApplications} 
            className="flex items-center gap-2 flex-1 sm:flex-initial"
            disabled={applications.length === 0}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button 
            onClick={handleClearAllClick}
            variant="destructive"
            className="flex items-center gap-2 flex-1 sm:flex-initial"
            disabled={applications.length === 0 || isLoading}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear All</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedApplications.map((application) => (
          <Card key={application.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                    {application.name}
                  </h3>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm text-foreground/80">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{application.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 flex-shrink-0" />
                    {application.grade}
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{application.highSchoolName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </div>
                  <div className="font-medium text-primary">
                    Position: {application.availablePositions}
                  </div>
                  {application.resume && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      Resume uploaded
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 sm:ml-4 sm:flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedApplication(application);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 flex-1 sm:flex-initial"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">View</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(application.id)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 flex-1 sm:flex-initial"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteApplication}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
        <AlertDialogContent className="max-w-md mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Applications</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete ALL {applications.length} application{applications.length !== 1 ? 's' : ''}? This action cannot be undone and will permanently remove all application data from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearAllApplications}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50 ${isModalOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-2 sm:m-4">
              <div className="p-4 sm:p-6 border-b">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 truncate">
                      {selectedApplication.name}
                    </h2>
                    <Badge className={getStatusColor(selectedApplication.status)}>
                      {selectedApplication.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-shrink-0"
                  >
                    ×
                  </Button>
                </div>
              </div>
            
            <div className="p-4 sm:p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Email</label>
                    <p className="text-foreground">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Grade</label>
                    <p className="text-foreground">{selectedApplication.grade}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-foreground/80">High School</label>
                    <p className="text-foreground">{selectedApplication.highSchoolName}</p>
                  </div>
                </div>
              </div>

              {/* Position and Experience */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Position & Experience</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Available Position</label>
                    <p className="text-foreground">{selectedApplication.availablePositions}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Business/Finance Experience</label>
                    <p className="text-foreground whitespace-pre-wrap">{selectedApplication.businessFinanceExperience}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Resume</label>
                    <div className="flex items-center gap-2">
                      <p className="text-foreground">
                        {selectedApplication.resume ? selectedApplication.resume.name : 'No file uploaded'}
                      </p>
                      {selectedApplication.resume && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              console.log('View button clicked, resume data:', selectedApplication.resume);
                              openPdfViewer(selectedApplication.resume);
                            }}
                            className="text-xs flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              downloadResume(selectedApplication.resume);
                            }}
                            className="text-xs flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Unique Quality/Experience</label>
                    <p className="text-foreground whitespace-pre-wrap">{selectedApplication.uniqueQuality}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Commitment Agreement</label>
                    <p className="text-foreground">
                      {selectedApplication.commitmentAgreement ? 'Agreed' : 'Not agreed'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submission Info */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Submission Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Submitted At</label>
                    <p className="text-foreground">
                      {new Date(selectedApplication.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/80">Application ID</label>
                    <p className="text-foreground font-mono text-sm">{selectedApplication.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {isPdfViewerOpen && pdfUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedApplication?.resume?.type === 'application/pdf' ? 'Resume Preview' : 'Resume File'}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    downloadResume(selectedApplication?.resume);
                  }}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePdfViewer}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="h-[calc(90vh-80px)]">
              {selectedApplication?.resume?.type === 'application/pdf' ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0"
                  title="Resume Preview"
                  onError={() => {
                    console.log('Error loading PDF in iframe');
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                  <div className="text-center p-8">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {selectedApplication?.resume?.name}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      This file type cannot be previewed in the browser.
                    </p>
                    <p className="text-sm text-gray-400 mb-6">
                      File type: {selectedApplication?.resume?.type}
                    </p>
                    <Button
                      onClick={() => {
                        downloadResume(selectedApplication?.resume);
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationViewer;
