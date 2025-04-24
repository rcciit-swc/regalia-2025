import type { Metadata } from 'next';
import { constructMetaData } from '@/utils/functions/metadata';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = constructMetaData({
  title: 'Admin | Regalia 2025',
  description: 'For Admins of Regalia RCCIIT 2025.',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black min-h-screen w-full font-instrumentSans  pt-14  max-w-7xl mx-auto">
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col mt-3 md:flex-row gap-4 w-full justify-center">
          <Link href="/admin/manage-events" className="w-full md:w-auto">
            <Button
              className={`w-full md:w-auto text-xl py-7 px-8 bg-yellow-200 text-black hover:bg-yellow-300`}
            >
              Edit Events
            </Button>
          </Link>

          <Link href="/admin/approve" className="w-full md:w-auto">
            <Button
              className={`w-full md:w-auto text-xl py-7 px-8 bg-yellow-200 text-black hover:bg-yellow-300`}
            >
              Registrations
            </Button>
          </Link>
        </div>
        <div className="w-full mt-8">{children}</div>
      </div>
    </div>
  );
}
