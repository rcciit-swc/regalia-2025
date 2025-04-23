import { Music } from "lucide-react"

import { sampleData } from "@/utils/constraints/constants/gallery"
import AnimatedGallery from "@/components/Gallery/AnimatedGallery"

const Gallery = () => {
  // Split images into three groups for different rows
  const images = sampleData.map((item) => item.image)
  const firstRowImages = images.slice(0, 6)
  const secondRowImages = images.slice(6, 12)
  const thirdRowImages = images.slice(12)

  return (
    <div className="w-full h-full relative flex flex-col min-h-screen max-lg:pt-40 pt-40 pb-20 items-center justify-center">
      <div className="relative py-4 border-b border-[#E8D0C9]/30">
        <h1 className="text-4xl md:text-5xl text-center mb-4 font-antolia">Our Gallery</h1>
        <div className="flex justify-center items-center gap-2 mb-4">
          <Music className="w-6 h-6 text-[#E8D0C9]" />
          <div className="h-[2px] w-32 bg-[#E8D0C9]"></div>
        </div>
      </div>

      <div className="w-full max-w-[1400px] px-4">
        <AnimatedGallery images={firstRowImages} direction="left" speed="medium" />
        <AnimatedGallery images={secondRowImages} direction="right" speed="medium" />
      </div>
    </div>
  )
}

export default Gallery
