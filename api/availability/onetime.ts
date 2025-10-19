import { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return await getOneTimeAvailability(req, res);
  } else if (req.method === 'POST') {
    return await saveOneTimeAvailability(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getOneTimeAvailability(req: VercelRequest, res: VercelResponse) {
  try {
    const { memberId } = req.query;

    if (!memberId) {
      return res.status(400).json({ error: 'Missing memberId' });
    }

    const availability = await kv.get(`availability:${memberId}:onetime`) || [];
    res.status(200).json(availability);
  } catch (error) {
    console.error('Error fetching one-time availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function saveOneTimeAvailability(req: VercelRequest, res: VercelResponse) {
  try {
    const { teamMemberId, availability } = req.body;

    if (!teamMemberId || !availability) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save one-time availability
    await kv.set(`availability:${teamMemberId}:onetime`, availability);

    // Also save individual date availability for easier querying
    for (const avail of availability) {
      if (avail.date) {
        const dateKey = avail.date.split('T')[0];
        await kv.set(`availability:${teamMemberId}:date:${dateKey}`, avail);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving one-time availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
