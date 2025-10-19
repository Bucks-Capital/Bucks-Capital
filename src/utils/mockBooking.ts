import { Booking } from '@/types/booking';
import { BookingFormData } from '@/components/booking/BookingForm';

export interface MockBookingData {
  teamMemberId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  meetingType: string;
  duration: number;
  startTime: string;
  endTime: string;
  timezone: string;
  notes?: string;
}

export const createMockBooking = async (bookingData: MockBookingData): Promise<Booking> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate mock booking
  const booking: Booking = {
    id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    teamMemberId: bookingData.teamMemberId,
    clientName: bookingData.clientName,
    clientEmail: bookingData.clientEmail,
    clientPhone: bookingData.clientPhone,
    meetingType: bookingData.meetingType,
    duration: bookingData.duration,
    startTime: bookingData.startTime,
    endTime: bookingData.endTime,
    timezone: bookingData.timezone,
    status: 'confirmed',
    googleEventId: `mock_event_${Date.now()}`,
    googleMeetLink: `https://meet.google.com/abc-defg-hij`, // Mock link for development
    notes: bookingData.notes,
    createdAt: new Date().toISOString()
  };

  return booking;
};
