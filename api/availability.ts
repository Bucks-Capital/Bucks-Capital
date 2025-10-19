import { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { memberId, date } = req.query;

    if (!memberId || !date) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const requestedDate = new Date(date as string);
    const dayOfWeek = requestedDate.getDay();

    // Get team member's recurring availability
    const recurringAvailability = await kv.get(`availability:${memberId}:recurring:${dayOfWeek}`);
    
    // Get any one-time availability overrides for this date
    const dateKey = requestedDate.toISOString().split('T')[0];
    const oneTimeAvailability = await kv.get(`availability:${memberId}:date:${dateKey}`);

    // Get existing bookings for this date
    const existingBookings = await kv.get(`bookings:${memberId}:${dateKey}`) || [];

    // Generate time slots based on availability
    const timeSlots = generateTimeSlots(
      recurringAvailability,
      oneTimeAvailability,
      requestedDate,
      memberId as string,
      existingBookings
    );

    res.status(200).json(timeSlots);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function generateTimeSlots(
  recurringAvailability: any,
  oneTimeAvailability: any,
  date: Date,
  memberId: string,
  existingBookings: any[]
) {
  const slots = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  const slotDuration = 30; // 30 minutes

  // Use one-time availability if available, otherwise use recurring
  const availability = oneTimeAvailability || recurringAvailability;
  
  if (!availability) {
    return slots;
  }

  const { startTime, endTime } = availability;
  const [startHourAvail, startMinAvail] = startTime.split(':').map(Number);
  const [endHourAvail, endMinAvail] = endTime.split(':').map(Number);

  for (let hour = startHourAvail; hour < endHourAvail; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      if (hour === endHourAvail && minute >= endMinAvail) break;
      
      const slotStart = new Date(date);
      slotStart.setHours(hour, minute, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

      // Check if this slot conflicts with existing bookings
      const isBooked = existingBookings.some(booking => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        return (slotStart < bookingEnd && slotEnd > bookingStart);
      });

      slots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        isAvailable: !isBooked,
        teamMemberId: memberId
      });
    }
  }

  return slots;
}
