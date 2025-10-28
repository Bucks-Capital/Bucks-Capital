import { supabase, type TeamMember, type Availability, type Booking, type AuthUser } from './supabase';

// Team Members Service
export const teamMembersService = {
  async getAll(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<TeamMember | null> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Availability Service
export const availabilityService = {
  async getByTeamMember(teamMemberId: string, type?: 'recurring' | 'onetime'): Promise<Availability[]> {
    let query = supabase
      .from('availability')
      .select('*')
      .eq('team_member_id', teamMemberId)
      .eq('is_active', true)
      .order('day_of_week', { ascending: true });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async save(teamMemberId: string, availability: Omit<Availability, 'id' | 'team_member_id' | 'created_at' | 'updated_at'>[]): Promise<Availability[]> {
    // First, deactivate existing availability for this team member and type
    const type = availability[0]?.type;
    if (type) {
      await supabase
        .from('availability')
        .update({ is_active: false })
        .eq('team_member_id', teamMemberId)
        .eq('type', type);
    }

    // Insert new availability
    const availabilityData = availability.map(av => ({
      ...av,
      team_member_id: teamMemberId
    }));

    const { data, error } = await supabase
      .from('availability')
      .insert(availabilityData)
      .select();

    if (error) throw error;
    return data || [];
  }
};

// Bookings Service
export const bookingsService = {
  async create(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        team_members (
          name,
          email,
          role
        )
      `)
      .order('meeting_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getByTeamMember(teamMemberId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('team_member_id', teamMemberId)
      .order('meeting_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async updateStatus(id: string, status: Booking['status']): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Authentication Service
export const authService = {
  async login(email: string, password: string): Promise<AuthUser | null> {
    // In production, you'd verify the password hash here
    // For now, we'll use a simple check
    const { data, error } = await supabase
      .from('auth_users')
      .select(`
        *,
        team_members (
          id,
          name,
          email,
          role
        )
      `)
      .eq('email', email)
      .single();

    if (error || !data) return null;

    // Simple password check (in production, use proper password verification)
    if (password === 'BucksCapital2024!') {
      return {
        id: data.id,
        email: data.email,
        team_member_id: data.team_member_id,
        role: data.role,
        created_at: data.created_at
      };
    }

    return null;
  },

  async getUserById(id: string): Promise<AuthUser | null> {
    const { data, error } = await supabase
      .from('auth_users')
      .select(`
        *,
        team_members (
          id,
          name,
          email,
          role
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      team_member_id: data.team_member_id,
      role: data.role,
      created_at: data.created_at
    };
  }
};
