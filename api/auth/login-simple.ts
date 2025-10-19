import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    console.log('🔐 Login attempt:', { email, password: '***' });

    // Team member credentials from environment variables
    const validCredentials = [
      {
        email: process.env.TEAM_MEMBER_1_EMAIL || 'shreyasRaju3249@gmail.com',
        password: process.env.TEAM_MEMBER_1_PASSWORD || 'DDFA8277353XA12shmvs3249!',
        member: {
          id: '1',
          name: 'Shreyas Raju',
          email: process.env.TEAM_MEMBER_1_EMAIL || 'shreyasRaju3249@gmail.com',
          title: 'Chief Technology Officer',
          bio: 'CTO of Bucks Capital with extensive experience in investments and financial technology. Experience in web and software development.',
          timezone: 'America/New_York',
          isActive: true
        }
      },
      {
        email: process.env.TEAM_MEMBER_2_EMAIL || 'muljizahin@gmail.com',
        password: process.env.TEAM_MEMBER_2_PASSWORD || 'PanPan1!',
        member: {
          id: '2',
          name: 'Zahin Mulji',
          email: process.env.TEAM_MEMBER_2_EMAIL || 'muljizahin@gmail.com',
          title: 'Chief Investment Officer',
          bio: 'Expert in market analysis and investment strategies for firms and individuals. Experienced in portfolio management and equity analysis.',
          timezone: 'America/New_York',
          isActive: true
        }
      },
      {
        email: process.env.TEAM_MEMBER_3_EMAIL || 'harrisonecornwell@gmail.com',
        password: process.env.TEAM_MEMBER_3_PASSWORD || 'BucksCapital123!',
        member: {
          id: '3',
          name: 'Harrison Cornwell',
          email: process.env.TEAM_MEMBER_3_EMAIL || 'harrisonecornwell@gmail.com',
          title: 'Chief Financial Officer',
          bio: 'Specializing in comprehensive financial analysis and investment research. Focused on helping clients make informed investment decisions.',
          timezone: 'America/New_York',
          isActive: true
        }
      }
    ];

    // Find matching credentials
    const credential = validCredentials.find(cred => 
      cred.email.toLowerCase() === email.toLowerCase() && 
      cred.password === password
    );

    if (credential) {
      console.log('✅ Login successful for:', credential.member.name);
      res.status(200).json(credential.member);
    } else {
      console.log('❌ Login failed for:', email);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
