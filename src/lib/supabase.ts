import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not found. Using mock data in development.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  team_member_id: string;
  day_of_week?: string;
  start_time?: string;
  end_time?: string;
  date?: string; // For one-time availability
  is_active: boolean;
  type: 'recurring' | 'onetime';
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  team_member_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  meeting_type: string;
  meeting_date: string;
  meeting_time: string;
  meeting_duration: number;
  google_meet_link?: string;
  google_calendar_event_id?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  team_member_id?: string;
  role: 'admin' | 'team_member';
  created_at: string;
}
