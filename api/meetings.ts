import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For now, return mock meetings data
    // In production, this would fetch from your database
    const mockMeetings = [
      {
        id: 'booking_1',
        teamMemberId: '1',
        teamMemberName: 'Shreyas Raju',
        clientName: 'John Doe',
        clientEmail: 'john@example.com',
        meetingType: 'Initial Consultation',
        startTime: '2025-01-20T14:00:00.000Z',
        endTime: '2025-01-20T14:30:00.000Z',
        status: 'confirmed',
        googleMeetLink: 'https://meet.google.com/abc-defg-hij'
      },
      {
        id: 'booking_2',
        teamMemberId: '2',
        teamMemberName: 'Zahin Mulji',
        clientName: 'Jane Smith',
        clientEmail: 'jane@example.com',
        meetingType: 'Portfolio Review',
        startTime: '2025-01-21T10:00:00.000Z',
        endTime: '2025-01-21T11:00:00.000Z',
        status: 'confirmed',
        googleMeetLink: 'https://meet.google.com/xyz-1234-abc'
      },
      {
        id: 'booking_3',
        teamMemberId: '3',
        teamMemberName: 'Harrison Cornwell',
        clientName: 'Bob Johnson',
        clientEmail: 'bob@example.com',
        meetingType: 'Quick Check-in',
        startTime: '2025-01-22T15:00:00.000Z',
        endTime: '2025-01-22T15:15:00.000Z',
        status: 'confirmed',
        googleMeetLink: 'https://meet.google.com/def-5678-ghi'
      }
    ];

    // Filter by date range if provided
    const { startDate, endDate, teamMemberId } = req.query;
    
    let filteredMeetings = mockMeetings;
    
    if (startDate) {
      filteredMeetings = filteredMeetings.filter(meeting => 
        new Date(meeting.startTime) >= new Date(startDate as string)
      );
    }
    
    if (endDate) {
      filteredMeetings = filteredMeetings.filter(meeting => 
        new Date(meeting.startTime) <= new Date(endDate as string)
      );
    }
    
    if (teamMemberId) {
      filteredMeetings = filteredMeetings.filter(meeting => 
        meeting.teamMemberId === teamMemberId
      );
    }

    res.status(200).json({
      meetings: filteredMeetings,
      total: filteredMeetings.length
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
