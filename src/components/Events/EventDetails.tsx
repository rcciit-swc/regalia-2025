'use client';
import { useState, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents, useUser } from '@/lib/stores';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SoloEventRegistration } from './EventRegistartionDialog';
import { TeamEventRegistration } from './TeamEventRegistration';
import { login } from '@/utils/functions/auth/login';
import Link from 'next/link';
import YouTube from 'react-youtube';
import {
  Music,
  Calendar,
  Users,
  Info,
  Book,
  Award,
  Phone,
  MapPin,
  ExternalLink,
  ArrowRight,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface EventDetailsProps {
  eventId: string;
}

interface MusicConfig {
  videoId: string;
  startSeconds?: number;
}

const musicMapping: Record<string, MusicConfig> = {
  '4c9eb3eb-34b6-4cd1-bf91-e6e983c146c3': { videoId: 'RBi7xTG93Y8', startSeconds: 12 },
  '5478d6ad-fb0a-4e35-9e99-9e27340a08d9': { videoId: 'CtRD_WBVkoo', startSeconds: 167 },
  '5b52d163-3b88-43bc-ab66-14dbfd6cf428': { videoId: 'tCajWVFTQNs', startSeconds: 0 },
  '92ad4395-b1bf-446d-a76e-b18c4b8c4151': { videoId: 'BxeuRrPNZAQ', startSeconds: 0 },
  '961f5b81-9580-40c3-971e-0186e89fc4b5': { videoId: '', startSeconds: 0 },
  'a8bb0f2d-c0f8-48f9-bf87-6049216d049e': { videoId: 'NTcy1aAOA6I', startSeconds: 0 },
  'b4c2e3e8-8081-4dfc-aa1b-0a3f9d83da4a': { videoId: 'Jkgjy2-HcU8', startSeconds: 28 },
  'ff9607bf-cda5-4331-9a6d-a9da7e48495a': { videoId: 'LmgmdlFojek', startSeconds: 0 },
};

const EventDetails = ({ eventId }: EventDetailsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSoloOpen, setIsSoloOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'rules'>('description');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { eventsData, eventsLoading } = useEvents();
  const { userData, userLoading } = useUser();
  const router = useRouter();

  const eventData = eventsData?.find((e) => e.id === eventId);
  const musicConfig = eventId ? musicMapping[eventId] : undefined;
  const musicVideoId = musicConfig?.videoId;
  const musicStartTime = musicConfig?.startSeconds || 0;

  const toggleMusic = () => {
    try {
      if (playerRef.current && playerReady) {
        if (isMusicPlaying) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
        setIsMusicPlaying(!isMusicPlaying);
      }
    } catch (error) {
      console.error('Error toggling music:', error);
    }
  };

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
    setPlayerReady(true);
    // Auto play with low volume
    event.target.setVolume(30);
    event.target.playVideo();
    setIsMusicPlaying(true);
  };

  useEffect(() => {
    // Clean up player on unmount
    return () => {
      if (playerRef.current && playerReady) {
        try {
          playerRef.current.pauseVideo();
        } catch (error) {
          console.error('Error cleaning up player:', error);
        }
      }
    };
  }, [playerReady]);

  // Rest of the existing useEffect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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
          `/events/${eventId}`
        )}`
      );
      return;
    }

    if(eventData?.id === '668c8fbb-ea27-479f-8fd8-ca2bd3d888a7') {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSfm4y7KvpCR9V0gHj1Vg91F2PzJaBTLVa8qFPQ1PwTJLxoBoQ/viewform', '_blank');
    }else if (eventData?.max_team_size === 1) {
      setIsSoloOpen(true);
    } else {
      setIsTeamOpen(true);
    }
  };

  const renderBackgroundParticles = () => {
    return Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        className="absolute rounded-full bg-yellow-300/10"
        style={{
          width: Math.random() * 6 + 2,
          height: Math.random() * 6 + 2,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: Math.random() * 5 + 10,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
      />
    ));
  };

  if (eventsLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-black text-[#E8D0C9]">
        <div className="relative w-32 h-32">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-yellow-300/50"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-yellow-300"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Music size={40} />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <section className="w-full min-h-screen flex flex-col justify-center items-center text-white bg-gradient-to-b from-[#1a0505] to-black">
        <Music className="w-16 h-16 text-yellow-300/70 mb-4" />
        <p className="text-center text-2xl font-antolia tracking-wider">
          Event not found
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-2 bg-[#3A0000] border border-yellow-300/30 rounded-full text-[#E8D0C9] flex items-center gap-2 hover:border-yellow-300/70 transition-all"
          onClick={() => router.push('/events')}
        >
          Back to Events <ArrowRight size={16} />
        </motion.button>
      </section>
    );
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen py-12 pt-28 overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #1a0505, #000000)',
        }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {renderBackgroundParticles()}

          <div className="absolute top-0 right-0 w-96 h-96 rounded-bl-full bg-gradient-to-br from-[#5A0000]/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-tr-full bg-gradient-to-tl from-[#5A0000]/20 to-transparent"></div>

          <div className="absolute left-1/4 top-1/4 w-64 h-64 rounded-full bg-yellow-300/5 backdrop-blur-3xl"></div>
          <div className="absolute right-1/3 bottom-1/4 w-48 h-48 rounded-full bg-yellow-300/5 backdrop-blur-3xl"></div>
        </div>

        <div className="container relative px-4 mx-auto z-10">
          {/* Page header with music icon */}
          <motion.div
            className="w-full flex flex-col items-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="flex items-center gap-3 mb-3"
              animate={{
                y: [0, -3, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                className="h-px w-12 bg-yellow-300/50"
                animate={{ width: [12, 36, 12] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <Music className="h-8 w-8 text-yellow-300/80" />
              <motion.div
                className="h-px w-12 bg-yellow-300/50"
                animate={{ width: [12, 36, 12] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-antolia tracking-wider text-center text-[#E8D0C9]">
              {eventData.name}
            </h1>
            <motion.div
              className="h-1 w-32 bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent mt-2"
              initial={{ width: 0 }}
              animate={{ width: 160 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto overflow-hidden rounded-xl shadow-2xl max-w-7xl"
            style={{
              background: 'linear-gradient(145deg, #1a0505, #230808)',
              boxShadow:
                '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(200, 70, 70, 0.1) inset',
              border: '1px solid rgba(255, 255, 255, 0.07)',
            }}
          >
            <div className="flex flex-col md:flex-row w-full">
              <div className="relative flex flex-col items-center justify-center w-full md:w-5/12 lg:w-5/12 bg-[#190505] p-4 md:p-8 border-r border-white/5">
                <div className="relative w-full overflow-hidden cursor-pointer rounded-lg group">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-red-500/20 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      background: [
                        'linear-gradient(45deg, rgba(252,211,77,0.1) 0%, rgba(220,38,38,0.1) 100%)',
                        'linear-gradient(45deg, rgba(220,38,38,0.1) 0%, rgba(252,211,77,0.1) 100%)',
                        'linear-gradient(45deg, rgba(252,211,77,0.1) 0%, rgba(220,38,38,0.1) 100%)',
                      ],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                  />
                  <div className="relative overflow-hidden rounded-lg aspect-square">
                    <AnimatePresence>
                      {!isImageLoaded && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center bg-[#1a0505]"
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                            className="w-12 h-12 border-2 border-t-yellow-300/70 border-r-yellow-300/40 border-b-yellow-300/20 border-l-yellow-300/5 rounded-full"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Image
                      src={eventData?.image_url}
                      width={500}
                      height={500}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                      alt={eventData?.name || 'Event Image'}
                      onLoad={() => setIsImageLoaded(true)}
                    />
                    <motion.div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Event action buttons */}
                <div className="w-full mt-6 space-y-4">
                  {eventData.reg_status ? (
                    <motion.div
                      className="flex justify-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <InteractiveHoverButton
                        className="w-full py-3 border-yellow-200 border font-cogley tracking-wider text-lg flex items-center justify-center gap-2"
                        onClick={handleRegister}
                        disabled={eventData.registered}
                      >
                        {eventData.registered
                          ? 'Already Registered'
                          : 'REGISTER NOW'}
                      </InteractiveHoverButton>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex justify-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <InteractiveHoverButton
                        className="w-full py-3 border-yellow-200 border font-cogley tracking-wider text-lg flex items-center justify-center gap-2"
                        onClick={() =>
                          toast.info('Registrations are opening soon!')
                        }
                        disabled={eventData.registered}
                      >
                        Register Soon
                      </InteractiveHoverButton>
                    </motion.div>
                  )}

                  {/* Event quick stats */}
                  <motion.div
                    className="grid grid-cols-2 gap-3 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex flex-col items-center justify-center">
                      <Calendar className="h-5 w-5 text-yellow-300/90 mb-1" />
                      <p className="text-sm text-gray-300">Registration</p>
                      <p className="text-lg font-medium text-[#E8D0C9]">
                        ₹{eventData.registration_fees}
                      </p>
                    </div>
                    {eventData?.prize_pool > 0 &&<div className="bg-black/30 p-3 rounded-lg border border-white/5 flex flex-col items-center justify-center">
                      <Award className="h-5 w-5 text-yellow-300/90 mb-1" />
                      <p className="text-sm text-gray-300">Prize Pool</p>
                       <p className="text-lg font-medium text-[#E8D0C9]">
                        ₹{eventData.prize_pool}
                      </p>
                    </div>}
                    <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex flex-col items-center justify-center">
                      <Users className="h-5 w-5 text-yellow-300/90 mb-1" />
                      <p className="text-sm text-gray-300">Team Size</p>
                      <p className="text-lg font-medium text-[#E8D0C9]">
                        {eventData?.max_team_size > 1
                          ? `${eventData.min_team_size} - ${eventData.max_team_size}`
                          : 'Solo'}
                      </p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex flex-col items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-300/90 mb-1" />
                      <p className="text-sm text-gray-300">Schedule</p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setActiveTab('description')}
                        className="text-yellow-200 underline text-sm cursor-pointer"
                      >
                        View Details
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right - Details */}
              <div className="p-6 text-white md:p-8 md:w-7/12 lg:w-7/12 w-full relative">
                {/* Floating music notes decoration with volume control */}
                <div className="absolute right-8 top-6 flex items-center gap-2">
                  <motion.button
                    onClick={toggleMusic}
                    className={`text-yellow-300/70 hover:text-yellow-300 transition-colors p-2 rounded-full hover:bg-white/5 ${musicVideoId ? 'visible' : 'invisible'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={isMusicPlaying ? "Mute music" : "Play music"}
                  >
                    {isMusicPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </motion.button>
                  <motion.div
                    className="text-yellow-300/30 opacity-50"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <Sparkles size={24} />
                  </motion.div>
                </div>

                {/* YouTube player (hidden) */}
                {musicVideoId && (
                  <div className="hidden">
                    <YouTube
                      videoId={musicVideoId}
                      opts={{
                        height: '0',
                        width: '0',
                        playerVars: {
                          autoplay: 1,
                          controls: 0,
                          disablekb: 1,
                          fs: 0,
                          iv_load_policy: 3,
                          modestbranding: 1,
                          rel: 0,
                          start: musicStartTime,
                        },
                      }}
                      onReady={onPlayerReady}
                    />
                  </div>
                )}

                {/* Tabs */}
                <div className="flex mb-6 font-antolia font-semibold text-base md:text-xl tracking-widest leading-2 space-x-4 border-b border-white/20">
                  <motion.button
                    onClick={() => setActiveTab('description')}
                    className={`pb-2 px-3 font-medium transition-all relative flex items-center gap-2 ${
                      activeTab === 'description'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <Info size={18} />
                    Description
                    {activeTab === 'description' && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300"
                        layoutId="activeTab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveTab('rules')}
                    className={`pb-2 px-3 font-medium transition-all relative flex items-center gap-2 ${
                      activeTab === 'rules'
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <Book size={18} />
                    Rules
                    {activeTab === 'rules' && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300"
                        layoutId="activeTab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'description' ? (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mb-8"
                    >
                      <div className="text-xl leading-relaxed font-antolia event-description">
                        {parse(eventData.description)}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="rules"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mb-8"
                    >
                      <div className="text-xl leading-relaxed overflow-y-auto max-h-[60vh] pr-5 rules-container">
                        <pre className="whitespace-pre-wrap font-antolia tracking-wider text-justify text-xl">
                          {parse(eventData.rules)}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {activeTab === 'description' && (
                  <motion.div
                    className="space-y-5 text-xl font-semibold font-antolia tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-[#200505] border border-white/5">
                      <Clock className="min-w-6 h-6 text-yellow-300/90 mt-1" />
                      <div>
                        <p className="font-cogley text-yellow-200 tracking-widest text-lg">
                          SCHEDULE:
                        </p>
                        <p className="text-[#E8D0C9]">
                          {parse(eventData.schedule)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-[#200505] border border-white/5">
                      <Award className="min-w-6 h-6 text-yellow-300/90 mt-1" />
                      <div>
                        <p className="font-cogley text-yellow-200 tracking-widest text-lg">
                          PRIZE POOL:
                        </p>
                        <p className="text-[#E8D0C9]">
                           {eventData.prize_pool > 0 ?  "₹ " + eventData?.prize_pool : <span>1st Prize: Memento with Certificate <br /> 2nd Prize: Certificate <br /> 3rd Prize: Certificate</span>}
                        </p>
                      </div>
                    </div>

                    {/* Coordinators */}
                    <div className="pt-4">
                      <p className="mb-3 font-cogley text-yellow-200 tracking-widest text-xl flex items-center gap-2">
                        <Phone className="h-5 w-5" /> ORGANISERS:
                      </p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {eventData.coordinators.map((c, idx) => (
                          <motion.div
                            key={idx}
                            className="p-3 rounded-lg bg-[#300505] bg-opacity-50 backdrop-blur-sm border border-white/10 transition-all hover:border-yellow-300/30"
                            whileHover={{
                              scale: 1.02,
                              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                            }}
                          >
                            <p className="font-medium">
                              {c.name.toUpperCase()}
                            </p>
                            <Link
                              href={`tel:${c.phone}`}
                              className="text-base hover:text-yellow-300 text-gray-300 flex items-center gap-1 mt-1"
                            >
                              <Phone size={14} />
                              {c.phone}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    {eventData.links && eventData.links.length > 0 && (
                      <div className="pt-4">
                        <p className="mb-3 font-cogley text-yellow-200 tracking-widest text-xl flex items-center gap-2">
                          <ExternalLink className="h-5 w-5" /> RESOURCES:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {eventData.links.map((link, idx) => (
                            <motion.a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 text-base transition-all duration-300 bg-[#200505] hover:bg-[#300808] rounded-lg border border-white/10 hover:border-yellow-300/30 flex items-center gap-2"
                              whileHover={{
                                y: -2,
                                boxShadow: '0 10px 15px rgba(0,0,0,0.2)',
                              }}
                              whileTap={{ y: 0 }}
                            >
                              <ExternalLink size={14} />
                              {link.title}
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bottom accent */}
          <motion.div
            className="flex items-center justify-center gap-3 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <motion.div
              className="h-px w-16 bg-yellow-300/30"
              animate={{ width: [16, 64, 16] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <Music className="h-6 w-6 text-yellow-300/60" />
            <motion.div
              className="h-px w-16 bg-yellow-300/30"
              animate={{ width: [16, 64, 16] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>
        </div>

        {/* Add custom styles */}
        <style jsx global>{`
          .event-description {
            color: #e8d0c9;
          }

          .event-description a,
          .rules-container a {
            color: #fbbf24;
            text-decoration: underline;
            transition: all 0.2s;
          }

          .event-description a:hover,
          .rules-container a:hover {
            color: #f59e0b;
          }

          .rules-container::-webkit-scrollbar {
            width: 6px;
          }

          .rules-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }

          .rules-container::-webkit-scrollbar-thumb {
            background: rgba(252, 211, 77, 0.3);
            border-radius: 10px;
          }

          .rules-container::-webkit-scrollbar-thumb:hover {
            background: rgba(252, 211, 77, 0.5);
          }
        `}</style>
      </section>
      {eventData && (
        <>
          <SoloEventRegistration
            isOpen={isSoloOpen}
            onClose={() => setIsSoloOpen(false)}
            eventID={eventData.id as string}
            eventName={eventData.name}
            eventFees={eventData.registration_fees}
          />
          <TeamEventRegistration
            eventFees={eventData.registration_fees}
            isOpen={isTeamOpen}
            onClose={() => setIsTeamOpen(false)}
            eventID={eventData.id as string}
            eventName={eventData.name}
            minTeamSize={Number(eventData.min_team_size)}
            maxTeamSize={Number(eventData.max_team_size)}
          />
        </>
      )}
    </>
  );
};

export default EventDetails;
