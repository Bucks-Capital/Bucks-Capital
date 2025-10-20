import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory storage for availability data
// In production, this would be replaced with a proper database
const availabilityStorage = new Map<string, any>();

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

    // Get stored availability or return empty array
    let storedAvailability = [];
    
    if (type) {
      // Get specific type (recurring or onetime)
      const typeKey = `${memberId}_${type}`;
      storedAvailability = availabilityStorage.get(typeKey) || [];
    } else {
      // Get all availability (both recurring and onetime)
      const recurringKey = `${memberId}_recurring`;
      const onetimeKey = `${memberId}_onetime`;
      const recurring = availabilityStorage.get(recurringKey) || [];
      const onetime = availabilityStorage.get(onetimeKey) || [];
      storedAvailability = [...recurring, ...onetime];
    }
    
    // If no stored data and no type specified, return default mock data for first-time users
    if (storedAvailability.length === 0 && !type) {
      const defaultAvailability = [
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
      
      console.log('✅ Returning default availability:', defaultAvailability.length, 'items');
      res.status(200).json(defaultAvailability);
      return;
    }

    console.log('✅ Returning stored availability:', storedAvailability.length, 'items');
    res.status(200).json(storedAvailability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function saveAvailability(req: VercelRequest, res: VercelResponse) {
  try {
    const { teamMemberId, availability, type } = req.body;

    if (!teamMemberId || !availability) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('💾 Saving availability for member:', teamMemberId, 'type:', type);
    console.log('📋 Availability data:', availability);

    // Store the availability data
    const storageKey = `${teamMemberId}_${type || 'all'}`;
    availabilityStorage.set(storageKey, availability);
    
    // Also store individual type data for easier retrieval
    if (type) {
      const typeKey = `${teamMemberId}_${type}`;
      availabilityStorage.set(typeKey, availability);
    }

    console.log('✅ Availability stored successfully:', availability.length, 'items');
    
    res.status(200).json({ 
      success: true, 
      message: 'Availability saved successfully',
      savedItems: availability.length,
      storageKey: storageKey
    });
  } catch (error) {
    console.error('Error saving availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
