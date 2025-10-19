import { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { google } from 'googleapis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    return await createBooking(req, res);
  } else if (req.method === 'GET') {
    return await getBookings(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function createBooking(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      teamMemberId,
      clientName,
      clientEmail,
      clientPhone,
      meetingType,
      duration,
      startTime,
      endTime,
      timezone,
      notes
    } = req.body;

    // Validate required fields
    if (!teamMemberId || !clientName || !clientEmail || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create booking record
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const booking = {
      id: bookingId,
      teamMemberId,
      clientName,
      clientEmail,
      clientPhone,
      meetingType,
      duration,
      startTime,
      endTime,
      timezone,
      status: 'confirmed',
      notes,
      createdAt: new Date().toISOString()
    };

    // Store booking in KV
    await kv.set(`booking:${bookingId}`, booking);
    
    // Add to team member's bookings for the date
    const dateKey = new Date(startTime).toISOString().split('T')[0];
    const existingBookings = await kv.get(`bookings:${teamMemberId}:${dateKey}`) || [];
    await kv.set(`bookings:${teamMemberId}:${dateKey}`, [...existingBookings, booking]);

    // Create Google Calendar event
    const googleEvent = await createGoogleCalendarEvent(booking);
    
    if (googleEvent) {
      // Update booking with Google event details
      booking.googleEventId = googleEvent.id;
      booking.googleMeetLink = googleEvent.hangoutLink;
      
      // Update the stored booking
      await kv.set(`booking:${bookingId}`, booking);
    }

    // Send email notifications
    await sendBookingNotifications(booking);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getBookings(req: VercelRequest, res: VercelResponse) {
  try {
    const { teamMemberId, date } = req.query;
    
    if (!teamMemberId) {
      return res.status(400).json({ error: 'Missing teamMemberId' });
    }

    let bookings;
    if (date) {
      // Get bookings for specific date
      const dateKey = new Date(date as string).toISOString().split('T')[0];
      bookings = await kv.get(`bookings:${teamMemberId}:${dateKey}`) || [];
    } else {
      // Get all bookings for team member
      const pattern = `bookings:${teamMemberId}:*`;
      const keys = await kv.keys(pattern);
      const allBookings = [];
      
      for (const key of keys) {
        const dayBookings = await kv.get(key) || [];
        allBookings.push(...dayBookings);
      }
      
      bookings = allBookings.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createGoogleCalendarEvent(booking: any) {
  try {
    // Initialize Google Calendar API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Get team member's email
    const teamMember = await kv.get(`team_member:${booking.teamMemberId}`);
    if (!teamMember) {
      throw new Error('Team member not found');
    }

    const event = {
      summary: `${booking.meetingType} - ${booking.clientName}`,
      description: `Meeting with ${booking.clientName}\n\nClient Email: ${booking.clientEmail}${booking.clientPhone ? `\nClient Phone: ${booking.clientPhone}` : ''}${booking.notes ? `\n\nNotes: ${booking.notes}` : ''}`,
      start: {
        dateTime: booking.startTime,
        timeZone: booking.timezone,
      },
      end: {
        dateTime: booking.endTime,
        timeZone: booking.timezone,
      },
      attendees: [
        { email: teamMember.email, displayName: teamMember.name },
        { email: booking.clientEmail, displayName: booking.clientName },
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet_${booking.id}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 10 }, // 10 minutes before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return null;
  }
}

async function sendBookingNotifications(booking: any) {
  try {
    // Get team member details
    const teamMember = await kv.get(`team_member:${booking.teamMemberId}`);
    if (!teamMember) return;

    // Email templates
    const clientEmailTemplate = {
      to: booking.clientEmail,
      subject: `Meeting Confirmed - ${booking.meetingType} with ${teamMember.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Meeting Confirmed!</h2>
          <p>Hello ${booking.clientName},</p>
          <p>Your meeting has been successfully scheduled:</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Meeting Details</h3>
            <p><strong>Meeting:</strong> ${booking.meetingType}</p>
            <p><strong>With:</strong> ${teamMember.name}</p>
            <p><strong>Date & Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${booking.duration} minutes</p>
            ${booking.googleMeetLink ? `<p><strong>Meeting Link:</strong> <a href="${booking.googleMeetLink}" style="color: #2563eb;">Join Meeting</a></p>` : ''}
          </div>

          <p>You will receive a calendar invite shortly.</p>
          <p>If you need to reschedule or cancel, please contact us at info@buckscapital.org</p>
          <p>Best regards,<br>Bucks Capital Team</p>
        </div>
      `
    };

    const teamMemberEmailTemplate = {
      to: teamMember.email,
      subject: `New Meeting Scheduled - ${booking.clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">New Meeting Scheduled</h2>
          <p>Hello ${teamMember.name},</p>
          <p>You have a new meeting scheduled:</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Meeting Details</h3>
            <p><strong>Client:</strong> ${booking.clientName}</p>
            <p><strong>Email:</strong> ${booking.clientEmail}</p>
            <p><strong>Phone:</strong> ${booking.clientPhone || 'Not provided'}</p>
            <p><strong>Meeting:</strong> ${booking.meetingType}</p>
            <p><strong>Date & Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${booking.duration} minutes</p>
            ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
            ${booking.googleMeetLink ? `<p><strong>Meeting Link:</strong> <a href="${booking.googleMeetLink}" style="color: #2563eb;">Join Meeting</a></p>` : ''}
          </div>

          <p>Best regards,<br>Bucks Capital System</p>
        </div>
      `
    };

    // Send emails via API endpoint
    await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientEmailTemplate)
    });

    await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamMemberEmailTemplate)
    });

    console.log('📧 Emails sent successfully');

  } catch (error) {
    console.error('Error sending booking notifications:', error);
  }
}
