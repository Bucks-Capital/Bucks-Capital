import { VercelRequest, VercelResponse } from '@vercel/node';
import { availabilityService } from '../../src/lib/supabaseService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return await getAvailability(req, res);
  } else if (req.method === 'POST') {
    return await saveAvailability(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getAvailability(req: VercelRequest, res: VercelResponse) {
  try {
    const { teamMemberId, type } = req.query;

    if (!teamMemberId) {
      return res.status(400).json({ error: 'Missing teamMemberId' });
    }

    console.log('📅 Fetching availability for member:', teamMemberId, 'type:', type);

    const availability = await availabilityService.getByTeamMember(
      teamMemberId as string,
      type as 'recurring' | 'onetime' | undefined
    );

    console.log('✅ Returning availability:', availability.length, 'items');
    res.status(200).json(availability);
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

    const savedAvailability = await availabilityService.save(teamMemberId, availability);

    console.log('✅ Availability saved successfully:', savedAvailability.length, 'items');
    
    res.status(200).json({ 
      success: true, 
      message: 'Availability saved successfully',
      savedItems: savedAvailability.length,
      data: savedAvailability
    });
  } catch (error) {
    console.error('Error saving availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
