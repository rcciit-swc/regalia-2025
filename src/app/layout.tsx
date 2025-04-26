import type { Metadata } from 'next';
import './globals.css';
import { constructMetaData } from '@/utils/functions';
import { Inter } from 'next/font/google';
import SessionProvider from '@/components/SessionProvider';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Toaster } from 'sonner';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = constructMetaData({
  title: 'Regalia 2025',
  description: 'The Official Cultural Fest of RCCIIT.',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased my-scrollbar`}>
        <Navbar />
        {children}
        <Toaster position="bottom-right" richColors duration={5000} />
        <Footer />
        <SessionProvider />
      </body>
    </html>
  );
}
