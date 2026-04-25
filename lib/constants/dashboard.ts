import type {
  DashboardNavSection,
  StatItem,
  UserStatistics,
  UserTableFilters,
} from '@/lib/types/dashboard';

export const DASHBOARD_USERS_API_ENDPOINT = '/api/users';
export const USERS_PER_PAGE = 9;

export const SIDEBAR_META_ICONS = {
  switchOrganization: '/icons/sidebar/briefcase 1.svg',
  dashboard: '/icons/sidebar/home 1.svg',
} as const;

export const STAT_ITEMS: StatItem[] = [
  { label: 'Users', tint: '#DF18FF', iconSrc: '/icons/np_users_1248631_000000 1.svg' },
  { label: 'Active Users', tint: '#5718FF', iconSrc: '/icons/np_users_1977590_000000 1.svg' },
  {
    label: 'Users with Loans',
    tint: '#F55F44',
    iconSrc: '/icons/np_loan_1243991_000000 1.svg',
  },
  {
    label: 'Users with Savings',
    tint: '#FF3366',
    iconSrc: '/icons/np_money_549109_000000 1.svg',
  },
];

export const NAV_SECTIONS: DashboardNavSection[] = [
  {
    title: 'Customers',
    items: [
      { label: 'Users', iconSrc: '/icons/sidebar/users 1.svg', active: true },
      { label: 'Guarantors', iconSrc: '/icons/sidebar/user-friends 1.svg' },
      { label: 'Loans', iconSrc: '/icons/sidebar/loan 1.svg' },
      { label: 'Decision Models', iconSrc: '/icons/sidebar/handshake-regular 1.svg' },
      { label: 'Savings', iconSrc: '/icons/sidebar/piggy-bank 1.svg' },
      { label: 'Loan Requests', iconSrc: '/icons/sidebar/loan request.svg' },
      { label: 'Whitelist', iconSrc: '/icons/sidebar/user-check 1.svg' },
      { label: 'Karma', iconSrc: '/icons/sidebar/user-times 1.svg' },
    ],
  },
  {
    title: 'Businesses',
    items: [
      { label: 'Organization', iconSrc: '/icons/sidebar/briefcase 1.svg' },
      { label: 'Loan Products', iconSrc: '/icons/sidebar/np_loan_1243991_000000 1.svg' },
      { label: 'Savings Products', iconSrc: '/icons/sidebar/np_bank_148501_000000 1.svg' },
      { label: 'Fees and Charges', iconSrc: '/icons/sidebar/coins-solid 1.svg' },
      { label: 'Transactions', iconSrc: '/icons/sidebar/transaction.svg' },
      { label: 'Services', iconSrc: '/icons/sidebar/galaxy 1.svg' },
      { label: 'Service Account', iconSrc: '/icons/sidebar/user-cog 1.svg' },
      { label: 'Settlements', iconSrc: '/icons/sidebar/scroll 1.svg' },
      { label: 'Reports', iconSrc: '/icons/sidebar/chart-bar 2.svg' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Preferences', iconSrc: '/icons/sidebar/sliders-h 1.svg' },
      { label: 'Fees and Pricing', iconSrc: '/icons/sidebar/badge-percent 1.svg' },
      { label: 'Audit Logs', iconSrc: '/icons/sidebar/clipboard-list 1.svg' },
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

export const TABLE_COLUMN_TEMPLATE = '116px 106px 147px 130px 154px 100px 20px';

export const EMPTY_USER_STATISTICS: UserStatistics = {
  totalUsers: 0,
  activeUsers: 0,
  usersWithLoans: 0,
  usersWithSavings: 0,
};

export const EMPTY_USER_TABLE_FILTERS: UserTableFilters = {
  organization: '',
  username: '',
  email: '',
  phoneNumber: '',
  dateJoined: '',
  status: '',
};
