import { EventCards } from '@/components/admin/manage-events/EventsCard';
import { Button } from '@/components/ui/button';
import { supabaseServer } from '@/utils/functions/supabase-server';
import Link from 'next/link';

const Page = async () => {
  const supabase = await supabaseServer();
  const { data: sessionData } = await supabase.auth.getSession();
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('user_id', sessionData.session?.user.id);
  const isAdmin = data?.find((role) => role.role === 'super_admin');
  return (
    <div className="w-full flex flex-col items-center bg-[#210000] justify-center">
      {isAdmin && (
        <Link href="/admin/manage-events/add-event">
          <Button className="mt-3 mb-4  p-6 bg-yellow-200 text-black hover:bg-yellow-300">
            Add Event
          </Button>
        </Link>
      )}
      <EventCards isSuperAdmin={isAdmin} eventID={data![0]?.event_id} />
    </div>
  );
};

export default Page;
