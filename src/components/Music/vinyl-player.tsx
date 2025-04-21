"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import YouTube from "react-youtube"
import { Play, Pause } from "lucide-react"
import { motion, useMotionValue } from "framer-motion"

interface VinylPlayerProps {
  size?: number
  youtubeVideoLink: string
  volume: number
  className?: string
}

type PlayerStatus = {
  isReady: boolean
  error: string | null
  initAttempts: number
}

export default function VinylPlayer({
  size = 200,
  youtubeVideoLink,
  volume,
  className = ""
}: VinylPlayerProps) {
  const width = size;
  const height = size;
  // Consolidated state management
  const [isPlaying, setIsPlaying] = useState(true)
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null)
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>({
    isReady: false,
    error: null,
    initAttempts: 0
  })
  
  // Motion values
  const recordRotation = useMotionValue(0)
  const needleRotation = useMotionValue(-4)
  
  // Refs
  const playerInitTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const spinVelocity = useRef<number>(0)

  // Extract YouTube video ID from the link
  const videoId = useCallback((url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }, [])

  const youtubeId = videoId(youtubeVideoLink)
  
  // Get YouTube thumbnail URL
  const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/0.jpg` : null

  // Helper function to safely check if YouTube player is valid and ready
  const isPlayerReady = useCallback((player: any): boolean => {
    try {
      return (
        player !== null && 
        typeof player === 'object' && 
        typeof player.playVideo === 'function' && 
        typeof player.pauseVideo === 'function'
      )
    } catch {
      return false
    }
  }, [])

  // Safe player controls with error handling
  const safePlayVideo = useCallback(() => {
    if (!youtubePlayer) return false
    try {
      youtubePlayer.playVideo()
      return true
    } catch (error) {
      console.error("Error playing video:", error)
      setPlayerStatus(prev => ({ ...prev, error: "Failed to play video" }))
      return false
    }
  }, [youtubePlayer])

  const safePauseVideo = useCallback(() => {
    if (!youtubePlayer) return false
    try {
      youtubePlayer.pauseVideo()
      return true
    } catch (error) {
      console.error("Error pausing video:", error)
      setPlayerStatus(prev => ({ ...prev, error: "Failed to pause video" }))
      return false
    }
  }, [youtubePlayer])

  // Handle YouTube player ready - optimized
  const onReady = useCallback((event: any) => {
    try {
      const player = event.target
      if (isPlayerReady(player)) {
        setYoutubePlayer(player)
        player.setVolume(volume)
        player.pauseVideo()
        setPlayerStatus(prev => ({ ...prev, isReady: true, error: null }))
        console.log("YouTube player initialized successfully")
      } else {
        throw new Error("Player initialized but methods are not available")
      }
    } catch (error) {
      console.error("Error during player initialization:", error)
      setPlayerStatus(prev => ({ 
        ...prev, 
        error: "Failed to initialize player",
        initAttempts: prev.initAttempts + 1
      }))
      
      // Clear any existing timeout and retry if needed
      if (playerInitTimeoutRef.current) {
        clearTimeout(playerInitTimeoutRef.current)
      }
      
      if (playerStatus.initAttempts < 3) {
        playerInitTimeoutRef.current = setTimeout(() => {
          setYoutubePlayer(null)
        }, 2000)
      }
    }
  }, [isPlayerReady, volume, playerStatus.initAttempts])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (playerInitTimeoutRef.current) {
        clearTimeout(playerInitTimeoutRef.current)
      }
    }
  }, [])

  // Optimized record animation
  useEffect(() => {
    let animationId: number;
    
    const updateSpin = () => {
      if (isPlaying) {
        // Constant speed when playing
        recordRotation.set((recordRotation.get() + 0.5) % 360);
      } else if (Math.abs(spinVelocity.current) > 0.01) {
        // Apply decay when the user has spun the record
        spinVelocity.current *= 0.98; // Friction
        recordRotation.set((recordRotation.get() + spinVelocity.current) % 360);
      }
      animationId = requestAnimationFrame(updateSpin);
    };
    
    animationId = requestAnimationFrame(updateSpin);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, recordRotation]);

  // Handle YouTube player state based on playing status
  useEffect(() => {
    if (!isPlayerReady(youtubePlayer)) return;

    try {
      isPlaying ? safePlayVideo() : safePauseVideo();
    } catch (error) {
      console.error("YouTube player control error:", error);
      setPlayerStatus(prev => ({ 
        ...prev, 
        error: "Failed to control playback",
        initAttempts: prev.initAttempts < 3 ? prev.initAttempts + 1 : prev.initAttempts
      }));
    }
  }, [isPlaying, youtubePlayer, safePlayVideo, safePauseVideo, isPlayerReady]);

  // Handle needle position based on play state
  useEffect(() => {
    // Move needle to the appropriate position based on play state
    needleRotation.set(isPlaying ? 25 : -4);
  }, [isPlaying, needleRotation]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        maxWidth: '30vw',
        maxHeight: '30vw',
        minWidth: '120px',
        minHeight: '120px'
      }}
    >
      {/* Hidden YouTube player */}
      <div className="hidden">
        {youtubeId && (
          <YouTube
            videoId={youtubeId}
            opts={{
              height: "1",
              width: "1",
              playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                rel: 0,
              },
            }}
            onReady={onReady}
            onError={(e:any) => {
              console.error("YouTube player error event:", e);
              setPlayerStatus(prev => ({
                ...prev,
                error: "YouTube API error",
                isReady: false,
                initAttempts: prev.initAttempts < 3 ? prev.initAttempts + 1 : prev.initAttempts
              }));
            }}
          />
        )}
      </div>

      {/* Vinyl player with motion components */}
      <div className="relative w-full h-full overflow-visible bg-[#a2452f] rounded-3xl p-4">
        <div className="relative w-full h-full overflow-visible">
          {/* Record/LP */}
          <motion.div 
            className="relative w-full h-full cursor-grab active:cursor-grabbing"
            style={{ 
              rotate: recordRotation,
              originX: 0.5,
              originY: 0.5,
            }}
          >
            <div className="w-full h-full">
              <svg className="w-full h-full" viewBox="0 0 800 800">
                <title>LP</title>
                <path fill="#181819" d="M400,1C179.6,1,1,179.6,1,400s178.6,399,399,399s399-178.6,399-399S620.4,1,400,1zM400,409.8c-5.4,0-9.8-4.4-9.8-9.8s4.4-9.8,9.8-9.8s9.8,4.4,9.8,9.8S405.4,409.8,400,409.8z" />
                <g strokeWidth="1.5" stroke="#141415" fill="#181819">
                  <path d="M400,20C190.1,20,20,190.1,20,400s170.1,380,380,380s380-170.1,380-380S609.9,20,400,20z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,30C195.7,30,30,195.6,30,400s165.7,370,370,370s370-165.7,370-370S604.3,30,400,30z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,40C201.2,40,40,201.2,40,400s161.2,360,360,360s360-161.2,360-360S598.8,40,400,40z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,50C206.7,50,50,206.7,50,400s156.7,350,350,350s350-156.7,350-350S593.3,50,400,50z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,60C212.2,60,60,212.2,60,400s152.2,340,340,340s340-152.2,340-340S587.8,60,400,60z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,70C217.8,70,70,217.8,70,400s147.8,330,330,330s330-147.8,330-330S582.2,70,400,70z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,80C223.3,80,80,223.3,80,400s143.3,320,320,320s320-143.3,320-320S576.7,80,400,80z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,90C228.8,90,90,228.8,90,400s138.8,310,310,310s310-138.8,310-310S571.2,90,400,90z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,100c-165.7,0-300,134.3-300,300s134.3,300,300,300s300-134.3,300-300S565.7,100,400,100z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,110c-160.2,0-290,129.8-290,290s129.8,290,290,290s290-129.8,290-290S560.2,110,400,110z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,120c-154.6,0-280,125.4-280,280s125.4,280,280,280s280-125.4,280-280S554.6,120,400,120z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,130c-149.1,0-270,120.9-270,270s120.9,270,270,270s270-120.9,270-270S549.1,130,400,130z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,140c-143.6,0-260,116.4-260,260s116.4,260,260,260s260-116.4,260-260S543.6,140,400,140z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,150c-138.1,0-250,111.9-250,250s111.9,250,250,250s250-111.9,250-250S538.1,150,400,150z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,160c-132.5,0-240,107.5-240,240s107.5,240,240,240s240-107.5,240-240S532.5,160,400,160z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,170c-127,0-230,103-230,230s103,230,230,230s230-103,230-230S527,170,400,170z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,180c-121.5,0-220,98.5-220,220s98.5,220,220,220s220-98.5,220-220S521.5,180,400,180z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,190c-116,0-210,94-210,210s94,210,210,210s210-94,210-210S516,190,400,190z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                  <path d="M400,200c-110.5,0-200,89.5-200,200s89.5,200,200,200s200-89.5,200-200S510.5,200,400,200z M399.2,414.8c-8.6,0-15.5-6.9-15.5-15.5s6.9-15.5,15.5-15.5s15.5,6.9,15.5,15.5S407.8,414.8,399.2,414.8z"/>
                </g>
                <path id="cover" fill="#4bb749" opacity="0" d="M400,262.1c-76.1,0-137.9,61.7-137.9,137.9S323.9,537.9,400,537.9S537.9,476.1,537.9,400S476.1,262.1,400,262.1z M400,411.7c-6.4,0-11.7-5.2-11.7-11.7s5.2-11.7,11.7-11.7s11.7,5.2,11.7,11.7S406.4,411.7,400,411.7z" />
                <defs>
                  <clipPath id="coverClip">
                    <path fill="#4bb749" d="M400,262.1c-76.1,0-137.9,61.7-137.9,137.9S323.9,537.9,400,537.9S537.9,476.1,537.9,400S476.1,262.1,400,262.1z M400,411.7c-6.4,0-11.7-5.2-11.7-11.7s5.2-11.7,11.7-11.7s11.7,5.2,11.7,11.7S406.4,411.7,400,411.7z" />
                  </clipPath>
                </defs>
                {thumbnailUrl && (
                  <image
                    href={thumbnailUrl}
                    x="212.1"
                    y="212.1"
                    width="375.8"
                    height="375.8"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#coverClip)"
                  />
                )}
                <text transform="matrix(1 0 0 1 381.8867 509.8047)" style={{ opacity: 0.2, fontFamily: 'Arial', fontSize: '50.4557px' }}>A</text>
                <text transform="matrix(-1 0 0 1 418.2188 509.8047)" style={{ opacity: 0.2, fontFamily: 'Arial', fontSize: '50.4557px' }}>B</text>
              </svg>
            </div>
          </motion.div>
          
          {/* Tonearm (Needle arm) */}
          <motion.div 
            className="absolute -top-8 -right-16 md:-right-28 w-full h-full z-10 cursor-grab active:cursor-grabbing"
            style={{ 
              rotate: needleRotation,
              originX: 0.5,
              originY: 0.5,
              transformOrigin: "400px 400px"
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 800 800">
              <path style={{ fill: '#220000' }} d="M354.5,761.6l11.9,6.2c0,0,37.1-91.5,42.4-123.7c2.7-16.4-1.1-103.9-1.1-103.9V307.5h-14.7l-0.1,232.7c0,0,3.7,87.5,1.1,103.9C389,674.6,354.5,761.6,354.5,761.6z"></path>
              <rect x="379.7" y="239.7" style={{ fill: '#fff' }} width="40.7" height="67.8"></rect>
              <circle style={{ fill: '#fff' }} cx="400" cy="400" r="22.6"></circle>
              <path style={{ fill: '#fff' }} className="grabbable" d="M353,738.9l18.3-22.9l13.2,6.4l-6.2,28.7l-22.8,47.1c0,0-1.2,3.3-15.4-3.6c-11.2-5.4-10-8.7-10-8.7L353,738.9z"></path>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Play button */}
      <button
        className="absolute bottom-2 left-2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-[#220000] flex items-center justify-center text-white shadow-lg transition-colors"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
        ) : (
          <Play className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 fill-white" />
        )}
      </button>
    </div>
  )
}

