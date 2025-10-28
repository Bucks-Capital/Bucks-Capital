import { VercelRequest, VercelResponse } from '@vercel/node';
import { bookingsService } from '../../src/lib/supabaseService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return await getBookings(req, res);
  } else if (req.method === 'POST') {
    return await createBooking(req, res);
  } else if (req.method === 'PUT') {
    return await updateBooking(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getBookings(req: VercelRequest, res: VercelResponse) {
  try {
    const { teamMemberId } = req.query;

    console.log('📅 Fetching bookings for member:', teamMemberId);

    let bookings;
    if (teamMemberId) {
      bookings = await bookingsService.getByTeamMember(teamMemberId as string);
    } else {
      bookings = await bookingsService.getAll();
    }

    console.log('✅ Returning bookings:', bookings.length, 'items');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createBooking(req: VercelRequest, res: VercelResponse) {
  try {
    const bookingData = req.body;

    if (!bookingData.team_member_id || !bookingData.client_name || !bookingData.client_email) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    console.log('📅 Creating booking for member:', bookingData.team_member_id);

    const booking = await bookingsService.create(bookingData);

    console.log('✅ Booking created successfully:', booking.id);
    
    res.status(201).json({
      success: true,
      booking: booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateBooking(req: VercelRequest, res: VercelResponse) {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: 'Missing booking ID or status' });
    }

    console.log('📅 Updating booking:', id, 'status:', status);

    const booking = await bookingsService.updateStatus(id, status);

    console.log('✅ Booking updated successfully:', booking.id);
    
    res.status(200).json({
      success: true,
      booking: booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
