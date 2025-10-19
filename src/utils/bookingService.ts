import { Booking } from '@/types/booking';
import { BookingFormData } from '@/components/booking/BookingForm';
import { createMockBooking } from './mockBooking';
import { sendMockBookingEmail } from './mockEmail';

// Detect if we're in development or production
const isDevelopment = import.meta.env.DEV;

export interface BookingData {
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

export const createBooking = async (bookingData: BookingData): Promise<Booking> => {
  if (isDevelopment) {
    // Use mock booking for development
    return await createMockBooking(bookingData);
  } else {
    // Use real API for production
    try {
      const response = await fetch('/api/bookings-production', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const booking = await response.json();
        return booking;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
};

export const sendBookingEmails = async (booking: Booking, teamMemberName: string): Promise<void> => {
  if (isDevelopment) {
    // Use mock email for development
    await sendMockBookingEmail(booking, teamMemberName);
  } else {
    // In production, emails are sent by the API endpoint
    // The /api/bookings endpoint handles email sending
    console.log('Emails will be sent by the API endpoint');
  }
};
