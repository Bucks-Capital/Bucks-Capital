import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/types/booking';
import { Calendar, Clock, User, Mail, Phone, ExternalLink, CheckCircle } from 'lucide-react';

interface BookingConfirmationProps {
  booking: Booking;
  teamMemberName: string;
  onNewBooking: () => void;
}

export default function BookingConfirmation({ 
  booking, 
  teamMemberName, 
  onNewBooking 
}: BookingConfirmationProps) {
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    return `${durationMinutes} minutes`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h2>
        <p className="text-gray-600 mt-2">
          Your meeting has been scheduled successfully
        </p>
      </div>

      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">Meeting Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center text-green-800">
            <User className="w-5 h-5 mr-3" />
            <div>
              <p className="font-semibold">{teamMemberName}</p>
              <p className="text-sm text-green-700">Your meeting host</p>
            </div>
          </div>

          <div className="flex items-center text-green-800">
            <Calendar className="w-5 h-5 mr-3" />
            <div>
              <p className="font-semibold">{formatTime(booking.startTime)}</p>
              <p className="text-sm text-green-700">
                Duration: {formatDuration(booking.startTime, booking.endTime)}
              </p>
            </div>
          </div>

          {booking.googleMeetLink && (
            <div className="flex items-center text-green-800">
              <ExternalLink className="w-5 h-5 mr-3" />
              <div>
                <p className="font-semibold">Google Meet Link</p>
                <a 
                  href={booking.googleMeetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Join Meeting
                </a>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-green-200">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1" />
              Confirmed
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start">
            <Mail className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
            <div>
              <p className="font-semibold">Email Confirmations</p>
              <p className="text-sm text-gray-600">
                You and {teamMemberName} will receive email confirmations with meeting details and calendar invites.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
            <div>
              <p className="font-semibold">Calendar Integration</p>
              <p className="text-sm text-gray-600">
                The meeting has been added to both calendars automatically.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
            <div>
              <p className="font-semibold">Meeting Reminders</p>
              <p className="text-sm text-gray-600">
                You'll receive email reminders before the meeting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <p className="text-gray-600">
          Need to make changes? Contact us at{' '}
          <a href="mailto:info@buckscapital.org" className="text-blue-600 hover:text-blue-800">
            info@buckscapital.org
          </a>
        </p>
        
        <div className="flex space-x-4 justify-center">
          <Button variant="outline" onClick={onNewBooking}>
            Schedule Another Meeting
          </Button>
          <Button onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
