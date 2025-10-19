import { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Production authentication using environment variables
    const validCredentials = [
      {
        email: process.env.TEAM_MEMBER_1_EMAIL || 'shreyas@buckscapital.org',
        password: process.env.TEAM_MEMBER_1_PASSWORD || 'BucksCapital2024!',
        member: {
          id: '1',
          name: 'Shreyas Raju',
          email: process.env.TEAM_MEMBER_1_EMAIL || 'shreyas@buckscapital.org',
          title: 'Founder & CEO',
          bio: 'Founder of Bucks Capital with extensive experience in investment management and financial planning.',
          timezone: 'America/New_York',
          isActive: true
        }
      },
      {
        email: process.env.TEAM_MEMBER_2_EMAIL || 'advisor@buckscapital.org',
        password: process.env.TEAM_MEMBER_2_PASSWORD || 'Advisor2024!',
        member: {
          id: '2',
          name: 'Investment Advisor',
          email: process.env.TEAM_MEMBER_2_EMAIL || 'advisor@buckscapital.org',
          title: 'Senior Investment Advisor',
          bio: 'Specializing in portfolio management and financial planning with over 10 years of experience.',
          timezone: 'America/New_York',
          isActive: true
        }
      },
      {
        email: process.env.TEAM_MEMBER_3_EMAIL || 'analyst@buckscapital.org',
        password: process.env.TEAM_MEMBER_3_PASSWORD || 'Analyst2024!',
        member: {
          id: '3',
          name: 'Financial Analyst',
          email: process.env.TEAM_MEMBER_3_EMAIL || 'analyst@buckscapital.org',
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
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Store team member data in KV for session management
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(`session:${sessionId}`, validCredential.member, { ex: 86400 }); // 24 hours

    res.status(200).json({
      ...validCredential.member,
      sessionId
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
