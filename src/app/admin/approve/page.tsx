import EventsTable from '@/components/admin/approve/EventsTable';
import TableSkeleton from '@/components/admin/approve/TableSkeleton';
import { getRoles } from '@/utils/functions';
import { Suspense } from 'react';

export default async function EventsDashboard() {
  // Call the RPC function to fetch approval table data
  return (
    <div className="w-full p-4 bg-black">
      <h1 className="text-3xl font-sargento mb-4 text-white">
        Approve Registrations
      </h1>
      <Suspense fallback={<TableSkeleton />}>
        <EventsTable />
      </Suspense>
    </div>
  );
}
