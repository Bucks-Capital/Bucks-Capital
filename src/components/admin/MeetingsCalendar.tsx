import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Mail, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface Meeting {
  id: string;
  teamMemberId: string;
  teamMemberName: string;
  clientName: string;
  clientEmail: string;
  meetingType: string;
  startTime: string;
  endTime: string;
  status: string;
  googleMeetLink?: string;
}

interface MeetingsCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export default function MeetingsCalendar({ selectedDate, onDateSelect }: MeetingsCalendarProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    fetchMeetings();
  }, [currentDate, viewMode]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      
      let startDate: string;
      let endDate: string;
      
      if (viewMode === 'month') {
        const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        startDate = start.toISOString();
        endDate = end.toISOString();
      } else if (viewMode === 'week') {
        const start = new Date(currentDate);
        start.setDate(currentDate.getDate() - currentDate.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        startDate = start.toISOString();
        endDate = end.toISOString();
      } else {
        const start = new Date(currentDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(currentDate);
        end.setHours(23, 59, 59, 999);
        startDate = start.toISOString();
        endDate = end.toISOString();
      }

      const response = await fetch(`/api/meetings?startDate=${startDate}&endDate=${endDate}`);
      if (response.ok) {
        const data = await response.json();
        setMeetings(data.meetings);
      } else {
        console.error('Failed to fetch meetings');
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.startTime);
      return meetingDate.toDateString() === date.toDateString();
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  const getCalendarDays = () => {
    if (viewMode === 'day') {
      return [currentDate];
    }
    
    const start = new Date(currentDate);
    if (viewMode === 'month') {
      start.setDate(1);
      start.setDate(start.getDate() - start.getDay());
    } else {
      start.setDate(currentDate.getDate() - currentDate.getDay());
    }
    
    const days = [];
    const endDate = new Date(start);
    endDate.setDate(start.getDate() + (viewMode === 'month' ? 41 : 6));
    
    for (let d = new Date(start); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading meetings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {viewMode === 'month' && (
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-gray-100 p-2 text-center text-sm font-medium">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {getCalendarDays().map((day, index) => {
                const dayMeetings = getMeetingsForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                
                return (
                  <div
                    key={index}
                    className={`bg-white p-2 min-h-[100px] ${
                      !isCurrentMonth ? 'text-gray-400' : ''
                    } ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                      {day.getDate()}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayMeetings.slice(0, 3).map(meeting => (
                        <div
                          key={meeting.id}
                          className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate"
                          title={`${meeting.clientName} - ${meeting.meetingType}`}
                        >
                          {formatTime(meeting.startTime)} {meeting.clientName}
                        </div>
                      ))}
                      {dayMeetings.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayMeetings.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'week' && (
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {getCalendarDays().map((day, index) => {
                const dayMeetings = getMeetingsForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <div key={index} className="bg-white p-2 min-h-[120px]">
                    <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                      {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                    </div>
                    <div className="mt-2 space-y-1">
                      {dayMeetings.map(meeting => (
                        <div
                          key={meeting.id}
                          className="text-xs bg-blue-100 text-blue-800 p-1 rounded"
                        >
                          <div className="font-medium">{formatTime(meeting.startTime)}</div>
                          <div className="truncate">{meeting.clientName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'day' && (
            <div className="p-4">
              <div className="text-lg font-semibold mb-4">
                {currentDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
              <div className="space-y-2">
                {getMeetingsForDate(currentDate).map(meeting => (
                  <div key={meeting.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{meeting.clientName}</div>
                        <div className="text-sm text-gray-600">{meeting.meetingType}</div>
                        <div className="text-sm text-gray-500">with {meeting.teamMemberName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatTime(meeting.startTime)}</div>
                        <Badge variant="secondary">{meeting.status}</Badge>
                      </div>
                    </div>
                    {meeting.googleMeetLink && (
                      <div className="mt-2">
                        <a
                          href={meeting.googleMeetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>
                ))}
                {getMeetingsForDate(currentDate).length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No meetings scheduled for this day
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meetings List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {meetings.slice(0, 5).map(meeting => (
              <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{meeting.clientName}</div>
                    <div className="text-sm text-gray-600">{meeting.meetingType}</div>
                    <div className="text-sm text-gray-500">with {meeting.teamMemberName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatDate(meeting.startTime)}</div>
                  <div className="text-sm text-gray-600">{formatTime(meeting.startTime)}</div>
                  <Badge variant="secondary" className="mt-1">{meeting.status}</Badge>
                </div>
              </div>
            ))}
            {meetings.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No meetings scheduled
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
