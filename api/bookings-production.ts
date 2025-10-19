import { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    // Get team member details from environment variables
    const teamMembers = [
      {
        id: '1',
        name: 'Shreyas Raju',
        email: process.env.TEAM_MEMBER_1_EMAIL || 'shreyasRaju3249@gmail.com',
        title: 'Chief Technology Officer'
      },
      {
        id: '2', 
        name: 'Zahin Mulji',
        email: process.env.TEAM_MEMBER_2_EMAIL || 'muljizahin@gmail.com',
        title: 'Chief Investment Officer'
      },
      {
        id: '3',
        name: 'Harrison Cornwell', 
        email: process.env.TEAM_MEMBER_3_EMAIL || 'harrisonecornwell@gmail.com',
        title: 'Chief Financial Officer'
      }
    ];

    const teamMember = teamMembers.find(member => member.id === teamMemberId);
    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Create booking record
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const booking = {
      id: bookingId,
      teamMemberId,
      clientName,
      clientEmail,
      clientPhone: clientPhone || '',
      meetingType,
      duration: parseInt(duration) || 30,
      startTime,
      endTime,
      timezone: timezone || 'America/New_York',
      status: 'confirmed',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    // Create Google Calendar event
    const googleEvent = await createGoogleCalendarEvent(booking, teamMember);
    
    if (googleEvent) {
      booking.googleEventId = googleEvent.id;
      booking.googleMeetLink = googleEvent.hangoutLink;
    }

    // Send email notifications
    await sendBookingNotifications(booking, teamMember);

    console.log('📅 Booking created successfully:', {
      id: booking.id,
      client: booking.clientName,
      email: booking.clientEmail,
      meeting: booking.meetingType,
      time: booking.startTime,
      googleMeet: booking.googleMeetLink
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function createGoogleCalendarEvent(booking: any, teamMember: any) {
  try {
    // Check if Google Calendar is configured
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.log('Google Calendar not configured, skipping calendar event creation');
      return null;
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
      summary: `${booking.meetingType} - ${booking.clientName}`,
      description: `Meeting with ${booking.clientName}\n\nClient Email: ${booking.clientEmail}\nClient Phone: ${booking.clientPhone || 'Not provided'}\nNotes: ${booking.notes || 'None'}`,
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

    console.log('📅 Google Calendar event created:', response.data.id);
    return response.data;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return null;
  }
}

async function sendBookingNotifications(booking: any, teamMember: any) {
  try {
    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid not configured, skipping email notifications');
      return;
    }

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Client email
    const clientEmail = {
      to: booking.clientEmail,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'meetings@buckscapital.org',
        name: process.env.SENDGRID_FROM_NAME || 'Bucks Capital'
      },
      subject: `Meeting Confirmed - ${booking.meetingType} with ${teamMember.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Meeting Confirmed!</h2>
          <p>Hello ${booking.clientName},</p>
          <p>Your meeting has been successfully scheduled:</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Meeting Details</h3>
            <p><strong>Meeting:</strong> ${booking.meetingType}</p>
            <p><strong>With:</strong> ${teamMember.name} (${teamMember.title})</p>
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

    // Team member email
    const teamMemberEmail = {
      to: teamMember.email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'meetings@buckscapital.org',
        name: process.env.SENDGRID_FROM_NAME || 'Bucks Capital'
      },
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

    // Send emails
    await sgMail.send(clientEmail);
    await sgMail.send(teamMemberEmail);

    console.log('📧 Emails sent successfully to:', booking.clientEmail, 'and', teamMember.email);

  } catch (error) {
    console.error('Error sending booking notifications:', error);
  }
}
