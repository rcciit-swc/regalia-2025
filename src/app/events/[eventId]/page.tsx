import { Metadata } from 'next';
import EventDetails from '@/components/Events/EventDetails';
import { notFound } from 'next/navigation';

const Page = async ({ params }: { params: { eventId: string } }) => {
  const eventId = decodeURIComponent(params.eventId);

  if (!eventId) {
    notFound();
  }
  
  return (
    <div>
      <EventDetails eventName={eventId} />
    </div>
  );
};

export default Page;
