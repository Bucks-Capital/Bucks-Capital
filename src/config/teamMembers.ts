import { TeamMember } from '@/types/booking';

// Team member configuration - easily customizable
export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Shreyas Raju',
    email: 'shreyasRaju3249@gmail.com',
    title: 'Chief Technology Officer',
    bio: 'CTO of Bucks Capital with extensive experience in investments and financial technology. Experience in web and software development.',
    timezone: 'EST',
    isActive: true
  },
  {
    id: '2',
    name: 'Zahin Mulji',
    email: 'muljizahin@gmail.com',
    title: 'Chief Investment Officer',
    bio: 'Expert in market analysis and investment strategies for firms and individuals. Experienced in portfolio management and equity analysis.',
    timezone: 'EST',
    isActive: true
  },
  {
    id: '3',
    name: 'Harrison Cornwell',
    email: 'harrisonecornwell@gmail.com',
    title: 'Chief Financial Officer',
    bio: 'Specializing in comprehensive financial analysis and investment research. Focused on helping clients make informed investment decisions.',
    timezone: 'EST',
    isActive: true
  }
];

// Helper function to get active team members
export const getActiveTeamMembers = (): TeamMember[] => {
  return teamMembers.filter(member => member.isActive);
};

// Helper function to get team member by ID
export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return teamMembers.find(member => member.id === id);
};
