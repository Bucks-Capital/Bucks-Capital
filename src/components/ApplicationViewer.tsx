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
import { Eye, Trash2, Download, Calendar, User, Mail, Phone, GraduationCap, MapPin, FileText, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown, Home, LogOut } from 'lucide-react';

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
    data: string; // base64 data
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

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const stored = localStorage.getItem('bucksCapitalApplications');
    if (stored) {
      setApplications(JSON.parse(stored));
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

  const deleteApplication = (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      const updated = applications.filter(app => app.id !== id);
      setApplications(updated);
      localStorage.setItem('bucksCapitalApplications', JSON.stringify(updated));
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

  const openPdfViewer = (resumeData: any) => {
    console.log('openPdfViewer called with:', resumeData);
    if (resumeData && resumeData.data) {
      console.log('Converting base64 to file...');
      const file = base64ToFile(resumeData.data, resumeData.name, resumeData.type);
      console.log('Created file:', file);
      const url = URL.createObjectURL(file);
      console.log('Created URL:', url);
      setPdfUrl(url);
      setIsPdfViewerOpen(true);
      console.log('PDF viewer should be open now');
    } else {
      console.log('No resume data or data missing');
    }
  };

  const closePdfViewer = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setIsPdfViewerOpen(false);
  };

  const clearAllApplications = () => {
    if (window.confirm('Are you sure you want to delete ALL applications? This action cannot be undone.')) {
      localStorage.removeItem('bucksCapitalApplications');
      setApplications([]);
      setSelectedApplication(null);
      setIsModalOpen(false);
      setIsPdfViewerOpen(false);
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
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
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (applications.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Application Viewer</h1>
            <p className="text-foreground/80">
              0 applications submitted
            </p>
          </div>
        </div>
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No Applications Yet</h2>
          <p className="text-foreground/80">
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
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => {
              console.log('Home button clicked');
              navigate('/');
            }}
            variant="default"
            size="default"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Application Viewer</h1>
            <p className="text-foreground/80">
              {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            {sortBy.includes('asc') ? (
              <ArrowUp className="h-4 w-4 text-gray-500" />
            ) : sortBy.includes('desc') ? (
              <ArrowDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
            )}
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-48">
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
          <div className="flex gap-2">
            {onLogout && (
              <Button 
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          <Button onClick={exportApplications} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            onClick={clearAllApplications}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
          <Button 
            onClick={() => {
              console.log('Test PDF viewer');
              setPdfUrl('data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDIgMCBSCj4+Cj4+Ci9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoKNiAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjcyIDcyMCBUZAooSGVsbG8gV29ybGQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs1IDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYKMDAwMDAwMDAwOSAwMDAwMCBuCjAwMDAwMDAwNTggMDAwMDAgbgowMDAwMDAwMTE1IDAwMDAwIG4KMDAwMDAwMDI2NSAwMDAwMCBuCjAwMDAwMDAzODIgMDAwMDAgbgowMDAwMDAwNDQwIDAwMDAwIG4KdHJhaWxlcgo8PAovU2l6ZSA3Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo1MzMKJSVFT0Y=');
              setIsPdfViewerOpen(true);
            }}
            variant="outline"
          >
            Test PDF
          </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedApplications.map((application) => (
          <Card key={application.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {application.name}
                  </h3>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-foreground/80">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {application.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {application.grade}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {application.highSchoolName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </div>
                  <div className="font-medium text-primary">
                    Position: {application.availablePositions}
                  </div>
                  {application.resume && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      Resume uploaded
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedApplication(application);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteApplication(application.id)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ${isModalOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
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
                  >
                    ×
                  </Button>
                </div>
              </div>
            
            <div className="p-6 space-y-6">
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
                              // Create a download link for the file
                              if (selectedApplication.resume && selectedApplication.resume.data) {
                                const file = base64ToFile(
                                  selectedApplication.resume.data, 
                                  selectedApplication.resume.name, 
                                  selectedApplication.resume.type
                                );
                                const url = URL.createObjectURL(file);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = selectedApplication.resume.name;
                                a.click();
                                URL.revokeObjectURL(url);
                              }
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
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
                    if (selectedApplication?.resume && selectedApplication.resume.data) {
                      const file = base64ToFile(
                        selectedApplication.resume.data, 
                        selectedApplication.resume.name, 
                        selectedApplication.resume.type
                      );
                      const url = URL.createObjectURL(file);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = selectedApplication.resume.name;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
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
                        if (selectedApplication?.resume && selectedApplication.resume.data) {
                          const file = base64ToFile(
                            selectedApplication.resume.data, 
                            selectedApplication.resume.name, 
                            selectedApplication.resume.type
                          );
                          const url = URL.createObjectURL(file);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = selectedApplication.resume.name;
                          a.click();
                          URL.revokeObjectURL(url);
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download to View
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationViewer;
