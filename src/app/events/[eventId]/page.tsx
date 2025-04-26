import { Metadata } from 'next';
import EventDetails from '@/components/Events/EventDetails';
import { notFound } from 'next/navigation';
import { constructMetaData, getEventByID } from '@/utils/functions';

export async function generateMetadata({
  params,
}: {
  params: { eventId: string };
}): Promise<Metadata> {
  const eventData = await getEventByID(params.eventId);

  return constructMetaData({
    title: eventData ? `${eventData.name} | Regalia 2025` : 'Event Not Found',
    description: eventData ? `Details for ${eventData.name}` : '',
    image: eventData?.image_url || '/favicon.png',
  });
}
const Page = async ({ params }: { params: { eventId: string } }) => {
  const eventId = decodeURIComponent(params.eventId);

  if (!eventId) {
    notFound();
  }

  return (
    <div>
      <EventDetails eventId={eventId} />
    </div>
  );
};

export default Page;
