import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if SendGrid is configured
    if (process.env.SENDGRID_API_KEY) {
      await sendWithSendGrid({ to, subject, html });
    } else if (process.env.SMTP_HOST) {
      await sendWithSMTP({ to, subject, html });
    } else {
      // Fallback: just log the email
      console.log('📧 Email would be sent:', { to, subject, html: html.substring(0, 100) + '...' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}

async function sendWithSendGrid(emailData: { to: string; subject: string; html: string }) {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: emailData.to,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@buckscapital.org',
    subject: emailData.subject,
    html: emailData.html,
  };

  await sgMail.send(msg);
  console.log('📧 Email sent via SendGrid to:', emailData.to);
}

async function sendWithSMTP(emailData: { to: string; subject: string; html: string }) {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL || 'noreply@buckscapital.org',
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html,
  };

  await transporter.sendMail(mailOptions);
  console.log('📧 Email sent via SMTP to:', emailData.to);
}
