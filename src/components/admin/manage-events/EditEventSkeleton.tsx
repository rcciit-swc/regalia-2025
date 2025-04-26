import { Skeleton } from '@/components/ui/skeleton';

export function EditEventSkeleton() {
  return (
    <div className="container max-w-7xl py-8 min-h-screen space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-48 bg-gray-700" />
          <Skeleton className="h-5 w-64 mt-1 bg-gray-700" />
        </div>
        <Skeleton className="h-10 w-32 bg-gray-700" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-7 w-40 bg-gray-700" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
