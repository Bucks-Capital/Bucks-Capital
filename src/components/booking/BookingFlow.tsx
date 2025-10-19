import { useState } from 'react';
import { TeamMember, TimeSlot, MeetingType, Booking } from '@/types/booking';
import { BookingFormData } from './BookingForm';
import TeamMemberSelector from './TeamMemberSelector';
import TimeSlotPicker from './TimeSlotPicker';
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';
import { teamMembers } from '@/config/teamMembers';
import { createMockBooking } from '@/utils/mockBooking';

type BookingStep = 'select-member' | 'select-time' | 'booking-form' | 'confirmation';

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('select-member');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  // Team members are now imported from configuration file

  const meetingTypes: MeetingType[] = [
    {
      id: '1',
      name: 'Initial Consultation',
      duration: 30,
      description: 'Get to know each other and discuss your financial goals',
      isActive: true
    },
    {
      id: '2',
      name: 'Portfolio Review',
      duration: 45,
      description: 'Comprehensive review of your current investment portfolio',
      isActive: true
    },
    {
      id: '3',
      name: 'Strategy Session',
      duration: 60,
      description: 'Deep dive into investment strategies and financial planning',
      isActive: true
    },
    {
      id: '4',
      name: 'Quick Check-in',
      duration: 15,
      description: 'Brief update on your investments and market outlook',
      isActive: true
    }
  ];

  const handleMemberSelect = (member: TeamMember) => {
    setSelectedMember(member);
    setCurrentStep('select-time');
  };

  const handleTimeSelect = (slot: TimeSlot, meetingType: MeetingType) => {
    setSelectedSlot(slot);
    setSelectedMeetingType(meetingType);
    setCurrentStep('booking-form');
  };

  const handleBookingSubmit = async (formData: BookingFormData) => {
    if (!selectedMember || !selectedSlot || !selectedMeetingType) return;

    setLoading(true);
    try {
      // Use mock booking for development
      const bookingData = await createMockBooking({
        teamMemberId: selectedMember.id,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        meetingType: selectedMeetingType.name,
        duration: selectedMeetingType.duration,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        timezone: selectedMember.timezone,
        notes: formData.notes
      });

      setBooking(bookingData);
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'select-time':
        setCurrentStep('select-member');
        break;
      case 'booking-form':
        setCurrentStep('select-time');
        break;
      default:
        break;
    }
  };

  const handleNewBooking = () => {
    setCurrentStep('select-member');
    setSelectedMember(null);
    setSelectedSlot(null);
    setSelectedMeetingType(null);
    setBooking(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'select-member':
        return (
          <TeamMemberSelector
            teamMembers={teamMembers}
            onSelect={handleMemberSelect}
          />
        );
      
      case 'select-time':
        return selectedMember ? (
          <TimeSlotPicker
            teamMember={selectedMember}
            meetingTypes={meetingTypes}
            onTimeSelect={handleTimeSelect}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        ) : null;
      
      case 'booking-form':
        return selectedMember && selectedSlot && selectedMeetingType ? (
          <BookingForm
            teamMember={selectedMember}
            selectedSlot={selectedSlot}
            meetingType={selectedMeetingType}
            onSubmit={handleBookingSubmit}
            onBack={handleBack}
          />
        ) : null;
      
      case 'confirmation':
        return booking && selectedMember ? (
          <BookingConfirmation
            booking={booking}
            teamMemberName={selectedMember.name}
            onNewBooking={handleNewBooking}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 'select-member', label: 'Select Member', completed: currentStep !== 'select-member' },
              { step: 'select-time', label: 'Choose Time', completed: currentStep === 'booking-form' || currentStep === 'confirmation' },
              { step: 'booking-form', label: 'Your Details', completed: currentStep === 'confirmation' },
              { step: 'confirmation', label: 'Confirmed', completed: currentStep === 'confirmation' }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  item.completed 
                    ? 'bg-green-600 text-white' 
                    : currentStep === item.step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {item.completed ? '✓' : index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep === item.step ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}>
                  {item.label}
                </span>
                {index < 3 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    item.completed ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        {renderCurrentStep()}
      </div>
    </div>
  );
}
