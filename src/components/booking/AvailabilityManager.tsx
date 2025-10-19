import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Availability } from '@/types/booking';
import { Clock, Calendar, Plus, Trash2, Save } from 'lucide-react';

interface AvailabilityManagerProps {
  teamMemberId: string;
}

export default function AvailabilityManager({ teamMemberId }: AvailabilityManagerProps) {
  const [recurringAvailability, setRecurringAvailability] = useState<Availability[]>([]);
  const [oneTimeAvailability, setOneTimeAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  useEffect(() => {
    fetchAvailability();
  }, [teamMemberId]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      console.log('📅 Fetching availability for member:', teamMemberId);
      
      // Fetch recurring availability
      const recurringResponse = await fetch(`/api/availability-simple?memberId=${teamMemberId}&type=recurring`);
      if (recurringResponse.ok) {
        const recurring = await recurringResponse.json();
        console.log('✅ Recurring availability loaded:', recurring.length, 'items');
        setRecurringAvailability(recurring);
      } else {
        console.error('❌ Failed to fetch recurring availability');
        setRecurringAvailability([]);
      }

      // Fetch one-time availability
      const oneTimeResponse = await fetch(`/api/availability-simple?memberId=${teamMemberId}&type=onetime`);
      if (oneTimeResponse.ok) {
        const oneTime = await oneTimeResponse.json();
        console.log('✅ One-time availability loaded:', oneTime.length, 'items');
        setOneTimeAvailability(oneTime);
      } else {
        console.error('❌ Failed to fetch one-time availability');
        setOneTimeAvailability([]);
      }
    } catch (error) {
      console.error('🚨 Error fetching availability:', error);
      setError('Failed to load availability. Please try again.');
      // Set empty arrays on error to prevent crashes
      setRecurringAvailability([]);
      setOneTimeAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  const addRecurringAvailability = () => {
    const newAvailability: Availability = {
      id: `temp_${Date.now()}`,
      teamMemberId,
      dayOfWeek: 1, // Monday
      startTime: '09:00',
      endTime: '17:00',
      isRecurring: true
    };
    setRecurringAvailability([...recurringAvailability, newAvailability]);
  };

  const updateRecurringAvailability = (id: string, updates: Partial<Availability>) => {
    setRecurringAvailability(prev => 
      prev.map(avail => 
        avail.id === id ? { ...avail, ...updates } : avail
      )
    );
  };

  const removeRecurringAvailability = (id: string) => {
    setRecurringAvailability(prev => prev.filter(avail => avail.id !== id));
  };

  const addOneTimeAvailability = () => {
    const newAvailability: Availability = {
      id: `temp_${Date.now()}`,
      teamMemberId,
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      isRecurring: false,
      date: new Date().toISOString().split('T')[0]
    };
    setOneTimeAvailability([...oneTimeAvailability, newAvailability]);
  };

  const updateOneTimeAvailability = (id: string, updates: Partial<Availability>) => {
    setOneTimeAvailability(prev => 
      prev.map(avail => 
        avail.id === id ? { ...avail, ...updates } : avail
      )
    );
  };

  const removeOneTimeAvailability = (id: string) => {
    setOneTimeAvailability(prev => prev.filter(avail => avail.id !== id));
  };

  const saveAvailability = async () => {
    setLoading(true);
    try {
      console.log('💾 Saving availability for member:', teamMemberId);
      console.log('📅 Recurring availability:', recurringAvailability);
      console.log('📅 One-time availability:', oneTimeAvailability);

      // Save recurring availability
      const recurringResponse = await fetch('/api/availability-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamMemberId,
          availability: recurringAvailability,
          type: 'recurring'
        })
      });

      if (!recurringResponse.ok) {
        throw new Error('Failed to save recurring availability');
      }

      // Save one-time availability
      const oneTimeResponse = await fetch('/api/availability-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamMemberId,
          availability: oneTimeAvailability,
          type: 'onetime'
        })
      });

      if (!oneTimeResponse.ok) {
        throw new Error('Failed to save one-time availability');
      }

      const recurringResult = await recurringResponse.json();
      const oneTimeResult = await oneTimeResponse.json();

      console.log('✅ Availability saved successfully:', {
        recurring: recurringResult,
        oneTime: oneTimeResult
      });

      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error('🚨 Error saving availability:', error);
      alert(`Error saving availability: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Manage Your Availability</h2>
          <p className="text-gray-600 mt-2">Set when you're available for client meetings</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading availability...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Manage Your Availability</h2>
          <p className="text-gray-600 mt-2">Set when you're available for client meetings</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Availability</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={fetchAvailability} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Manage Your Availability</h2>
        <p className="text-gray-600 mt-2">Set when you're available for client meetings</p>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-green-800 font-medium">Availability saved successfully!</span>
          </div>
        </div>
      )}

      <Tabs defaultValue="recurring" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recurring">Recurring Schedule</TabsTrigger>
          <TabsTrigger value="onetime">One-Time Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="recurring" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Weekly Schedule
                </CardTitle>
                <Button onClick={addRecurringAvailability} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Day
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recurringAvailability.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recurring availability set</p>
                  <p className="text-sm">Click "Add Day" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recurringAvailability.map((availability) => (
                    <div key={availability.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Day</Label>
                          <Select
                            value={availability.dayOfWeek.toString()}
                            onValueChange={(value) => updateRecurringAvailability(availability.id, { dayOfWeek: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {daysOfWeek.map((day, index) => (
                                <SelectItem key={index} value={index.toString()}>
                                  {day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={availability.startTime}
                            onChange={(e) => updateRecurringAvailability(availability.id, { startTime: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={availability.endTime}
                            onChange={(e) => updateRecurringAvailability(availability.id, { endTime: e.target.value })}
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeRecurringAvailability(availability.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onetime" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  One-Time Availability
                </CardTitle>
                <Button onClick={addOneTimeAvailability} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Date
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {oneTimeAvailability.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No one-time availability set</p>
                  <p className="text-sm">Click "Add Date" to set specific dates</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {oneTimeAvailability.map((availability) => (
                    <div key={availability.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={availability.date || ''}
                            onChange={(e) => updateOneTimeAvailability(availability.id, { date: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={availability.startTime}
                            onChange={(e) => updateOneTimeAvailability(availability.id, { startTime: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={availability.endTime}
                            onChange={(e) => updateOneTimeAvailability(availability.id, { endTime: e.target.value })}
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeOneTimeAvailability(availability.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button 
          onClick={saveAvailability} 
          disabled={loading}
          size="lg"
          className="px-8"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Availability
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
