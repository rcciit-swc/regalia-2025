"use client"
import React from 'react'
import EventCard from './EventsCard'
import { useEvents } from "@/lib/stores"
import { useEffect } from "react"
import Link from 'next/link'

const EventPage = () => {
    const { eventsData, eventsLoading, setEventsData } = useEvents()

    useEffect(() => {
        setEventsData()
    }, [setEventsData])

    if (eventsLoading) {
        return <div className="min-h-screen w-full flex justify-center items-center pt-24 md:pt-32">Loading events...</div>
    }
if (eventsData) console.log(eventsData)
    return (
        <div className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {eventsData?.map((event, index) => (
                    <Link
                    href={`/events/${encodeURIComponent(event.name.toLowerCase())}`}
                  >
                    <EventCard
                        key={index}
                        name={event.name}
                        image_url={event.image_url}
                        registration_fees={event.registration_fees}
                        registered={event.registered}
                    />
                    </Link>
                ))}
            </div>
        </div>
    )
}



export default EventPage