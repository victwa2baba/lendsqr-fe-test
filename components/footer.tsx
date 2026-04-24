'use client';

import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname === '/login') {
    return null;
  }

  return (
    <footer className="w-full border-t border-[#e5e9f2] bg-white px-6 py-4 text-center text-xs text-[#545f7d]">
      © {year} Lendsqr
    </footer>
  );
}
