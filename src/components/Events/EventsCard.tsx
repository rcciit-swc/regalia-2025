"use client"
import React from 'react'
import { useEvents } from '@/lib/stores';
import { useEffect } from 'react';
import Image from 'next/image';
const EventsCard = () => {

    const { eventsData, eventsLoading, setEventsData } = useEvents();

    useEffect(() => {
        setEventsData();
      }, [setEventsData]);

      if (eventsLoading) {
        return (
          <div className="min-h-screen w-full flex justify-center items-center">
            Loading events...
          </div>
        );
      }
     if(eventsData) console.log("Event Details(eventsData):",eventsData)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventsData.map((event, index) => (
            <div key={index} className="p-4 border rounded shadow">
                <Image width={100} height={100} src={event.image_url} alt={event.name || "Event image"} />
                <p className="">{event.name}</p>
                <p className="text-sm text-gray-500">Registration Fees:{event.registration_fees}</p>
               <button 
                   disabled={event.registered} 
                   className={`px-4 py-2 rounded ${
                       event.registered 
                       ? 'bg-gray-400 text-white cursor-not-allowed' 
                       : 'bg-blue-500 text-white hover:bg-blue-600'
                   }`}
               >
                   {event.registered ? 'Registered' : 'Register'}
               </button>
            </div>
        ))}
    </div>
  )
}

export default EventsCard