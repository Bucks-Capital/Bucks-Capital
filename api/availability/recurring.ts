import { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return await getRecurringAvailability(req, res);
  } else if (req.method === 'POST') {
    return await saveRecurringAvailability(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getRecurringAvailability(req: VercelRequest, res: VercelResponse) {
  try {
    const { memberId } = req.query;

    if (!memberId) {
      return res.status(400).json({ error: 'Missing memberId' });
    }

    const availability = await kv.get(`availability:${memberId}:recurring`) || [];
    res.status(200).json(availability);
  } catch (error) {
    console.error('Error fetching recurring availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function saveRecurringAvailability(req: VercelRequest, res: VercelResponse) {
  try {
    const { teamMemberId, availability } = req.body;

    if (!teamMemberId || !availability) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save recurring availability
    await kv.set(`availability:${teamMemberId}:recurring`, availability);

    // Also save individual day availability for easier querying
    for (const avail of availability) {
      await kv.set(`availability:${teamMemberId}:recurring:${avail.dayOfWeek}`, avail);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving recurring availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
