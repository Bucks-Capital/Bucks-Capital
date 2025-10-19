import { Booking } from '@/types/booking';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export const sendMockBookingEmail = async (booking: Booking, teamMemberName: string): Promise<void> => {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const clientEmail: EmailTemplate = {
    to: booking.clientEmail,
    subject: `Meeting Confirmed - ${booking.meetingType} with ${teamMemberName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Meeting Confirmed!</h2>
        <p>Hello ${booking.clientName},</p>
        <p>Your meeting has been successfully scheduled:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Meeting Details</h3>
          <p><strong>Meeting:</strong> ${booking.meetingType}</p>
          <p><strong>With:</strong> ${teamMemberName}</p>
          <p><strong>Date & Time:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
          <p><strong>Duration:</strong> ${booking.duration} minutes</p>
          ${booking.googleMeetLink ? `<p><strong>Meeting Link:</strong> <a href="${booking.googleMeetLink}" style="color: #2563eb;">Join Meeting</a></p>` : ''}
        </div>

        <p><strong>Note:</strong> This is a development email. In production, you'll receive a real calendar invite.</p>
        
        <p>If you need to reschedule or cancel, please contact us at info@buckscapital.org</p>
        
        <p>Best regards,<br>Bucks Capital Team</p>
      </div>
    `
  };

  const teamEmail: EmailTemplate = {
    to: 'shreyasRaju3249@gmail.com', // Your email for testing
    subject: `New Meeting Scheduled - ${booking.clientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">New Meeting Scheduled</h2>
        <p>Hello ${teamMemberName},</p>
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

        <p><strong>Note:</strong> This is a development email. In production, you'll receive a real calendar invite.</p>
        
        <p>Best regards,<br>Bucks Capital System</p>
      </div>
    `
  };

  // Log emails to console for development
  console.log('📧 Mock Email Sent to Client:', clientEmail);
  console.log('📧 Mock Email Sent to Team:', teamEmail);
  
  // In development, we'll just log the emails
  // In production, this would use SendGrid, SMTP, etc.
};
