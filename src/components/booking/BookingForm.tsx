import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TimeSlot, TeamMember, MeetingType } from '@/types/booking';
import { User, Mail, Phone, MessageSquare, Calendar, Clock } from 'lucide-react';

interface BookingFormProps {
  teamMember: TeamMember;
  selectedSlot: TimeSlot;
  meetingType: MeetingType;
  onSubmit: (bookingData: BookingFormData) => void;
  onBack: () => void;
}

export interface BookingFormData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
}

export default function BookingForm({ 
  teamMember, 
  selectedSlot, 
  meetingType, 
  onSubmit, 
  onBack 
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Complete Your Booking</h2>
        <p className="text-gray-600 mt-2">Please provide your contact information</p>
      </div>

      {/* Meeting Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Meeting Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center text-blue-800">
            <User className="w-4 h-4 mr-2" />
            <span className="font-medium">{teamMember.name}</span>
          </div>
          <div className="flex items-center text-blue-800">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatTime(selectedSlot.startTime)}</span>
          </div>
          <div className="flex items-center text-blue-800">
            <Clock className="w-4 h-4 mr-2" />
            <span>{meetingType.name} ({meetingType.duration} minutes)</span>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Full Name *
                </Label>
                <Input
                  id="clientName"
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => handleChange('clientName', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email Address *
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleChange('clientEmail', e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone" className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Phone Number (Optional)
              </Label>
              <Input
                id="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => handleChange('clientPhone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any specific topics you'd like to discuss or questions you have..."
                rows={3}
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.clientName || !formData.clientEmail}
                className="flex-1"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
