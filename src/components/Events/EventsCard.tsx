"use client"
import { useEvents } from "@/lib/stores"
import { useEffect } from "react"
import Image from "next/image"

const EventsCard = () => {
  const { eventsData, eventsLoading, setEventsData } = useEvents()

  useEffect(() => {
    setEventsData()
  }, [setEventsData])

  if (eventsLoading) {
    return <div className="min-h-screen w-full flex justify-center items-center pt-24 md:pt-32">Loading events...</div>
  }

  return (
    // Add padding-top to create space for the fixed navbar
    <div className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {eventsData?.map((event, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md backdrop-blur">
            <div className="relative w-full h-48 mb-3 overflow-hidden rounded">
              <Image
                src={event.image_url || "/placeholder.svg"}
                alt={event.name || "Event image"}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
            <p className="text-sm text-gray-500 mb-4">Registration Fees: {event.registration_fees}</p>
            <button
              disabled={event.registered}
              className={`w-full px-4 py-2 rounded ${
                event.registered
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } transition-colors`}
            >
              {event.registered ? "Registered" : "Register"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventsCard
