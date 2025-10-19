import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { TimeSlot, TeamMember, MeetingType } from '@/types/booking';
import { Clock, Calendar as CalendarIcon, Check } from 'lucide-react';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';

interface TimeSlotPickerProps {
  teamMember: TeamMember;
  meetingTypes: MeetingType[];
  onTimeSelect: (slot: TimeSlot, meetingType: MeetingType) => void;
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
}

export default function TimeSlotPicker({ 
  teamMember, 
  meetingTypes, 
  onTimeSelect, 
  selectedDate,
  onDateSelect 
}: TimeSlotPickerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType | null>(null);
  const [loading, setLoading] = useState(false);

  const currentDate = selectedDate || new Date();
  const maxDate = addDays(new Date(), 30);

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate, teamMember.id]);

  const fetchTimeSlots = async (date: Date) => {
    setLoading(true);
    try {
      // This would call your Vercel API endpoint
      const response = await fetch(`/api/availability?memberId=${teamMember.id}&date=${date.toISOString()}`);
      const slots = await response.json();
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleMeetingTypeSelect = (meetingType: MeetingType) => {
    setSelectedMeetingType(meetingType);
  };

  const handleConfirm = () => {
    if (selectedSlot && selectedMeetingType) {
      onTimeSelect(selectedSlot, selectedMeetingType);
    }
  };

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };

  const groupSlotsByTime = (slots: TimeSlot[]) => {
    const groups: { [key: string]: TimeSlot[] } = {};
    slots.forEach(slot => {
      const timeKey = slot.startTime.split('T')[1].substring(0, 5);
      if (!groups[timeKey]) {
        groups[timeKey] = [];
      }
      groups[timeKey].push(slot);
    });
    return groups;
  };

  const groupedSlots = groupSlotsByTime(timeSlots);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Select a Time</h2>
        <p className="text-gray-600 mt-2">Choose when you'd like to meet with {teamMember.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => date && onDateSelect(date)}
              disabled={(date) => date < startOfDay(new Date()) || date > maxDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Meeting Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Meeting Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {meetingTypes.filter(type => type.isActive).map((type) => (
                <Button
                  key={type.id}
                  variant={selectedMeetingType?.id === type.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleMeetingTypeSelect(type)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {type.name} ({type.duration} min)
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              Available Times for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading available times...</p>
              </div>
            ) : Object.keys(groupedSlots).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(groupedSlots).map(([time, slots]) => (
                  <Button
                    key={time}
                    variant={selectedSlot?.startTime === slots[0].startTime ? "default" : "outline"}
                    className="h-12"
                    onClick={() => handleSlotSelect(slots[0])}
                    disabled={!slots[0].isAvailable}
                  >
                    {formatTime(time)}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No available times for this date</p>
                <p className="text-sm text-gray-500 mt-1">Try selecting a different date</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirm Selection */}
      {selectedSlot && selectedMeetingType && (
        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900">Selected Meeting</h3>
            <p className="text-blue-700">
              {format(new Date(selectedSlot.startTime), 'EEEE, MMMM d, yyyy')} at {formatTime(selectedSlot.startTime.split('T')[1])}
            </p>
            <p className="text-sm text-blue-600">
              {selectedMeetingType.name} ({selectedMeetingType.duration} minutes)
            </p>
          </div>
          <Button size="lg" onClick={handleConfirm} className="px-8">
            <Check className="w-5 h-5 mr-2" />
            Confirm Selection
          </Button>
        </div>
      )}
    </div>
  );
}
