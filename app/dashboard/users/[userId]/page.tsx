import type { Metadata } from 'next';

import { UserDetailsDashboard } from '@/components/dashboard/user-details-dashboard';

export const metadata: Metadata = {
  title: 'User Details',
};

type UserDetailsPageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { userId } = await params;
  return <UserDetailsDashboard userId={userId} />;
}
