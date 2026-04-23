import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/reveal';
import { Marquee } from '@/components/ui/marquee';

export const metadata: Metadata = {
  title: 'Lendsqr Test Task',
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
};

export default function HomePage() {
   return (
    <div className="w-full">
      this
    </div>
  );
}
