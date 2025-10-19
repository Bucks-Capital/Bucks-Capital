// Mock authentication for development
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

export const mockLogin = async (email: string, password: string): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const validCredentials = [
    {
      email: 'shreyas@buckscapital.org',
      password: 'BucksCapital2024!',
      member: {
        id: '1',
        name: 'Shreyas Raju',
        email: 'shreyas@buckscapital.org',
        title: 'Founder & CEO',
        bio: 'Founder of Bucks Capital with extensive experience in investment management and financial planning.',
        timezone: 'America/New_York',
        isActive: true
      }
    },
    {
      email: 'advisor@buckscapital.org',
      password: 'Advisor2024!',
      member: {
        id: '2',
        name: 'Investment Advisor',
        email: 'advisor@buckscapital.org',
        title: 'Senior Investment Advisor',
        bio: 'Specializing in portfolio management and financial planning with over 10 years of experience.',
        timezone: 'America/New_York',
        isActive: true
      }
    },
    {
      email: 'analyst@buckscapital.org',
      password: 'Analyst2024!',
      member: {
        id: '3',
        name: 'Financial Analyst',
        email: 'analyst@buckscapital.org',
        title: 'Senior Financial Analyst',
        bio: 'Expert in market analysis and investment strategies for high-net-worth individuals.',
        timezone: 'America/Los_Angeles',
        isActive: true
      }
    }
  ];

  const validCredential = validCredentials.find(
    cred => cred.email === email && cred.password === password
  );

  if (!validCredential) {
    return {
      success: false,
      error: 'Invalid credentials'
    };
  }

  return {
    success: true,
    member: validCredential.member
  };
};
