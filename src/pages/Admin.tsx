import React, { useState, useEffect } from 'react';
import ApplicationViewer from '@/components/ApplicationViewer';
import AdminLogin from '@/components/AdminLogin';

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
      <div className="container mx-auto py-8">
        <ApplicationViewer onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default Admin;
