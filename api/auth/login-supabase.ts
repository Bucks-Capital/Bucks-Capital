import { VercelRequest, VercelResponse } from '@vercel/node';
import { authService } from '../../src/lib/supabaseService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    console.log('🔐 Attempting login for:', email);

    const user = await authService.login(email, password);

    if (!user) {
      console.log('❌ Login failed for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Login successful for:', email, 'role:', user.role);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        team_member_id: user.team_member_id,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
