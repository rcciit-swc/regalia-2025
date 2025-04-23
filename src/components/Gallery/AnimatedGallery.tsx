"use client"

import type React from "react"
import Image from "next/image"

interface AnimatedGalleryProps {
  images: string[]
  direction: "left" | "right"
  speed?: "slow" | "medium" | "fast"
}

const AnimatedGallery: React.FC<AnimatedGalleryProps> = ({ images, direction, speed = "medium" }) => {
  const duplicatedImages = [...images, ...images]
  const getAnimationDuration = () => {
    switch (speed) {
      case "slow":
        return "60s"
      case "fast":
        return "30s"
      default:
        return "45s"
    }
  }

  return (
    <div className="overflow-hidden w-full my-4 relative">
      <div
        className={`flex gap-4 animate-scroll hover:pause-animation`}
        style={{
          animationDirection: direction === "left" ? "normal" : "reverse",
          animationDuration: getAnimationDuration(),
        }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-72 h-72 relative rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10"
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Gallery image ${index}`}
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnimatedGallery
