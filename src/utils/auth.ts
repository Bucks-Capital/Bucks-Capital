import { mockLogin } from './mockAuth';

// Detect if we're in development or production
const isDevelopment = import.meta.env.DEV;

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  title: string;
  bio?: string;
  timezone: string;
  isActive: boolean;
}

export interface LoginResponse {
  success: boolean;
  member?: TeamMember;
  error?: string;
}

export const authenticateUser = async (email: string, password: string): Promise<LoginResponse> => {
  if (isDevelopment) {
    // Use mock authentication in development
    return await mockLogin(email, password);
  } else {
    // Use real API in production
    try {
      console.log('🔐 Attempting production login for:', email);
      
      const response = await fetch('/api/auth/login-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log('📡 Login API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login successful:', data.name);
        return {
          success: true,
          member: data
        };
      } else {
        const error = await response.json();
        console.error('❌ Login failed:', error);
        return {
          success: false,
          error: error.error || 'Login failed'
        };
      }
    } catch (error) {
      console.error('🚨 Login network error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }
};
