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
      email: 'shreyasRaju3249@gmail.com',
      password: 'DDFA8277353XA12shmvs3249!',
      member: {
        id: '1',
        name: 'Shreyas Raju',
        email: 'shreyasRaju3249@gmail.com',
        title: 'Chief Technology Officer',
        bio: 'CTO of Bucks Capital with extensive experience in investments and financial technology. Experience in web and software development.',
        timezone: 'America/New_York',
        isActive: true
      }
    },
    {
      email: 'muljizahin@gmail.com',
      password: 'PanPan1!',
      member: {
        id: '2',
        name: 'Zahin Mulji',
        email: 'muljizahin@gmail.com',
        title: 'Chief Investment Officer',
        bio: 'Expert in market analysis and investment strategies for firms and individuals. Experienced in portfolio management and equity analysis.',
        timezone: 'America/New_York',
        isActive: true
      }
    },
    {
      email: 'harrisonecornwell@gmail.com',
      password: 'BucksCapital2024!',
      member: {
        id: '3',
        name: 'Harrison Cornwell',
        email: 'harrisonecornwell@gmail.com',
        title: 'Chief Financial Officer',
        bio: 'Specializing in comprehensive financial analysis and investment research. Focused on helping clients make informed investment decisions.',
        timezone: 'America/New_York',
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
