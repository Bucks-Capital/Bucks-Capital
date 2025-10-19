import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '@/types/booking';
import { Calendar, Clock, User } from 'lucide-react';

interface TeamMemberSelectorProps {
  teamMembers: TeamMember[];
  onSelect: (member: TeamMember) => void;
}

export default function TeamMemberSelector({ teamMembers, onSelect }: TeamMemberSelectorProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleSelect = (member: TeamMember) => {
    setSelectedMember(member);
    onSelect(member);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Choose a Team Member</h2>
        <p className="text-gray-600 mt-2">Select who you'd like to meet with</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.filter(member => member.isActive).map((member) => (
          <Card 
            key={member.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedMember?.id === member.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleSelect(member)}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{member.name}</CardTitle>
              <CardDescription className="text-blue-600 font-medium">
                {member.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {member.bio && (
                <p className="text-sm text-gray-600 mb-4 text-center">
                  {member.bio}
                </p>
              )}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{member.timezone}</span>
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="w-full justify-center">
                  <User className="w-4 h-4 mr-1" />
                  Available for meetings
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMember && (
        <div className="text-center">
          <Button 
            size="lg" 
            className="px-8"
            onClick={() => onSelect(selectedMember)}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Continue with {selectedMember.name}
          </Button>
        </div>
      )}
    </div>
  );
}
