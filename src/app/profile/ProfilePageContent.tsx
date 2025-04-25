'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useEvents } from '@/lib/stores';
import { supabase } from '@/utils/functions/supabase-client';
import { logout } from '@/utils/functions/auth/logout';
import EventsCard from '@/components/Events/EventsCard';
import { EditProfileDialog } from './EditProfileDialog';
import type { events } from '@/lib/types';
import { toast } from 'sonner';
import { handleSaveChanges } from '@/utils/functions/profile/functions';
import ProfileSkeleton from './ProfileSkeleton';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LogOut,
  Pencil,
  CalendarDays,
  UserCircle,
} from 'lucide-react';

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { userData, userLoading, updateUserData, clearUserData } = useUser();
  const { eventsData } = useEvents();
  const [profileImage, setProfileImage] = useState<string>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [name, setName] = useState<string>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [registeredEvents, setRegisteredEvents] = useState<events[]>([]);

  useEffect(() => {
    const cb = searchParams.get('callback');
    if (cb) router.replace(cb);
  }, [searchParams, router]);

  useEffect(() => {
    if (eventsData.length > 0) {
      setRegisteredEvents(eventsData.filter((event) => event.registered));
    }
  }, [eventsData]);

  useEffect(() => {
    if (searchParams.get('onboarding') === 'true') {
      setIsEditModalOpen(true);
      toast.info('Finish your profile first');
    }
  }, [searchParams]);

  useEffect(() => {
    const readUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user.user_metadata) {
        const meta = data.session.user.user_metadata;
        setName(meta.full_name);
        setProfileImage(meta.avatar_url);
      }
    };
    readUserSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sb-session');
    clearUserData();
    router.push('/');
  };

  const handleProfileSave = async (formData: FormData) => {
    await handleSaveChanges(formData, userData, updateUserData, () =>
      setIsEditModalOpen(false)
    );
  };

  if (userLoading) return <ProfileSkeleton />;

  return (
    <div className="min-h-screen mt-32">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-gradient-to-br from-[#1a0a0a] to-[#0f0c29] rounded-xl p-8 font-cogley tracking-widest shadow-xl border border-white/20 backdrop-blur-md"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Avatar className="w-32 h-32 relative border-4 border-white/20 shadow-lg">
                {!imageLoaded && (
                  <Skeleton className="w-full h-full rounded-full absolute inset-0" />
                )}
                <AvatarImage
                  src={profileImage || '/default-avatar.png'}
                  alt={userData?.name || 'Profile'}
                  onLoad={() => setImageLoaded(true)}
                  className={imageLoaded ? 'block' : 'hidden'}
                />
                <AvatarFallback className="bg-muted text-white">
                  {userData?.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="space-y-4 flex-1">
              <div>
                <h1 className="text-3xl font-bold uppercase text-white flex items-center gap-2">
                  <UserCircle className="w-6 h-6 text-white" />
                  {userData?.name || name}
                </h1>
                <p className="text-white/80 text-lg">{userData?.email}</p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" /> Edit Profile
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-10"
        >
          <h2 className="text-2xl font-bold mb-4 text-white font-cogley tracking-widest flex items-center gap-2">
            <CalendarDays className="w-6 h-6" /> Events Registered
          </h2>

          {registeredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredEvents.map((event, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  onClick={() => {
                    // Optional: handle event click
                  }}
                >
                  <EventsCard {...event} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white font-antolia tracking-widest mt-6">
              <p className="text-lg mb-4">
                You have not registered for any event. Register now!
              </p>
              <InteractiveHoverButton
                className="mt-4"
                onClick={() => router.push('/events')}
              >
                Browse Events
              </InteractiveHoverButton>
            </div>
          )}
        </motion.div>
      </main>

      <EditProfileDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        userData={userData}
        profileImage={profileImage}
        onSave={handleProfileSave}
        name={name}
      />
    </div>
  );
}
