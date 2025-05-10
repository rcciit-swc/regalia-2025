import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Download,
  QrCode,
  Share2,
  PartyPopper,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { generateQRCodeData } from '@/utils/functions/qrUtils';
import html2canvas from 'html2canvas';
import { useUser } from '@/lib/stores';
import Link from 'next/link';

export default function EventPassComponent() {
  const { swcData } = useUser();
  const [qrCodeData, setQrCodeData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [passGenerated, setPassGenerated] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const passRef = useRef(null);

  const releaseDate = new Date('2025-05-12T00:00:00');

  // Calculate countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = releaseDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check if the current time is past the release date
  const isPassAvailable = () => {
    return new Date() >= releaseDate;
  };

  // User data for QR generation
  const userData = {
    name: swcData?.name,
    email: swcData?.email,
    phone: swcData?.phone,
    roll: swcData?.roll,
  };

  const generateQR = async () => {
    setIsGenerating(true);
    setIsLoading(true);

    try {
      // Fake loading delay for visual effect
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const qrData = await generateQRCodeData(userData);
      setQrCodeData(qrData);

      // Show pass with animation
      setIsLoading(false);
      setPassGenerated(true);

      // Trigger celebration effect
      setTimeout(() => {
        setShowCelebration(true);
        toast.success('Event pass generated successfully');

        // Hide celebration after a few seconds
        setTimeout(() => {
          setShowCelebration(false);
        }, 3000);
      }, 500);
    } catch (error) {
      console.error('Failed to generate pass:', error);
      toast.error('Failed to generate event pass');
      setIsLoading(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const hasGenerated = useRef(false);

  useEffect(() => {
    if (!hasGenerated.current) {
      // Start with a blurry pass without content
      setPassGenerated(false);
      hasGenerated.current = true;
    }
  }, []);

  const handleDownload = async () => {
    if (!passRef.current) return;

    try {
      const canvas = await html2canvas(passRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${userData?.name}-event-pass.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Pass downloaded successfully');
    } catch (error) {
      console.error('Failed to download pass:', error);
      toast.error('Failed to download pass');
    }
  };

  const handleShare = async () => {
    if (!passRef.current) return;

    try {
      const canvas = await html2canvas(passRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const image = canvas.toDataURL('image/png');

      // Check if Web Share API is available
      if (navigator.share) {
        const blob = await (await fetch(image)).blob();
        const file = new File([blob], 'event-pass.png', { type: 'image/png' });

        await navigator.share({
          title: 'My Event Pass',
          text: 'Here is my event pass',
          files: [file],
        });

        toast.success('Pass shared successfully');
      } else {
        // Fallback if Web Share API is not available
        toast.info('Sharing not supported on this device');
        handleDownload();
      }
    } catch (error) {
      console.error('Failed to share pass:', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        (error as { name: string }).name !== 'AbortError'
      ) {
        toast.error('Failed to share pass');
      }
    }
  };

  // Confetti animation component
  const Confetti = () => {
    return (
      <div className="absolute -top-10 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => {
          const randomLeft = Math.random() * 100;
          const randomDelay = Math.random() * 1;
          const randomDuration = 2 + Math.random() * 3;
          const randomSize = 5 + Math.random() * 10;
          const randomColor = [
            '#ffcc00',
            '#ff6699',
            '#33ccff',
            '#99ff66',
            '#ff9933',
          ][Math.floor(Math.random() * 5)];

          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${randomLeft}%`,
                top: '-5%',
                width: `${randomSize}px`,
                height: `${randomSize}px`,
                backgroundColor: randomColor,
                animation: `fall ${randomDuration}s linear ${randomDelay}s forwards`,
              }}
            />
          );
        })}
      </div>
    );
  };

  // Payment required notification
  const PaymentRequiredNotice = () => {
    return (
      <div className="w-full max-w-md animate-[fadeIn_1s_ease-in-out]">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-500/30 p-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-red-200">
            Payment Required
          </h3>
          <p className="text-red-100/80 mb-4">
            You have not paid your SWC fund yet. Please complete your payment to
            generate your event pass. After you pay, please wait for 24 hours
            for the pass to be generated.
          </p>
          <Link
            href={'https://forms.gle/7b6n8djKFx3NJ4Cb7'}
            target="_blank"
            className="bg-red-500 hover:bg-red-600 text-white w-full mt-2 px-4 py-2 rounded transition duration-300"
          >
            Pay Now
          </Link>
        </div>
      </div>
    );
  };

  // Countdown timer component
  const CountdownTimer = () => {
    return (
      <div className="w-full max-w-md animate-[fadeIn_1s_ease-in-out]">
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-500/30 p-3">
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-blue-200">
            Passes Available Soon
          </h3>
          <p className="text-blue-100/80 mb-4">
            The event passes will be available for generation starting at 12:00
            AM, May 12, 2025.
          </p>

          <div className="grid grid-cols-4 gap-2 my-4">
            <div className="bg-blue-800/40 rounded p-2">
              <div className="text-2xl font-bold text-white">
                {countdown.days}
              </div>
              <div className="text-xs text-blue-300">DAYS</div>
            </div>
            <div className="bg-blue-800/40 rounded p-2">
              <div className="text-2xl font-bold text-white">
                {countdown.hours}
              </div>
              <div className="text-xs text-blue-300">HOURS</div>
            </div>
            <div className="bg-blue-800/40 rounded p-2">
              <div className="text-2xl font-bold text-white">
                {countdown.minutes}
              </div>
              <div className="text-xs text-blue-300">MINUTES</div>
            </div>
            <div className="bg-blue-800/40 rounded p-2">
              <div className="text-2xl font-bold text-white">
                {countdown.seconds}
              </div>
              <div className="text-xs text-blue-300">SECONDS</div>
            </div>
          </div>

          <p className="text-blue-100/80 text-sm">
            Come back when the countdown ends to generate your pass!
          </p>
        </div>
      </div>
    );
  };

  // Early render check conditions
  // 1. If swcData is null (user hasn't paid) - show payment notice
  // 2. If swcData exists but pass is not available yet - show countdown
  // 3. Otherwise show the pass generation UI

  if (!swcData) {
    return <PaymentRequiredNotice />;
  }

  if (swcData && !isPassAvailable()) {
    return <CountdownTimer />;
  }
//   if (!swcData && isPassAvailable()) {
//     return <PaymentRequiredNotice />;
//   }
//   if (!isPassAvailable()) {
//     return <CountdownTimer />;
//   }
  return (
    <div className="flex flex-col items-center relative">
      {/* Dynamic CSS for animations */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes unblur {
          0% {
            filter: blur(10px);
            opacity: 0.7;
          }
          100% {
            filter: blur(0px);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes attention {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
          }
        }
      `}</style>

      {/* Event Pass using the template image */}
      <div className="relative mb-6" style={{ width: '320px' }}>
        <div
          ref={passRef}
          className={`relative overflow-hidden transition-all duration-700 ease-in-out ${passGenerated ? 'animate-[unblur_1s_ease-out_forwards]' : 'blur-lg opacity-70'}`}
          style={{
            width: '320px',
            aspectRatio: '0.65',
            animation:
              passGenerated && !showCelebration
                ? 'pulse 1s ease-in-out'
                : 'none',
          }}
        >
          {/* Base template image (Image 1) */}
          <div className="absolute inset-0">
            <img
              src="/pass.png"
              alt="Event Pass Template"
              className="w-full h-full"
            />
          </div>

          {/* QR Code overlay - positioned similar to Image 2 */}
          <div className="absolute top-5 left-0 right-0 flex justify-center">
            {isLoading ? (
              <div className="w-44 h-44 bg-gray-300 animate-pulse rounded"></div>
            ) : (
              qrCodeData && (
                <img
                  src={qrCodeData}
                  alt="Event Pass QR Code"
                  className="w-44 h-44 object-contain"
                />
              )
            )}
          </div>

          {/* User name - positioned based on Image 2 */}
          <div className="absolute top-56 left-12 right-8">
            <h2
              className="text-xl font-semibold text-black tracking-wider"
              style={{ fontFamily: 'Monsterrat, sans-serif' }}
            >
              {userData?.name}
            </h2>
          </div>

          {/* Event ID - positioned based on Image 2 */}
          <div className="absolute top-[15.5rem] left-12">
            <p
              className="text-xs font-semibold text-black tracking-wider"
              style={{ fontFamily: 'monospace' }}
            >
              {userData?.roll}
            </p>
          </div>

          {/* Contact number - positioned based on Image 2 */}
          <div className="absolute top-[16.5rem] left-12">
            <p
              className="text-xs font-semibold text-black tracking-wider"
              style={{ fontFamily: 'monospace' }}
            >
              {userData?.phone}
            </p>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Celebration Effect */}
        {showCelebration && <Confetti />}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-center mt-2">
        {!passGenerated ? (
          <Button
            variant="default"
            onClick={generateQR}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 px-6 py-2"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <QrCode className="w-5 h-5" />
                Generate Pass
              </>
            )}
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={generateQR}
              disabled={isGenerating}
              className="flex items-center gap-2 border border-white/30 hover:text-yellow-200 hover:bg-transparent transition-all duration-300 hover:border-yellow-300 py-2"
            >
              <QrCode
                className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`}
              />
              {isGenerating ? 'Generating...' : 'Regenerate Pass'}
            </Button>

            <Button
              variant="secondary"
              onClick={handleDownload}
              disabled={!qrCodeData || isGenerating}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>

            <Button
              variant="default"
              onClick={handleShare}
              disabled={!qrCodeData || isGenerating}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </>
        )}
      </div>

      {passGenerated && showCelebration && (
        <div className="flex items-center mt-4 text-green-400 animate-bounce">
          <PartyPopper className="w-5 h-5 mr-2" />
          <p className="font-medium">Your pass is ready!</p>
        </div>
      )}

      <p className="text-xs text-white/60 mt-4 text-center max-w-sm">
        This event pass contains your encrypted entry information. Present this
        at event entrances for quick check-in.
      </p>
    </div>
  );
}
