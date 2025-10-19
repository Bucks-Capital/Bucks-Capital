import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

interface AdminNavbarProps {
  currentPage?: 'admin-login' | 'admin-panel' | 'team-login' | 'team-availability';
  onLogout?: () => void;
  isAuthenticated?: boolean;
  teamMemberName?: string;
}

export default function AdminNavbar({ 
  currentPage, 
  onLogout, 
  isAuthenticated = false,
  teamMemberName 
}: AdminNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      description: 'Main website'
    },
    {
      name: 'Admin Login',
      href: '/admin',
      icon: Settings,
      description: 'Admin dashboard access',
      requiresAuth: false
    },
    {
      name: 'Team Login',
      href: '/team-availability',
      icon: Users,
      description: 'Team member access',
      requiresAuth: false
    },
    {
      name: 'Booking Page',
      href: '/booking',
      icon: Calendar,
      description: 'Client booking system',
      external: true
    }
  ];

  const getCurrentPageName = () => {
    switch (currentPage) {
      case 'admin-login':
        return 'Admin Login';
      case 'admin-panel':
        return 'Admin Dashboard';
      case 'team-login':
        return 'Team Login';
      case 'team-availability':
        return 'Team Availability';
      default:
        return 'Admin System';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Bucks Capital
                </h1>
                <p className="text-sm text-gray-500">
                  {getCurrentPageName()}
                  {teamMemberName && ` - ${teamMemberName}`}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = 
                (currentPage === 'admin-login' && item.name === 'Admin Login') ||
                (currentPage === 'admin-panel' && item.name === 'Admin Login') ||
                (currentPage === 'team-login' && item.name === 'Team Login') ||
                (currentPage === 'team-availability' && item.name === 'Team Login');

              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    if (item.external) {
                      window.open(item.href, '_blank');
                    } else {
                      window.location.href = item.href;
                    }
                  }}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.external && <ExternalLink className="w-3 h-3" />}
                </Button>
              );
            })}

            {/* Logout Button */}
            {isAuthenticated && onLogout && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = 
                  (currentPage === 'admin-login' && item.name === 'Admin Login') ||
                  (currentPage === 'admin-panel' && item.name === 'Admin Login') ||
                  (currentPage === 'team-login' && item.name === 'Team Login') ||
                  (currentPage === 'team-availability' && item.name === 'Team Login');

                return (
                  <Button
                    key={item.name}
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      if (item.external) {
                        window.open(item.href, '_blank');
                      } else {
                        window.location.href = item.href;
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {item.external && <ExternalLink className="w-3 h-3 ml-auto" />}
                  </Button>
                );
              })}

              {/* Mobile Logout Button */}
              {isAuthenticated && onLogout && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
