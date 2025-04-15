import React from 'react'
import EventDetails from '@/components/Events/EventDetails'

 const Page = async ({ params }: { params: { eventId: string } }) => {
    const eventId = decodeURIComponent(params.eventId)

    return (
        <div>
            <EventDetails eventName={eventId} />
        </div>
    )
}

export default Page
