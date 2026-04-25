import type { ReactNode } from 'react';
import '@/styles/globals.scss';
import { Providers } from './providers';
import type { Metadata, Viewport } from 'next';

const siteName = 'Lendsqr Test Task';
const siteDescription =
  'A test task for Lendsqr frontend position. Built with Next.js 16, TypeScript, and Tailwind CSS.';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description: siteDescription,
    url: '/',
    images: [ 
      {
        url: '/images/favicon.png',
        width: 500,
        height: 500,
        alt: `${siteName} - ${siteDescription}`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: siteName,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <body className="antialiased">
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
