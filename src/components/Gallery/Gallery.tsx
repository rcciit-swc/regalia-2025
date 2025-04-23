"use client"

import Image from "next/image"
import type React from "react"

interface GalleryCardProps {
  image: string
}

const GalleryCard: React.FC<GalleryCardProps> = ({ image }) => {
  return (
    <div className="holographic-container relative group">
      <div className="holographic-card relative transition-transform duration-300 group-hover:scale-105">
        <Image
          alt="Gallery Image"
          width={400}
          height={400}
          src={image || "/placeholder.svg"}
          className="w-full h-auto object-cover rounded-md shadow-md"
        />
      </div>
    </div>
  )
}

export default GalleryCard
