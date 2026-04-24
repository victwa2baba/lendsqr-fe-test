import {
  BriefcaseBusiness,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  FileBarChart2,
  HandCoins,
  Landmark,
  Layers3,
  PiggyBank,
  ScrollText,
  Settings,
  SlidersHorizontal,
  UserCheck,
  UserCog,
  UserRoundX,
  Users,
  WalletCards,
} from 'lucide-react';

import type { DashboardNavSection, StatItem, UserStatistics } from '@/lib/types/dashboard';

export const DASHBOARD_USERS_API_ENDPOINT = '/api/users';
export const USERS_PER_PAGE = 9;

export const STAT_ITEMS: StatItem[] = [
  { label: 'Users', tint: '#DF18FF', Icon: Users },
  { label: 'Active Users', tint: '#5718FF', Icon: UserCheck },
  {
    label: 'Users with Loans',
    tint: '#F55F44',
    Icon: WalletCards,
  },
  {
    label: 'Users with Savings',
    tint: '#FF3366',
    Icon: PiggyBank,
  },
];

export const NAV_SECTIONS: DashboardNavSection[] = [
  {
    title: 'Customers',
    items: [
      { label: 'Users', Icon: Users, active: true },
      { label: 'Guarantors', Icon: UserCheck },
      { label: 'Loans', Icon: HandCoins },
      { label: 'Decision Models', Icon: SlidersHorizontal },
      { label: 'Savings', Icon: PiggyBank },
      { label: 'Loan Requests', Icon: CircleDollarSign },
      { label: 'Whitelist', Icon: UserCog },
      { label: 'Karma', Icon: UserRoundX },
    ],
  },
  {
    title: 'Businesses',
    items: [
      { label: 'Organization', Icon: BriefcaseBusiness },
      { label: 'Loan Products', Icon: HandCoins },
      { label: 'Savings Products', Icon: Landmark },
      { label: 'Fees and Charges', Icon: CreditCard },
      { label: 'Transactions', Icon: ClipboardList },
      { label: 'Services', Icon: Layers3 },
      { label: 'Service Account', Icon: UserCog },
      { label: 'Settlements', Icon: ScrollText },
      { label: 'Reports', Icon: FileBarChart2 },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Preferences', Icon: SlidersHorizontal },
      { label: 'Fees and Pricing', Icon: CreditCard },
      { label: 'Audit Logs', Icon: ClipboardList },
      { label: 'Systems Messages', Icon: Settings },
    ],
  },
];

export const TABLE_HEADERS = [
  'Organization',
  'Username',
  'Email',
  'Phone Number',
  'Date Joined',
  'Status',
  '',
];

export const TABLE_COLUMN_TEMPLATE = '116px 106px 147px 124px 154px 100px 20px';

export const EMPTY_USER_STATISTICS: UserStatistics = {
  totalUsers: 0,
  activeUsers: 0,
  usersWithLoans: 0,
  usersWithSavings: 0,
};
