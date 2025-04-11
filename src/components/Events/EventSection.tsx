"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion } from "framer-motion"

const EventSection = () => {
  const [isScattered, setIsScattered] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 })
  const [sectionHeight, setSectionHeight] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const arr = new Array(10).fill(0)
  const colors = [
    "#e6d7b0", "#c25b3f", "#a67c52", "#d8c297", "#b34c36",
    "#8d6e4c", "#e0c9a6", "#aa4535", "#7d6245", "#d1b78e",
  ]

  const randomRotations = useMemo(() => arr.map(() => Math.random() * 30 - 15), [])

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
      const actualHeight = maxBottom - sectionTop + 100 // extra buffer
      setSectionHeight(actualHeight)
    }, 600) // Wait for animation to finish
  }, [isScattered, windowSize])

  const getCardSize = () => {
    const baseSize = Math.min(windowSize.width * 0.22, 280)
    const minSize = windowSize.width < 768 ? 140 : 180
    return Math.max(baseSize, minSize)
  }

  const getCardPosition = (index: number, total: number) => {
    const half = Math.floor(total / 2)
    const maxX = windowSize.width * 0.35
    const maxY = windowSize.height * 0.45
  
    let x, y
  
    if (index <= half) {
      const progress = index / half
      x = -maxX + progress * maxX * 2
      y = -maxY + progress * maxY
    } else {
      const progress = (index - half) / half
      x = maxX - progress * maxX * 2
  
      // only increase vertical spacing on the taper
      const extraYSpacing = 1 + progress * 0.6 // starts at 1, ends at 1.4
      y = progress * maxY * extraYSpacing
    }
  
    x -= 20
    y -= 40
  
    const rotation = randomRotations[index]
    return { x, y, rotation }
  }
  
  const getButtonPosition = () => {
    return {
      left: `${windowSize.width * 0.2}px`, // Horizontally aligned at 20% of the viewport width
      top: `${windowSize.height / 2}px`, // Vertically centered
      transform: "translateY(-50%)",
    }
  }

  const getCardContainerStyle = () => {
    const baseTop = windowSize.height / 2
    const adjustedTop = windowSize.width < 640 ? baseTop - 80 : baseTop - 40 // Pull closer to heading dynamically for smaller viewports

    return {
      left: `${windowSize.width * 0.5}px`,
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
        paddingTop: windowSize.width < 640 ? "60px" : "100px", // Adjust padding-top dynamically
      }}
      className="relative overflow-x-hidden w-full px-4 sm:px-8 py-12 sm:py-20 text-white lg:pb-52"
    >
      <h1 className="text-3xl text-[#FFF9E5] font-antolia sm:text-5xl mb-4 sm:mb-10 text-left font-bold">
        Events
      </h1>

      <div className="relative h-full w-full">
        {/* Button */}
        <div className="absolute z-30" style={buttonPosition}>
          <button className="text-white font-antolia px-10 py-4 text-2xl rounded-xl border-2 border-white shadow-[6px_6px_12px_#d1c79b] hover:shadow-[8px_8px_14px_#e9deaa] transition-all duration-300
            sm:px-12 sm:py-5 sm:text-3xl
            md:px-16 md:py-6 md:text-4xl
            lg:px-18 lg:py-7 lg:text-5xl">
            Register Now
          </button>
        </div>

        {/* Cards */}
        <div className="absolute" style={cardContainerStyle}>
          {arr.map((_, index) => {
            const { x, y, rotation } = getCardPosition(index, arr.length)
            return (
              <motion.div
                key={index}
                ref={(el) => {
                  cardRefs.current[index] = el;
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
                  backgroundColor: colors[index],
                  width: `${cardSize}px`,
                  height: `${cardSize}px`,
                }}
                className="absolute rounded-sm shadow-lg border border-white/10"
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default EventSection