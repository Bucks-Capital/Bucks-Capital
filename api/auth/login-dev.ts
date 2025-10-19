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

    // Development credentials - no KV dependency
    const validCredentials = [
      {
        email: 'john@buckscapital.org',
        password: 'password123',
        member: {
          id: '1',
          name: 'John Smith',
          email: 'john@buckscapital.org',
          title: 'Investment Advisor',
          bio: 'Specializing in portfolio management and financial planning with over 10 years of experience.',
          timezone: 'America/New_York',
          isActive: true
        }
      },
      {
        email: 'sarah@buckscapital.org',
        password: 'password123',
        member: {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@buckscapital.org',
          title: 'Senior Financial Analyst',
          bio: 'Expert in market analysis and investment strategies for high-net-worth individuals.',
          timezone: 'America/New_York',
          isActive: true
        }
      },
      {
        email: 'michael@buckscapital.org',
        password: 'password123',
        member: {
          id: '3',
          name: 'Michael Chen',
          email: 'michael@buckscapital.org',
          title: 'Wealth Manager',
          bio: 'Focused on comprehensive wealth management and estate planning solutions.',
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

    // For development, just return the member data without KV
    res.status(200).json({
      ...validCredential.member,
      sessionId: `dev_session_${Date.now()}`
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
