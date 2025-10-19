import React, { useState, useEffect } from 'react';
import ApplicationViewer from '@/components/ApplicationViewer';
import AdminLogin from '@/components/AdminLogin';
import MeetingsCalendar from '@/components/admin/MeetingsCalendar';
import AdminNavbar from '@/components/navigation/AdminNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Settings, ExternalLink } from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'applications' | 'meetings'>('applications');

  useEffect(() => {
    // Check if user is already authenticated (session persists on page refresh)
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    // Store authentication status in localStorage
    localStorage.setItem('adminAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear authentication status
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar 
        currentPage="admin-panel" 
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      <div className="container mx-auto py-8">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage applications and meetings</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => window.open('/booking', '_blank')}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Booking Page</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('/team-availability', '_blank')}
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Team Availability</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Applications</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('meetings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'meetings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Meetings Calendar</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'applications' && (
          <ApplicationViewer onLogout={handleLogout} />
        )}
        
        {activeTab === 'meetings' && (
          <MeetingsCalendar />
        )}
      </div>
    </div>
  );
};

export default Admin;
