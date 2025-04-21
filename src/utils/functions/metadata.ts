import { Metadata } from 'next';

export function constructMetaData({
  title = 'Regalia 2025',
  description = 'Techtrix is the Official Techno-Management Fest of RCCIIT.',
  authors = {
    name: 'TECHTRIX RCCIIT Team 2025',
    url: 'https://techtrix.rcciit.org.in/',
  },
  creator = 'TECHTRIX RCCIIT Team 2025',
  generator = 'Next.js',
  publisher = 'TECHTRIX',
  icons = '/favicon.ico',
  robots = 'index, follow',
  image = '/assets/home/techtrix.png',
}: {
  title?: string;
  description?: string;
  image?: string;
  authors?: { name: string; url: string };
  creator?: string;
  generator?: string;
  publisher?: string;
  icons?: string;
  robots?: string;
} = {}): Metadata {
  return {
    title,
    description,
    authors,
    creator,
    generator,
    publisher,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    icons,
    metadataBase: new URL('https://techtrix.rcciit.org.in/'),
    robots,
  };
}
