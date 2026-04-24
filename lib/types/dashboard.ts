import type { LucideIcon } from 'lucide-react';

export type StatItem = {
  label: string;
  tint: string;
  Icon: LucideIcon;
};

export type StatCardItem = StatItem & { value: string };

export type UserStatus = 'Inactive' | 'Pending' | 'Blacklisted' | 'Active';

export type DashboardNavItem = {
  label: string;
  Icon: LucideIcon;
  active?: boolean;
};

export type DashboardNavSection = {
  title: string;
  items: DashboardNavItem[];
};

export type UserRow = {
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: UserStatus;
};

export type ApiUserRecord = Record<string, unknown>;

export type PaginationToken = number | '...';

export type UserStatistics = {
  totalUsers: number;
  activeUsers: number;
  usersWithLoans: number;
  usersWithSavings: number;
};
