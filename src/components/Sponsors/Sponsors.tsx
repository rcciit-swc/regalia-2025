"use client"
import Link from "next/link"


export default function Sponsors() {
  return (
    <section id="sponsors" className={`relative min-h-screen flex items-center justify-center bg-[#210000] text-white p-8`}>
      {/* Left content */}
      <div className="flex flex-col z-10 lg:pr-24">
        <h1 className="text-4xl md:text-5xl mb-12 font-bold font-cogley">
          Interested in
          <br />
          sponsoring this event?
        </h1>

        <div className="space-y-8">
          <div>
            <Link href="/brochure" className="inline-block">
              <span className="text-xl font-antolia">Brochure</span>
              <div className="flex items-center mt-1">
                <div className="w-4 h-4 rotate-45 bg-white"></div>
                <div className="h-[1px] bg-white w-32"></div>
              </div>
            </Link>
          </div>

          <div>
            <Link href="/contact" className="inline-block">
              <span className="text-xl font-antolia">
                Contact Us
              </span>
              <div className="flex items-center mt-1">
                <div className="w-4 h-4 rotate-45 bg-white"></div>
                <div className="h-[1px] bg-white w-32"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Guitar SVG */}
      <div
        className="z-10 absolute top-0 right-0 h-full flex items-center"
      >
        <img
          src="Sponsors/guitar.webp"
          alt="Guitar"
          className="w-80 lg:w-[32rem]"
          height={200}
        />
      </div>
    </section>
  )
}