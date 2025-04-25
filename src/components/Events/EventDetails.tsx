"use client"
import { useState, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEvents, useUser } from '@/lib/stores';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SoloEventRegistration } from './EventRegistartionDialog';
import { TeamEventRegistration } from './TeamEventRegistration';
import { login } from '@/utils/functions/auth/login';
import Link from 'next/link';

interface EventDetailsProps {
  eventName: string;
}

const EventDetails = ({ eventName }: EventDetailsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSoloOpen, setIsSoloOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'rules'>('description');
  const sectionRef = useRef<HTMLDivElement>(null);

  const { eventsData, eventsLoading } = useEvents();
  const { userData, userLoading } = useUser();
  const router = useRouter();

  const lowerName = eventName?.toLowerCase() ?? '';
  const eventData = eventsData?.find(
    e => e.name.toLowerCase() === lowerName
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setIsVisible(true), 300);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const handleRegister = async () => {
    if (userLoading) {
      toast.info('Please wait while we check your login status');
      return;
    }

    if (!userData) {
      await login();
      return;
    }

    if (
      !userData.phone ||
      !userData.name ||
      userData.phone.trim() === '' ||
      userData.name.trim() === ''
    ) {
      router.push(
        `/profile?onboarding=true&callback=${encodeURIComponent(
          `/events/${eventName}`
        )}`
      );
      return;
    }

    if (eventData?.max_team_size === 1) {
      setIsSoloOpen(true);
    } else {
      setIsTeamOpen(true);
    }
  };

  if (eventsLoading) {
    return (
      <section className="w-full min-h-screen flex justify-center items-center text-white">
        Loading event details...
      </section>
    );
  }

  if (!eventData) {
    return (
      <section className="w-full min-h-screen flex justify-center items-center text-white">
        <p className="text-center text-lg">Event not found</p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen py-12 pt-28 overflow-hidden bg-black bg-opacity-90"
      style={{
        background: 'linear-gradient(to bottom, #1a0505, #000000)',
      }}
    >
      <div className="container relative px-4 mx-auto">


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto overflow-hidden rounded-lg shadow-2xl max-w-7xl"
          style={{
            background: '#1a0505',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex flex-col md:flex-row w-full bg-[#1a0a0a]">
           <div className='flex flex-col items-center justify-center w-fit bg-[#1a0a0a] p-4 md:p-8 h-full'>
           <Image src={eventData?.image_url} width={400} height={400} className='w-[500px] h-fit' alt={eventData?.name || 'Event Image'} />
           {eventData.reg_status && (
                <div className="flex flex-wrap gap-4 mt-3">
                  <InteractiveHoverButton className='border-yellow-200 border font-cogley tracking-wider'  onClick={handleRegister}
                    disabled={eventData.registered}>{eventData.registered ? 'Already Registered' : 'REGISTER NOW'}</InteractiveHoverButton>
                </div>
              )}
           </div>

            {/* Right - Details */}
            <div className="p-8 text-white  md:p-12 md:w-[50%] w-full">
              <h2 className="mb-6 text-4xl font-bold tracking-wide font-antolia">
                {eventData.name}
              </h2>

              {/* Tabs */}
              <div className="flex mb-6 font-antolia font-semibold text-2xl tracking-widest leading-2 space-x-4 border-b border-white/20">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`pb-2 px-2 font-medium transition-all ${
                    activeTab === 'description'
                      ? 'text-white border-b-2 border-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('rules')}
                  className={`pb-2 px-2 font-medium transition-all ${
                    activeTab === 'rules'
                      ? 'text-white border-b-2 border-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Rules
                </button>
              </div>

              {/* Tab Content */}
              <div className="mb-8">
                {activeTab === 'description' ? (
                  <p className="text-xl leading-relaxed">
                    {parse(eventData.description)}
                  </p>
                ) : (
                  <div className="text-xl leading-relaxed overflow-y-scroll max-h-[60vh] pr-5">
                    <pre className="whitespace-pre-wrap font-antolia tracking-wider text-justify text-xl">{parse(eventData.rules)}</pre>
                  </div>
                )}
              </div>

             {activeTab === 'description' && <div className="space-y-4 text-xl font-semibold font-antolia tracking-widest">
                <p> <span className='font-cogley text-yellow-200 tracking-widest'>SCHEDULE:</span> {parse(eventData.schedule)}</p>
                <p><span className='font-cogley text-yellow-200 tracking-widest'>REGISTRATION FEES:</span> ₹ {eventData.registration_fees}</p>
                <p><span className='font-cogley text-yellow-200 tracking-widest'>PRIZE POOL:</span> ₹ {eventData.prize_pool}</p>
                <p><span className='font-cogley text-yellow-200 tracking-widest'>TEAM SIZE:</span> {eventData.min_team_size} - {eventData.max_team_size}</p>

                {/* Coordinators */}
                <div className="pt-4">
                  <p className="mb-2 font-cogley text-yellow-200">COORDINATORS:</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {eventData.coordinators.map((c, idx) => (
                      <div key={idx} className="p-2 rounded bg-black/30">
                        <p className="font-medium">{c.name.toUpperCase()}</p>
                        <Link href={`tel:${c.phone}`} className="text-base hover:text-green-500 text-gray-300">{c.phone}</Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {eventData.links && eventData.links.length > 0 && (
                  <div className="pt-4">
                    <p className="mb-2">Resources:</p>
                    <div className="flex flex-wrap gap-2">
                      {eventData.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-base transition-all duration-300 bg-white/10 hover:bg-white/20 rounded-md"
                        >
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>}


            </div>
          </div>
        </motion.div>
      </div>

      {eventData && (
        <>
          <SoloEventRegistration
            isOpen={isSoloOpen}
            onClose={() => setIsSoloOpen(false)}
            eventID={eventData.id}
            eventName={eventData.name}
            eventFees={eventData.registration_fees}
          />
          <TeamEventRegistration
            eventFees={eventData.registration_fees}
            isOpen={isTeamOpen}
            onClose={() => setIsTeamOpen(false)}
            eventID={eventData.id}
            eventName={eventData.name}
            minTeamSize={Number(eventData.min_team_size)}
            maxTeamSize={Number(eventData.max_team_size)}
          />
        </>
      )}
    </section>
  );
};

export default EventDetails;