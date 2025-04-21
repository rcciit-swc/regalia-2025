import Image from "next/image"

interface EventCardProps {
    name: string;
    image_url: string;
    registration_fees: number;
    registered?: boolean;
}

const EventCard = ({ name, image_url, registration_fees, registered }: EventCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-[#E8D0C9]/30 bg-[#5A0000] transition-all duration-300 hover:shadow-[0_0_15px_rgba(232,208,201,0.3)] hover:-translate-y-1">
      {/* Image container */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={image_url || "/placeholder.svg"}
          alt={name || "Event image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3A0000] via-transparent to-transparent opacity-80"></div>
      </div>

      {/* Content */}
      <div className="p-5 border-t border-[#E8D0C9]/20">
        <h3 className="text-xl font-serif text-[#E8D0C9] mb-4 line-clamp-2 min-h-[56px]">
          {name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-serif text-[#E8D0C9]">
            ₹{registration_fees}
          </span>
          {registered && (
            <span className="px-3 py-1 text-sm font-serif bg-[#5A3000] text-[#E8D0C9] rounded-full border border-[#E8D0C9]/30">
              Registered
            </span>
          )}
        </div>

        {/* Button */}
        <button
          disabled={registered}
          className={`w-full py-3 rounded-none font-serif text-lg transition-all ${
            registered
              ? "bg-[#5A3000]/50 text-[#E8D0C9]/50 cursor-not-allowed border border-[#E8D0C9]/20"
              : "bg-[#5A0000] text-[#E8D0C9] border border-[#E8D0C9] hover:bg-[#E8D0C9] hover:text-[#3A0000] active:scale-[0.98]"
          }`}
        >
          {registered ? "Registered" : "Register Now"}
        </button>
      </div>
    </div>
  )
}

export default EventCard
