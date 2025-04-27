import { Metadata } from 'next';

export function constructMetaData({
  title = 'Regalia 2025',
  description = 'REGALIA is the Official Cultural Fest of RCCIIT.',
  authors = {
    name: 'REGALIA RCCIIT Team 2025',
    url: 'https://regalia.rcciit.org.in/',
  },
  creator = 'REGALIA RCCIIT Team 2025',
  generator = 'Next.js',
  publisher = 'TECHTRIX',
  icons = '/favicon.png',
  robots = 'index, follow',
  image = '/favicon.png',
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
