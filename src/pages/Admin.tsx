import React, { useState, useEffect } from 'react';
import ApplicationViewer from '@/components/ApplicationViewer';
import AdminLogin from '@/components/AdminLogin';
import AdminNavbar from '@/components/navigation/AdminNavbar';
import { Settings } from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage applications</p>
          </div>
        </div>

        {/* Applications Content */}
        <ApplicationViewer onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default Admin;
