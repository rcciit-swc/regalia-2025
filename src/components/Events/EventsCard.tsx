import Image from "next/image"

interface EventCardProps {
    name: string;
    image_url: string;
    registration_fees: number;
    registered?: boolean;
}

const EventsCard = ({ name, image_url, registration_fees, registered }: EventCardProps) => {
  return (
    <div className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {/* Individual Card - Now with better width */}
        <div className="group relative p-6 w-full min-w-[280px] rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/20 backdrop-blur-lg shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
          
          {/* Image container */}
          <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
            <Image
              src={image_url || "/placeholder.svg"}
              alt={name || "Event image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-xl font-bold text-white line-clamp-2 min-h-[56px]">
              {name}
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-white">
                ₹{registration_fees}
              </span>
              {registered && (
                <span className="px-3 py-1 text-sm font-medium bg-green-500/20 text-green-400 rounded-full">
                  Registered
                </span>
              )}
            </div>

            {/* Button */}
            <button
              disabled={registered}
              className={`w-full py-3 rounded-lg font-medium text-lg transition-all ${
                registered
                  ? "bg-gray-600/30 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:scale-[0.98]"
              }`}
            >
              {registered ? "Registered" : "Register Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventsCard