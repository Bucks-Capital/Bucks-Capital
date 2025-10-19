export interface TeamMember {
  id: string;
  name: string;
  email: string;
  title: string;
  bio?: string;
  avatar?: string;
  timezone: string;
  isActive: boolean;
}

export interface Availability {
  id: string;
  teamMemberId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isRecurring: boolean;
  date?: string; // For one-time availability
}

export interface Booking {
  id: string;
  teamMemberId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  meetingType: string;
  duration: number; // minutes
  startTime: string; // ISO string
  endTime: string; // ISO string
  timezone: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  googleEventId?: string;
  googleMeetLink?: string;
  notes?: string;
  createdAt: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  teamMemberId: string;
}

export interface MeetingType {
  id: string;
  name: string;
  duration: number; // minutes
  description?: string;
  isActive: boolean;
}
