# Bucks Capital Booking System

A comprehensive Calendly clone integrated into the Bucks Capital website, built with React, TypeScript, and Vercel serverless functions.

## Features

### For Clients
- **Team Member Selection**: Choose from available team members
- **Time Slot Booking**: Select available times based on team member availability
- **Meeting Type Selection**: Choose from different meeting types (consultation, portfolio review, etc.)
- **Booking Confirmation**: Receive confirmation with Google Meet links
- **Email Notifications**: Automatic email confirmations and calendar invites

### For Team Members
- **Availability Management**: Set recurring weekly schedules
- **One-Time Availability**: Override schedules for specific dates
- **Booking Dashboard**: View and manage upcoming meetings
- **Google Calendar Integration**: Automatic event creation

### For Administrators
- **Booking Oversight**: Monitor all bookings and team availability
- **Team Management**: Add/remove team members
- **System Configuration**: Manage meeting types and system settings

## Technical Architecture

### Frontend (React + TypeScript)
- **BookingFlow**: Main booking component with step-by-step process
- **TeamMemberSelector**: Team member selection interface
- **TimeSlotPicker**: Calendar and time slot selection
- **BookingForm**: Client information collection
- **BookingConfirmation**: Confirmation and next steps
- **AvailabilityManager**: Team member availability management

### Backend (Vercel Serverless Functions)
- **`/api/availability`**: Get available time slots
- **`/api/bookings`**: Create and retrieve bookings
- **`/api/auth/login`**: Team member authentication
- **`/api/availability/recurring`**: Manage recurring availability
- **`/api/availability/onetime`**: Manage one-time availability

### Data Storage
- **Vercel KV (Redis)**: Fast storage for availability and bookings
- **Google Calendar API**: Calendar integration
- **Email Service**: Automated notifications

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file with the following variables:

```env
# Google Calendar Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# Team Member Credentials (for demo purposes)
TEAM_MEMBER_1_EMAIL=john@buckscapital.org
TEAM_MEMBER_1_PASSWORD=password123
TEAM_MEMBER_2_EMAIL=sarah@buckscapital.org
TEAM_MEMBER_2_PASSWORD=password123
TEAM_MEMBER_3_EMAIL=michael@buckscapital.org
TEAM_MEMBER_3_PASSWORD=password123

# Email Service (choose one)
SENDGRID_API_KEY=your-sendgrid-api-key
# OR
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2. Google Calendar Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API
4. Create a Service Account
5. Download the JSON key file
6. Extract the `client_email` and `private_key` for environment variables
7. Share your calendar with the service account email

### 3. Vercel KV Setup
1. Go to your Vercel dashboard
2. Navigate to Storage tab
3. Create a new KV database
4. The connection will be automatically configured

### 4. Installation
```bash
# Install dependencies
npm install

# Install new dependencies for booking system
npm install @vercel/kv googleapis

# Start development server
npm run dev
```

## Usage

### For Clients
1. Visit `/booking` to start the booking process
2. Select a team member
3. Choose a date and time slot
4. Select meeting type
5. Fill in contact information
6. Confirm booking

### For Team Members
1. Visit `/team-availability` to manage availability
2. Sign in with team credentials
3. Set recurring weekly schedule
4. Add one-time availability overrides
5. Save changes

### For Administrators
1. Access admin panel at `/admin`
2. Monitor bookings and availability
3. Manage team members and settings

## API Endpoints

### Availability
- `GET /api/availability?memberId={id}&date={date}` - Get available time slots
- `GET /api/availability/recurring?memberId={id}` - Get recurring availability
- `POST /api/availability/recurring` - Save recurring availability
- `GET /api/availability/onetime?memberId={id}` - Get one-time availability
- `POST /api/availability/onetime` - Save one-time availability

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings?teamMemberId={id}&date={date}` - Get bookings

### Authentication
- `POST /api/auth/login` - Team member login

## Customization

### Adding New Team Members
1. Update the team members array in `BookingFlow.tsx`
2. Add credentials to environment variables
3. Update the login API to include new member

### Adding Meeting Types
1. Update the `meetingTypes` array in `BookingFlow.tsx`
2. Modify the `MeetingType` interface if needed

### Styling
- All components use Tailwind CSS
- Customize colors and styling in component files
- Maintains consistency with existing Bucks Capital design

## Security Considerations

1. **Authentication**: Implement proper JWT tokens for production
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Input Validation**: Validate all user inputs
4. **HTTPS**: Ensure all communications are encrypted
5. **Environment Variables**: Keep sensitive data in environment variables

## Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Setup
1. Vercel KV will be automatically configured
2. Google Calendar API credentials need to be set
3. Email service configuration required

## Monitoring and Maintenance

### Logs
- Check Vercel function logs for errors
- Monitor Google Calendar API usage
- Track email delivery rates

### Regular Tasks
- Review and update team member availability
- Monitor booking patterns
- Update meeting types as needed
- Backup important data

## Troubleshooting

### Common Issues
1. **Time Zone Issues**: Ensure all times are properly converted
2. **Google Calendar Errors**: Check service account permissions
3. **Email Delivery**: Verify email service configuration
4. **Availability Not Showing**: Check KV database connectivity

### Debug Mode
- Enable console logging in development
- Check network requests in browser dev tools
- Review Vercel function logs

## Future Enhancements

1. **Recurring Meetings**: Support for recurring client meetings
2. **Waitlist**: Queue system for popular time slots
3. **Mobile App**: Native mobile application
4. **Advanced Scheduling**: Buffer times, travel time, etc.
5. **Integration**: CRM and other business tool integrations
6. **Analytics**: Booking patterns and team performance metrics

## Support

For technical support or questions about the booking system:
- Email: shreyasRaju3249@gmail.com
- Phone: 267-945-7717

## License

This booking system is proprietary to Bucks Capital and is not for public distribution.
