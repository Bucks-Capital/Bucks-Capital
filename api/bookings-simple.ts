import { VercelRequest, VercelResponse } from '@vercel/node';

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
    if (!teamMemberId || !clientName || !clientEmail || !meetingType || !startTime || !endTime) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['teamMemberId', 'clientName', 'clientEmail', 'meetingType', 'startTime', 'endTime']
      });
    }

    // Create booking object
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
      notes: notes || '',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      googleMeetLink: `https://meet.google.com/${Math.random().toString(36).substr(2, 10)}-${Math.random().toString(36).substr(2, 4)}`
    };

    // For now, just return the booking without external dependencies
    // In production, you would save to database and send emails here
    
    console.log('📅 Booking created:', {
      id: booking.id,
      client: booking.clientName,
      email: booking.clientEmail,
      meeting: booking.meetingType,
      time: booking.startTime
    });

    // Send email notifications (simplified)
    await sendSimpleEmailNotification(booking);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function sendSimpleEmailNotification(booking: any) {
  try {
    // Simple email notification without external dependencies
    const emailData = {
      to: booking.clientEmail,
      subject: `Meeting Confirmed - ${booking.meetingType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Meeting Confirmed!</h2>
          <p>Hello ${booking.clientName},</p>
          <p>Your meeting has been successfully scheduled:</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Meeting Details</h3>
            <p><strong>Meeting:</strong> ${booking.meetingType}</p>
            <p><strong>Date & Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${booking.duration} minutes</p>
            <p><strong>Meeting Link:</strong> <a href="${booking.googleMeetLink}" style="color: #2563eb;">Join Meeting</a></p>
          </div>

          <p>You will receive a calendar invite shortly.</p>
          <p>If you need to reschedule or cancel, please contact us at info@buckscapital.org</p>
          <p>Best regards,<br>Bucks Capital Team</p>
        </div>
      `
    };

    // For now, just log the email
    console.log('📧 Email would be sent:', {
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html.substring(0, 100) + '...'
    });

    // In production, you would use SendGrid, SMTP, or another email service here
    // await sendEmail(emailData);

  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}
