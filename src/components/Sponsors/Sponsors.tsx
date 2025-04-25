"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function Sponsors() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      id="sponsors" 
      className={`relative overflow-hidden lg:max-w-6xl mx-auto border-2 border-yellow-300 rounded-xl gap-12 flex flex-col lg:flex-row items-center justify-between bg-gradient-to-br from-[#2d0000] to-[#100000] text-white p-8 md:p-12 my-16 shadow-2xl`}
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-yellow-500 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-red-600 blur-3xl"></div>
      </div>
      
      {/* Left content */}
      <div className={`flex flex-col z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-4xl md:text-6xl mb-12 font-bold font-cogley tracking-wider">
          <span className="text-yellow-300">Interested</span> in
          <br />
          <span className="relative">
            sponsoring 
            <span className="absolute -bottom-2 left-0 h-1 w-40 bg-gradient-to-r from-yellow-400 to-transparent"></span>
          </span> this event?
        </h1>

        <div className="space-y-8 mt-4">
          <div>
            <Link href="/brochure" className="group inline-block hover:text-yellow-200 transition-colors duration-300">
              <span className="text-2xl font-antolia">Brochure</span>
              <div className="flex items-center mt-1">
                <div className="w-4 h-4 rotate-45 bg-white group-hover:bg-yellow-300 transition-all duration-300"></div>
                <div className="h-[2px] bg-gradient-to-r from-white to-transparent w-32 group-hover:w-40 transition-all duration-300"></div>
              </div>
            </Link>
          </div>

          <div>
            <Link href="/contact" className="group inline-block hover:text-yellow-200 transition-colors duration-300">
              <span className="text-2xl font-antolia">Contact Us</span>
              <div className="flex items-center mt-1">
                <div className="w-4 h-4 rotate-45 bg-white group-hover:bg-yellow-300 transition-all duration-300"></div>
                <div className="h-[2px] bg-gradient-to-r from-white to-transparent w-32 group-hover:w-40 transition-all duration-300"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Guitar image */}
      <div className={`flex items-center justify-center relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500 to-red-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <Image
          src="/Sponsors/guitar.webp"
          alt="Guitar"
          width={400}
          height={600}
          className="w-72 md:w-80 lg:w-96 xl:w-[32rem] drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
          priority
        />
      </div>
    </div>
  )
}