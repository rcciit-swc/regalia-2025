'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { useEvents } from '@/lib/stores';
import { Skeleton } from '@/components/ui/skeleton';
import { parseWithQuillStyles } from '@/utils/functions/admin/quillParser';
import { RulesDialog } from '@/components/admin/manage-events/RulesDialog';
import Image from 'next/image';
import {
  Calendar,
  Users,
  Trophy,
  Wallet,
  Tag,
  Info,
  ArrowUpRight,
  Settings,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
} from 'lucide-react';

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
  hover: {
    y: -5,
    boxShadow:
      '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3 },
  },
};

function EventCardSkeleton() {
  return (
    <Card className="relative bg-gradient-to-br from-[#1a1e2c] to-[#2d3748] text-white border-gray-700 w-full overflow-hidden shadow-xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 z-0"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-16 -mb-16 z-0"></div>

      <div className="flex flex-col md:flex-row relative z-10">
        <div className="flex-grow p-8 w-[70%]">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 bg-gray-700" />
            <Skeleton className="h-4 w-1/2 mt-2 bg-gray-700" />
          </CardHeader>
          <CardContent className="py-6">
            <Skeleton className="h-20 w-full bg-gray-700" />
            <div className="space-y-3 mt-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-1/3 bg-gray-700" />
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-4">
            <Skeleton className="h-6 w-24 bg-gray-700" />
            <Skeleton className="h-6 w-32 bg-gray-700" />
            <div className="flex space-x-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-24 bg-gray-700" />
              ))}
            </div>
          </CardFooter>
        </div>
        <div className="md:w-[30%] relative min-h-[300px] md:min-h-full">
          <Skeleton className="absolute inset-0 w-full h-full bg-gray-700" />
        </div>
      </div>
    </Card>
  );
}

export function EventCards({
  isSuperAdmin=false,
  eventID,
}: {
  isSuperAdmin: boolean;
  eventID?: string | undefined;
}) {
  const { eventsData, eventsLoading, setEventsData, updateRegisterStatus } =
    useEvents();

  useEffect(() => {
    setEventsData(true);
  }, [setEventsData]);

  if (eventsLoading) {
    return (
      <div className="space-y-6 w-full max-w-6xl">
        {[1, 2, 3].map((i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const adminProtectedEvents = isSuperAdmin ? eventsData : eventsData?.filter((event) => event.id === eventID);
  return (
    <div className="space-y-8 w-full max-w-6xl">
      <AnimatePresence>
        {eventsData?.length > 0 &&
          adminProtectedEvents?.map((event, index) => (
            <motion.div
              key={event.id}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={cardVariants}
              layoutId={`event-${event.id}`}
            >
              <Card className="relative bg-gradient-to-br from-[#1a1e2c] to-[#2d3748] text-white border border-gray-700/50 w-full overflow-hidden shadow-xl">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20 z-0"></div>

                {/* Status badge */}
                <div className="absolute top-4 right-4 z-20">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    <Badge
                      variant={event.reg_status ? 'default' : 'secondary'}
                      className={`px-3 py-1 text-sm font-medium ${
                        event.reg_status
                          ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                          : 'bg-gradient-to-r from-gray-500 to-gray-700 text-white'
                      }`}
                    >
                      {event.reg_status ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle size={14} />
                          Registration Open
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle size={14} />
                          Registration Closed
                        </span>
                      )}
                    </Badge>
                  </motion.div>
                </div>

                <div className="flex flex-col md:flex-row relative z-10">
                  <div className="flex-grow px-6 py-6 md:w-[65%]">
                    <CardHeader className="pb-2">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                      >
                        <CardTitle className="text-4xl font-kagitingan tracking-wider font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
                          {event.name}
                        </CardTitle>
                      </motion.div>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                      >
                        <CardDescription className="text-gray-300 text-lg font-antolia flex items-center gap-2">
                          <Clock size={16} className="text-blue-400" />
                          {parseWithQuillStyles(event.schedule)}
                        </CardDescription>
                      </motion.div>
                    </CardHeader>

                    <CardContent className="py-4">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="text-gray-100 leading-relaxed bg-black/20 p-4 rounded-lg border border-gray-700/30 shadow-inner"
                      >
                        {parseWithQuillStyles(event.description.slice(0, 200))}
                        {event.description.length > 200 && (
                          <Link
                            href={`/events/${event.id}`}
                            className="text-blue-400 hover:underline"
                          >
                            ...Read More
                          </Link>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="bg-black/20 p-3 rounded-lg border border-gray-700/30 flex items-center gap-3">
                          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-full">
                            <Wallet size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Registration Fee
                            </p>
                            <p className="font-semibold text-white">
                              {event.registration_fees}
                            </p>
                          </div>
                        </div>

                        <div className="bg-black/20 p-3 rounded-lg border border-gray-700/30 flex items-center gap-3">
                          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-2 rounded-full">
                            <Trophy size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Prize Pool</p>
                            <p className="font-semibold text-white">
                              {event.prize_pool}
                            </p>
                          </div>
                        </div>

                        <div className="bg-black/20 p-3 rounded-lg border border-gray-700/30 flex items-center gap-3">
                          <div className="bg-gradient-to-br from-green-500 to-teal-600 p-2 rounded-full">
                            <Users size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Team Size</p>
                            <p className="font-semibold text-white">
                              {event.min_team_size === event.max_team_size
                                ? event.min_team_size
                                : `${event.min_team_size} - ${event.max_team_size}`}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </CardContent>

                    <CardFooter className="flex flex-col items-start space-y-4 pt-2">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="flex items-center gap-4 w-full border-t border-gray-700/30 pt-4"
                      >
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={event.reg_status}
                            onCheckedChange={() => {
                              if (event.id) {
                                updateRegisterStatus(
                                  event.id,
                                  !event.reg_status
                                );
                              }
                            }}
                            className="data-[state=checked]:bg-green-500"
                          />
                          <span className="text-sm text-blue-300 flex items-center gap-1">
                            <ToggleLeft size={14} />
                            Toggle Registration
                          </span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                        className="flex flex-wrap gap-3"
                      >
                        <Button
                          variant="outline"
                          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 text-blue-300 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-2 group"
                          asChild
                        >
                          <Link href={`/admin/manage-events/${event.id}`}>
                            <Edit size={16} />
                            <span>Edit Event</span>
                            <ChevronRight
                              size={16}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </Link>
                        </Button>

                        <RulesDialog rules={event.rules} />

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            {/* <Button
                              variant="outline"
                              className="bg-gradient-to-r from-red-600/20 to-orange-600/20 hover:from-red-600/30 hover:to-orange-600/30 text-red-300 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              <span>Delete Event</span>
                            </Button> */}
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gradient-to-br from-[#1a1e2c] to-[#2d3748] text-white border-gray-700">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-32 -mt-32 z-0"></div>
                            <div className="relative z-10">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-kagitingan tracking-wider">
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-300">
                                  This action cannot be undone. This will
                                  permanently delete the event and remove all
                                  data associated with it.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6">
                                <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 border-gray-600">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </motion.div>
                    </CardFooter>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className=" relative md:min-h-full group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10 md:block hidden"></div>
                    <div className="absolute bottom-0 left-0 p-4 z-20 md:block hidden">
                      <p className="text-sm text-gray-300 flex items-center gap-1 mb-2">
                        <Calendar size={14} className="text-purple-400" />
                        <span>Event Date</span>
                      </p>
                      <p className="text-xl font-bold text-white">
                        {new Date().toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <Image
                      width={500}
                      height={500}
                      src={event.image_url}
                      alt={event.name}
                      quality={100}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                    <div className="absolute top-0 right-0 p-4 z-20 md:block hidden">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          className="w-14 h-14 rounded-full border-2 border-dashed border-white flex items-center justify-center"
                        >
                          <Settings size={20} className="text-white" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
