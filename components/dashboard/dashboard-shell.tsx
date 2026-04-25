'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { Header, MobileHeader } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { NAV_SECTIONS } from '@/lib/constants/dashboard';

type DashboardShellProps = {
  desktopContent: ReactNode;
  mobileContent?: ReactNode;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  desktopMainClassName?: string;
  mobileMainClassName?: string;
};

const DEMO_DASHBOARD_USER_NAME = 'Victor';
const DEMO_DASHBOARD_AVATAR = '/images/dashboard/avatar.png';

export function DashboardShell({
  desktopContent,
  mobileContent,
  onSearch,
  searchPlaceholder = 'Search users',
  desktopMainClassName = 'min-w-0 px-6 pb-10 pt-10 xl:px-[60px] xl:pb-[40px] xl:pt-[60px]',
  mobileMainClassName = 'px-4 pb-8 pt-6 sm:px-6',
}: DashboardShellProps) {
  const { logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const handleEscapeKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscapeKeyDown);
    };
  }, [isMobileSidebarOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileSidebarOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-['Work_Sans'] text-[#545F7D]">
      <div className="hidden lg:block">
        <div className="mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-[283px_minmax(0,1fr)] grid-rows-[100px_minmax(0,1fr)]">
          <Header
            userName={DEMO_DASHBOARD_USER_NAME}
            avatarSrc={DEMO_DASHBOARD_AVATAR}
            onLogout={logout}
            onSearch={onSearch}
            searchPlaceholder={searchPlaceholder}
          />
          <Sidebar sections={NAV_SECTIONS} />

          <main className={desktopMainClassName}>{desktopContent}</main>
        </div>
      </div>

      <div className="pt-[76px] lg:hidden">
        {isMobileSidebarOpen ? (
          <div className="fixed inset-x-0 bottom-0 top-[76px] z-[190]">
            <button
              type="button"
              className="absolute inset-0 bg-[#213F7D66]"
              aria-label="Close sidebar"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative h-full w-[300px] max-w-[88vw] overflow-y-auto bg-white">
              <Sidebar
                sections={NAV_SECTIONS}
                className="h-full overflow-y-auto border-r border-[#213F7D0F] pb-8 pt-6 shadow-[0px_5px_20px_0px_rgba(0,0,0,0.08)]"
              />
            </div>
          </div>
        ) : null}

        <MobileHeader
          userName={DEMO_DASHBOARD_USER_NAME}
          avatarSrc={DEMO_DASHBOARD_AVATAR}
          onLogout={logout}
          onMenuToggle={() => setIsMobileSidebarOpen((previousState) => !previousState)}
          isSidebarOpen={isMobileSidebarOpen}
        />

        <main className={mobileMainClassName}>{mobileContent ?? desktopContent}</main>
      </div>
    </div>
  );
}
