import type { Metadata } from 'next';
import { UsersDashboard } from '@/components/dashboard/users-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
  alternates: {
    canonical: '/dashboard',
  },
  openGraph: {
    url: '/dashboard',
  },
};

export default function DashboardPage() {
  return <UsersDashboard />;
}
