'use client';

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

      <div className="lg:hidden">
        <MobileHeader
          userName={DEMO_DASHBOARD_USER_NAME}
          avatarSrc={DEMO_DASHBOARD_AVATAR}
          onLogout={logout}
        />

        <main className={mobileMainClassName}>{mobileContent ?? desktopContent}</main>
      </div>
    </div>
  );
}
