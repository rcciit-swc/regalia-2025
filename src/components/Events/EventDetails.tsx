"use client"
import { useEvents, useUser } from '@/lib/stores';
import { login } from '@/utils/functions/auth/login';
import React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface EventDetailsProps {
  eventName: string;
}
// TODO:
const EventDetails = ({ eventName }: EventDetailsProps) => {
  const { eventsData, eventsLoading } = useEvents();
  const [isSoloOpen, setIsSoloOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const { userData, userLoading } = useUser();
  const router = useRouter();

  const eventData = eventsData.find(
    (e) => e.name.toLowerCase() === eventName.toLowerCase()
  );

  if (eventsLoading) {
    return (
      <div className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto">
        <p className="text-center text-lg">Event not found</p>
      </div>
    );
  }

  const handleRegister = async () => {
    if (userLoading) {
      toast.info('Please wait while we check your login status');
      return;
    }
    if (!userData) {
      await login();
      return;
    }

    if (
      !userData.phone ||
      !userData.name ||
      userData.phone.trim() === '' ||
      userData.name.trim() === ''
    ) {
      router.push(
        `/profile?onboarding=true&callback=${encodeURIComponent(`/events/${eventName}`)}`
      );
      return;
    }

    if (eventData.max_team_size === 1) {
      setIsSoloOpen(true);
    } else {
      setIsTeamOpen(true);
    }
  };

  return (
    <div className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h1 className="text-2xl font-bold mb-4">{eventData.name}</h1>
        
        <div className="space-y-4">
          <p className="text-lg">{eventData.description}</p>
          
          {eventData.reg_status && (
            <button
              disabled={eventData.registered}
              onClick={handleRegister}
              className={`px-6 py-2 rounded-lg font-medium ${
                eventData.registered
                  ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors`}
            >
              {eventData.registered ? 'Already Registered' : 'Register Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;