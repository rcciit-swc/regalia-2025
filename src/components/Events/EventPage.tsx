"use client"
import React from 'react'
import EventCard from './EventsCard'
import { useEvents } from "@/lib/stores"
import Link from 'next/link'
import { Music } from 'lucide-react'

const EventPage = () => {
    const { eventsData, eventsLoading } = useEvents()

    if (eventsLoading) {
        return (
            <div className="min-h-screen w-full flex justify-center items-center bg-[#3A0000] text-[#E8D0C9]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-[#E8D0C9] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xl font-serif">Loading events...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#210000] text-[#E8D0C9] pt-16 pb-20">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 pt-7 md:px-6 mb-12">
                <div className="relative py-8 border-b border-[#E8D0C9]/30">
                    <h1 className="text-4xl md:text-5xl font-serif text-center mb-4">
                        Our Events
                    </h1>
                    
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Music className="w-6 h-6 text-[#E8D0C9]" />
                        <div className="h-[2px] w-32 bg-[#E8D0C9]"></div>
                    </div>
                    
                </div>
            </div>

            {/* Events Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {eventsData?.map((event, index) => (
                        <Link 
                            key={index}
                            href={`/events/${encodeURIComponent(event.name.toLowerCase())}`}
                            className="block"
                        >
                            <EventCard
                                name={event.name}
                                image_url={event.image_url}
                                registration_fees={event.registration_fees}
                                registered={event.registered}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EventPage
