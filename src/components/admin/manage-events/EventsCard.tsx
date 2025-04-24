'use client';
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
import { useEffect } from 'react';
import Image from 'next/image';

function EventCardSkeleton() {
  return (
    <Card className="bg-[#1e2432] text-white border-gray-700 w-full overflow-hidden">
      <div className="flex flex-col md:flex-row">
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

export function EventCards() {
  const { eventsData, eventsLoading, setEventsData, updateRegisterStatus } =
    useEvents();

  useEffect(() => {
    setEventsData(false);
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

  return (
    <div className="space-y-6 w-full max-w-6xl">
      {eventsData?.length > 0 &&
        eventsData?.map((event) => (
          <Card
            key={event.id}
            className="bg-[#1e2432] text-white border-gray-700 w-full overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex-grow px-4 w-[70%]">
                <CardHeader>
                  <CardTitle className="text-4xl font-kagitingan tracking-wider font-bold text-white">
                    {event.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg font-alexandria">
                    {parseWithQuillStyles(event.schedule)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className=" text-gray-100 leading-relaxed">
                    {parseWithQuillStyles(event.description)}
                  </div>
                  <div className="space-y-3 font-alexandria">
                    <div>
                      <span className="font-semibold">Fees:</span>{' '}
                      {event.registration_fees}
                    </div>
                    <div>
                      <span className="font-semibold">Prize:</span>{' '}
                      {event.prize_pool}
                    </div>
                    <div>
                      <span className="font-semibold">Team Size:</span>{' '}
                      {event.min_team_size === event.max_team_size
                        ? event.min_team_size
                        : `${event.min_team_size} - ${event.max_team_size}`}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-4">
                  <Badge
                    variant={event.reg_status ? 'default' : 'secondary'}
                    className="mb-2"
                  >
                    {event.reg_status
                      ? 'Registration Open'
                      : 'Registration Closed'}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={event.reg_status}
                      onCheckedChange={() => {
                        if (event.id) {
                          updateRegisterStatus(event.id, !event.reg_status);
                        }
                      }}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <span className="text-sm text-muted-foreground">
                      Registration Open
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <RulesDialog rules={event.rules} />
                    {/* <Button
                      variant="outline"
                      className="px-6 font-kagitingan text-xl lg:text-xl lg:py-4 bg-green-200 hover:bg-green-300 text-black"
                      asChild
                    >
                      <Link href={`/admin/manage-events/${event.id}`}>
                        Edit Event
                      </Link>
                    </Button> */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        {/* <Button
                          variant="destructive"
                          className="bg-red-500 hover:bg-red-600 font-kagitingan text-xl lg:text-xl"
                        >
                          Delete Event
                        </Button> */}
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#1e2432] text-white border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-300">
                            This action cannot be undone. This will permanently
                            delete the event and remove all data associated with
                            it.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            // onClick={() => event.id && onDeleteEvent(event.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </div>
              <div className="md:w-[50%]  relative  md:min-h-full">
                <Image
                  width={300}
                  height={300}
                  src={event.image_url}
                  alt={event.name}
                  quality={100}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
}
