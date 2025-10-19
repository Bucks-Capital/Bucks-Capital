#!/usr/bin/env node

/**
 * Bucks Capital Booking System - Environment Setup Script
 * This script helps you set up environment variables interactively
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('🚀 Bucks Capital Booking System - Environment Setup');
  console.log('================================================\n');

  const envVars = {};

  // Google Calendar Setup
  console.log('📅 GOOGLE CALENDAR INTEGRATION');
  console.log('-------------------------------');
  console.log('You need to set up Google Calendar API first:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a new project or select existing');
  console.log('3. Enable Google Calendar API');
  console.log('4. Create a Service Account');
  console.log('5. Download the JSON key file\n');

  envVars.GOOGLE_SERVICE_ACCOUNT_EMAIL = await question('Enter Google Service Account Email: ');
  envVars.GOOGLE_PRIVATE_KEY = await question('Enter Google Private Key (with quotes and \\n): ');

  console.log('\n👥 TEAM MEMBER CREDENTIALS');
  console.log('----------------------------');
  console.log('Set up login credentials for your team members:\n');

  for (let i = 1; i <= 3; i++) {
    const memberName = i === 1 ? 'John Smith' : i === 2 ? 'Sarah Johnson' : 'Michael Chen';
    console.log(`Team Member ${i} - ${memberName}:`);
    envVars[`TEAM_MEMBER_${i}_EMAIL`] = await question(`  Email: `);
    envVars[`TEAM_MEMBER_${i}_PASSWORD`] = await question(`  Password: `);
    console.log('');
  }

  console.log('📧 EMAIL SERVICE CONFIGURATION');
  console.log('-------------------------------');
  console.log('Choose your email service:');
  console.log('1. SendGrid (Recommended)');
  console.log('2. Gmail SMTP');
  
  const emailChoice = await question('Enter choice (1 or 2): ');

  if (emailChoice === '1') {
    console.log('\nSendGrid Setup:');
    console.log('1. Go to https://sendgrid.com/');
    console.log('2. Create a free account');
    console.log('3. Go to Settings → API Keys');
    console.log('4. Create API Key with Full Access\n');
    
    envVars.SENDGRID_API_KEY = await question('Enter SendGrid API Key: ');
    envVars.SENDGRID_FROM_EMAIL = await question('Enter From Email (e.g., noreply@buckscapital.org): ');
    envVars.SENDGRID_FROM_NAME = await question('Enter From Name (e.g., Bucks Capital): ');
  } else {
    console.log('\nGmail SMTP Setup:');
    console.log('1. Enable 2-Factor Authentication on Gmail');
    console.log('2. Generate App Password for Mail');
    console.log('3. Use your Gmail credentials\n');
    
    envVars.SMTP_HOST = 'smtp.gmail.com';
    envVars.SMTP_PORT = '587';
    envVars.SMTP_USER = await question('Enter Gmail Address: ');
    envVars.SMTP_PASS = await question('Enter Gmail App Password: ');
    envVars.SMTP_FROM_EMAIL = await question('Enter From Email (e.g., noreply@buckscapital.org): ');
    envVars.SMTP_FROM_NAME = await question('Enter From Name (e.g., Bucks Capital): ');
  }

  console.log('\n🏢 COMPANY INFORMATION');
  console.log('-----------------------');
  
  envVars.COMPANY_NAME = await question('Company Name (default: Bucks Capital): ') || 'Bucks Capital';
  envVars.COMPANY_EMAIL = await question('Company Email (default: info@buckscapital.org): ') || 'info@buckscapital.org';
  envVars.COMPANY_PHONE = await question('Company Phone (default: 267-945-7717): ') || '267-945-7717';
  envVars.COMPANY_WEBSITE = await question('Company Website (default: https://buckscapital.org): ') || 'https://buckscapital.org';
  envVars.DEFAULT_TIMEZONE = await question('Default Timezone (default: America/New_York): ') || 'America/New_York';

  console.log('\n⚙️ BOOKING SYSTEM SETTINGS');
  console.log('-------------------------');
  
  envVars.BOOKING_ADVANCE_NOTICE_HOURS = await question('Advance Notice Hours (default: 24): ') || '24';
  envVars.BOOKING_CANCELLATION_HOURS = await question('Cancellation Notice Hours (default: 2): ') || '2';
  envVars.BOOKING_REMINDER_HOURS = await question('Reminder Hours (default: 24): ') || '24';

  // Generate .env.local file
  const envContent = generateEnvFile(envVars);
  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log(`📁 Location: ${envPath}`);
    console.log('\n🚀 Next Steps:');
    console.log('1. Review your .env.local file');
    console.log('2. Install dependencies: npm install @vercel/kv googleapis');
    console.log('3. Deploy to Vercel and add these environment variables');
    console.log('4. Test the booking system!');
  } catch (error) {
    console.error('❌ Error creating environment file:', error.message);
  }

  rl.close();
}

function generateEnvFile(vars) {
  let content = '# Bucks Capital Booking System Environment Variables\n';
  content += '# Generated by setup script\n\n';

  // Google Calendar
  content += '# Google Calendar Integration\n';
  content += `GOOGLE_SERVICE_ACCOUNT_EMAIL=${vars.GOOGLE_SERVICE_ACCOUNT_EMAIL}\n`;
  content += `GOOGLE_PRIVATE_KEY=${vars.GOOGLE_PRIVATE_KEY}\n\n`;

  // Team Members
  content += '# Team Member Credentials\n';
  for (let i = 1; i <= 3; i++) {
    content += `TEAM_MEMBER_${i}_EMAIL=${vars[`TEAM_MEMBER_${i}_EMAIL`]}\n`;
    content += `TEAM_MEMBER_${i}_PASSWORD=${vars[`TEAM_MEMBER_${i}_PASSWORD`]}\n`;
  }
  content += '\n';

  // Email Service
  content += '# Email Service Configuration\n';
  if (vars.SENDGRID_API_KEY) {
    content += `SENDGRID_API_KEY=${vars.SENDGRID_API_KEY}\n`;
    content += `SENDGRID_FROM_EMAIL=${vars.SENDGRID_FROM_EMAIL}\n`;
    content += `SENDGRID_FROM_NAME=${vars.SENDGRID_FROM_NAME}\n`;
  } else {
    content += `SMTP_HOST=${vars.SMTP_HOST}\n`;
    content += `SMTP_PORT=${vars.SMTP_PORT}\n`;
    content += `SMTP_USER=${vars.SMTP_USER}\n`;
    content += `SMTP_PASS=${vars.SMTP_PASS}\n`;
    content += `SMTP_FROM_EMAIL=${vars.SMTP_FROM_EMAIL}\n`;
    content += `SMTP_FROM_NAME=${vars.SMTP_FROM_NAME}\n`;
  }
  content += '\n';

  // Company Info
  content += '# Company Information\n';
  content += `COMPANY_NAME=${vars.COMPANY_NAME}\n`;
  content += `COMPANY_EMAIL=${vars.COMPANY_EMAIL}\n`;
  content += `COMPANY_PHONE=${vars.COMPANY_PHONE}\n`;
  content += `COMPANY_WEBSITE=${vars.COMPANY_WEBSITE}\n`;
  content += `DEFAULT_TIMEZONE=${vars.DEFAULT_TIMEZONE}\n\n`;

  // Booking Settings
  content += '# Booking System Settings\n';
  content += `BOOKING_ADVANCE_NOTICE_HOURS=${vars.BOOKING_ADVANCE_NOTICE_HOURS}\n`;
  content += `BOOKING_CANCELLATION_HOURS=${vars.BOOKING_CANCELLATION_HOURS}\n`;
  content += `BOOKING_REMINDER_HOURS=${vars.BOOKING_REMINDER_HOURS}\n`;

  return content;
}

// Run the setup
setupEnvironment().catch(console.error);
