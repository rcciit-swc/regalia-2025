"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion } from "framer-motion"
import { useEvents } from "@/lib/stores"
import { useRouter } from "next/navigation"

const EventSection = () => {
  const [isScattered, setIsScattered] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 })
  const [sectionHeight, setSectionHeight] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const { eventsData } = useEvents()
  const router = useRouter()

  const randomRotations = useMemo(
    () => eventsData.map(() => Math.random() * 30 - 15),
    [eventsData]
  )

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setIsScattered(true), 300)
        } else {
          setIsScattered(false)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isScattered) return

    setTimeout(() => {
      let maxBottom = 0
      cardRefs.current.forEach((card) => {
        if (card) {
          const rect = card.getBoundingClientRect()
          maxBottom = Math.max(maxBottom, rect.bottom)
        }
      })

      const sectionTop = sectionRef.current?.getBoundingClientRect().top || 0
      const actualHeight = maxBottom - sectionTop + 150 // extra buffer to ensure full visibility
      setSectionHeight(actualHeight )
    }, 600) // Wait for animation to finish
  }, [isScattered, windowSize])

  const getCardSize = () => {
    const baseSize = Math.min(windowSize.width * 0.22, 280)
    const minSize = windowSize.width < 768 ? 140 : 180
    return Math.max(baseSize, minSize)
  }

  const getCardPosition = (index: number, total: number) => {
    const half = Math.floor(total / 2)
    const maxX = windowSize.width * 0.3
    const maxY = windowSize.height * 0.45

    let x, y

    if (index <= half) {
      const progress = index / half
      x = -maxX + progress * maxX * 2
      y = -maxY + progress * maxY
    } else {
      const progress = (index - half) / half
      x = maxX - progress * maxX * 2

      const extraYSpacing = 1 + progress * 0.6
      y = progress * maxY * extraYSpacing
    }

    x -= windowSize.width * 0.1

    // Reduce verticalOffset to move first card closer to heading
    const verticalOffset = windowSize.width < 640 ? 1 : 10
    y += verticalOffset

    const rotation = randomRotations[index]
    return { x, y, rotation }
  }

  const getButtonPosition = () => {
    const cardContainerHorizontalPosition = windowSize.width * 0.2
    const verticalOffset = windowSize.width < 640 ? 52 : windowSize.height * 0.2 // Relative to the center of the arrowhead shape

    return {
      left: `${cardContainerHorizontalPosition}px`,
      top: `${windowSize.height / 2 + verticalOffset}px`,
      transform: "translate(-50%, -50%)",
    }
  }

  const getCardContainerStyle = () => {
    // Move card container slightly to the right
    const horizontalPosition = windowSize.width * 0.45 // Increased from 0.4 to 0.45

    // Adjust vertical position to prevent overlap with heading
    const baseTop = windowSize.height / 2
    const adjustedTop =
      windowSize.width < 640 ? baseTop + 20 : baseTop

    return {
      left: `${horizontalPosition}px`,
      top: `${adjustedTop}px`,
      transform: "translate(-50%, -50%)",
    }
  }

  const cardSize = getCardSize()
  const buttonPosition = getButtonPosition()
  const cardContainerStyle = getCardContainerStyle()

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: sectionHeight,
        paddingTop: windowSize.width < 640 ? "30px" : "80px",
        paddingBottom: "50px", // Extra padding to ensure cards are fully visible
        overflow: "hidden", // Disable scrollbars
      }}
      className="relative w-full px-4 sm:px-8 text-white lg:pb-52"
    >
      <h1 className="text-3xl text-[#FFF9E5] font-antolia sm:text-5xl lg:mb-8 text-left font-bold">Events</h1>

      <div className="relative h-full w-full">
        {/* Button */}
        <div
          className="absolute z-30"
          style={{
            ...buttonPosition,
            marginLeft: windowSize.width === 375 ? "20px" : "0px",
          }}
        >
          <button
            className="text-[#FFF6D6] font-antolia px-10 py-4 text-2xl rounded-xl border-2 border-[#FFF6D5] shadow-[6px_6px_12px_#d1c79b] hover:shadow-[8px_8px_14px_#e9deaa] transition-all duration-300
            sm:px-8 sm:py-4 sm:text-3xl sm:ml-2
            md:px-8 md:py-4 md:text-4xl
            lg:px-18 lg:py-7 lg:text-5xl"
          >
            Register Now
          </button>
        </div>

        {/* Cards */}
        <div className="absolute" style={cardContainerStyle}>
          {eventsData.map((event, index) => {
            const { x, y, rotation } = getCardPosition(index, eventsData.length)
            return (
              <motion.div
                key={index}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.85 }}
                animate={
                  isScattered
                    ? { x, y, rotate: rotation, scale: 1, opacity: 1 }
                    : { x: 0, y: 0, rotate: 0, scale: 0.85, opacity: 0 }
                }
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 10,
                  delay: index * 0.03,
                }}
                style={{
                  backgroundImage: `url(${event.image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: `${cardSize}px`,
                  height: `${cardSize}px`,
                  cursor: "pointer",
                }}
                className="absolute rounded-sm shadow-lg border border-white/10"
                onClick={() => router.push(`/events/${event.name}`)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default EventSection