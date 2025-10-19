import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return await getAvailability(req, res);
  } else if (req.method === 'POST') {
    return await saveAvailability(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getAvailability(req: VercelRequest, res: VercelResponse) {
  try {
    const { memberId, type } = req.query;

    if (!memberId) {
      return res.status(400).json({ error: 'Missing memberId' });
    }

    console.log('📅 Fetching availability for member:', memberId, 'type:', type);

    // Return mock availability data for now
    const mockAvailability = [
      {
        id: '1',
        teamMemberId: memberId,
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
        type: 'recurring'
      },
      {
        id: '2',
        teamMemberId: memberId,
        dayOfWeek: 'Tuesday',
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
        type: 'recurring'
      },
      {
        id: '3',
        teamMemberId: memberId,
        dayOfWeek: 'Wednesday',
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
        type: 'recurring'
      },
      {
        id: '4',
        teamMemberId: memberId,
        dayOfWeek: 'Thursday',
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
        type: 'recurring'
      },
      {
        id: '5',
        teamMemberId: memberId,
        dayOfWeek: 'Friday',
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
        type: 'recurring'
      }
    ];

    // Filter by type if specified
    const filteredAvailability = type 
      ? mockAvailability.filter(av => av.type === type)
      : mockAvailability;

    console.log('✅ Returning availability:', filteredAvailability.length, 'items');
    res.status(200).json(filteredAvailability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function saveAvailability(req: VercelRequest, res: VercelResponse) {
  try {
    const { teamMemberId, availability } = req.body;

    if (!teamMemberId || !availability) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('💾 Saving availability for member:', teamMemberId);
    console.log('📋 Availability data:', availability);

    // For now, just return success
    // In production, this would save to a database
    res.status(200).json({ 
      success: true, 
      message: 'Availability saved successfully',
      savedItems: availability.length
    });
  } catch (error) {
    console.error('Error saving availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
