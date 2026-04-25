export type StatItem = {
  label: string;
  tint: string;
  iconSrc: string;
};

export type StatCardItem = StatItem & { value: string };

export type UserStatus = 'Inactive' | 'Pending' | 'Blacklisted' | 'Active';

export type DashboardNavItem = {
  label: string;
  iconSrc: string;
  active?: boolean;
};

export type DashboardNavSection = {
  title: string;
  items: DashboardNavItem[];
};

export type UserRow = {
  id: string;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: UserStatus;
};

export type UserDetails = {
  id: string;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: UserStatus;
  fullName: string;
  avatarSrc: string;
  bvn: string;
  gender: string;
  maritalStatus: string;
  children: string;
  typeOfResidence: string;
  educationLevel: string;
  employmentStatus: string;
  sector: string;
  employmentDuration: string;
  officeEmail: string;
  monthlyIncome: string;
  loanRepayment: string;
  twitter: string;
  facebook: string;
  instagram: string;
  guarantorFullName: string;
  guarantorPhoneNumber: string;
  guarantorEmail: string;
  guarantorRelationship: string;
  accountBalance: string;
  accountNumber: string;
  bankName: string;
  userTier: number;
};

export type UserTableFilters = {
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: UserStatus | '';
};

export type ApiUserRecord = Record<string, unknown>;

export type PaginationToken = number | '...';

export type UserStatistics = {
  totalUsers: number;
  activeUsers: number;
  usersWithLoans: number;
  usersWithSavings: number;
};
