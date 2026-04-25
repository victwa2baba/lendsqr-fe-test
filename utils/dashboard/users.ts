import type {
  ApiUserRecord,
  PaginationToken,
  UserDetails,
  UserRow,
  UserStatistics,
  UserStatus,
  UserTableFilters,
} from '@/lib/types/dashboard';

const USER_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const USER_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});
const DEFAULT_CURRENCY = 'NGN';

export function getStatusPalette(status: UserStatus) {
  switch (status) {
    case 'Active':
      return {
        background: 'rgba(57, 205, 98, 0.1)',
        color: '#39CD62',
      };
    case 'Pending':
      return {
        background: 'rgba(233, 178, 0, 0.1)',
        color: '#E9B200',
      };
    case 'Blacklisted':
      return {
        background: 'rgba(228, 3, 59, 0.1)',
        color: '#E4033B',
      };
    default:
      return {
        background: 'rgba(84, 95, 125, 0.1)',
        color: '#545F7D',
      };
  }
}

function normalizeStatus(status: string): UserStatus {
  const normalizedStatus = status.trim().toLowerCase();

  if (normalizedStatus === 'inactive') {
    return 'Inactive';
  }

  if (normalizedStatus === 'pending') {
    return 'Pending';
  }

  if (normalizedStatus === 'blacklisted') {
    return 'Blacklisted';
  }

  if (normalizedStatus === 'active') {
    return 'Active';
  }

  return 'Inactive';
}

function formatDateJoined(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return `${USER_DATE_FORMATTER.format(date)} ${USER_TIME_FORMATTER.format(date)}`;
}

function getStringValue(record: ApiUserRecord, key: string) {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

function getObjectValue(record: ApiUserRecord, key: string): ApiUserRecord {
  const value = record[key];
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as ApiUserRecord)
    : {};
}

function getUserIdentifier(record: ApiUserRecord) {
  return (
    getStringValue(record, 'id') ||
    getStringValue(record, '_id') ||
    getStringValue(record, 'email')
  );
}

function normalizeDisplayValue(value: string, fallback = '-') {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : fallback;
}

function normalizeCurrencyCode(value: string) {
  const normalizedCurrency = value.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(normalizedCurrency) ? normalizedCurrency : DEFAULT_CURRENCY;
}

export function mapApiUsersToRows(payload: unknown): UserRow[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.reduce<UserRow[]>((rows, item) => {
    if (!item || typeof item !== 'object') {
      return rows;
    }

    const record = item as ApiUserRecord;
    const email = getStringValue(record, 'email');
    const id = getUserIdentifier(record);

    if (!email || !id) {
      return rows;
    }

    const userNameFromEmail = email.includes('@') ? email.split('@')[0] : 'unknown';

    rows.push({
      id,
      organization:
        getStringValue(record, 'orgName') ||
        getStringValue(record, 'organization') ||
        'Unknown Organization',
      username:
        getStringValue(record, 'userName') ||
        getStringValue(record, 'username') ||
        userNameFromEmail,
      email,
      phoneNumber:
        getStringValue(record, 'phoneNumber') || getStringValue(record, 'phone') || '-',
      dateJoined: formatDateJoined(getStringValue(record, 'createdAt')),
      status: normalizeStatus(getStringValue(record, 'status')),
    });

    return rows;
  }, []);
}

export function findUserRecordById(payload: unknown, userId: string): ApiUserRecord | null {
  if (!Array.isArray(payload)) {
    return null;
  }

  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    return null;
  }

  const matchedUser = payload.find((item) => {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const userRecord = item as ApiUserRecord;
    return getUserIdentifier(userRecord) === normalizedUserId;
  });

  return matchedUser && typeof matchedUser === 'object'
    ? (matchedUser as ApiUserRecord)
    : null;
}

export function mapApiUserRecordToDetails(record: ApiUserRecord): UserDetails {
  const profile = getObjectValue(record, 'profile');
  const education = getObjectValue(record, 'education');
  const socials = getObjectValue(record, 'socials');
  const guarantor = getObjectValue(record, 'guarantor');
  const currencyCode = normalizeCurrencyCode(getStringValue(profile, 'currency'));

  const email = getStringValue(record, 'email');
  const organization = getStringValue(record, 'orgName');
  const username = getStringValue(record, 'userName') || getStringValue(record, 'username');
  const profileFirstName = getStringValue(profile, 'firstName');
  const profileLastName = getStringValue(profile, 'lastName');
  const fullName = normalizeDisplayValue(`${profileFirstName} ${profileLastName}`.trim());
  const guarantorFirstName = getStringValue(guarantor, 'firstName');
  const guarantorLastName = getStringValue(guarantor, 'lastName');
  const guarantorEmail =
    getStringValue(guarantor, 'email') || getStringValue(record, 'guarantorEmail');
  const guarantorRelationship =
    getStringValue(guarantor, 'relationship') ||
    getStringValue(record, 'guarantorRelationship');

  return {
    id: getUserIdentifier(record),
    organization: normalizeDisplayValue(organization, 'Unknown Organization'),
    username: normalizeDisplayValue(username, email.split('@')[0] || 'unknown'),
    email: normalizeDisplayValue(email),
    phoneNumber: normalizeDisplayValue(
      getStringValue(record, 'phoneNumber') ||
        getStringValue(profile, 'phoneNumber') ||
        getStringValue(record, 'phone'),
    ),
    dateJoined: formatDateJoined(getStringValue(record, 'createdAt')),
    status: normalizeStatus(getStringValue(record, 'status')),
    fullName,
    avatarSrc: normalizeDisplayValue(
      getStringValue(profile, 'avatar'),
      '/images/dashboard/avatar.png',
    ),
    bvn: normalizeDisplayValue(getStringValue(profile, 'bvn')),
    gender: normalizeDisplayValue(getStringValue(profile, 'gender')),
    maritalStatus: normalizeDisplayValue(getStringValue(record, 'maritalStatus')),
    children: normalizeDisplayValue(getStringValue(record, 'children')),
    typeOfResidence: normalizeDisplayValue(getStringValue(record, 'typeOfResidence')),
    educationLevel: normalizeDisplayValue(getStringValue(education, 'level')),
    employmentStatus: normalizeDisplayValue(getStringValue(education, 'employmentStatus')),
    sector: normalizeDisplayValue(getStringValue(education, 'sector')),
    employmentDuration: normalizeDisplayValue(getStringValue(education, 'duration')),
    officeEmail: normalizeDisplayValue(getStringValue(education, 'officeEmail')),
    monthlyIncome: formatMonthlyIncome(education.monthlyIncome, currencyCode),
    loanRepayment: formatLoanRepayment(education.loanRepayment, currencyCode),
    twitter: normalizeDisplayValue(getStringValue(socials, 'twitter')),
    facebook: normalizeDisplayValue(getStringValue(socials, 'facebook')),
    instagram: normalizeDisplayValue(getStringValue(socials, 'instagram')),
    guarantorFullName: normalizeDisplayValue(
      `${guarantorFirstName} ${guarantorLastName}`.trim(),
    ),
    guarantorPhoneNumber: normalizeDisplayValue(getStringValue(guarantor, 'phoneNumber')),
    guarantorEmail: normalizeDisplayValue(guarantorEmail),
    guarantorRelationship: normalizeDisplayValue(guarantorRelationship),
    accountBalance: formatAccountBalance(record.accountBalance, currencyCode),
    accountNumber: normalizeDisplayValue(getStringValue(record, 'accountNumber')),
    bankName: normalizeDisplayValue(
      getStringValue(record, 'bankName') || getStringValue(record, 'orgName'),
    ),
    userTier: 1,
  };
}

function parseNumberValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value.replace(/,/g, ''));
    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return null;
}

function formatAmountWithCurrency(value: unknown, currencyCode: string) {
  const parsedValue = parseNumberValue(value);
  const safeCurrencyCode = normalizeCurrencyCode(currencyCode);

  if (parsedValue === null) {
    return `${safeCurrencyCode} 0.00`;
  }

  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: safeCurrencyCode,
      minimumFractionDigits: 2,
    }).format(parsedValue);
  } catch {
    return `${safeCurrencyCode} ${parsedValue.toFixed(2)}`;
  }
}

function formatMonthlyIncome(value: unknown, currencyCode: string) {
  if (Array.isArray(value)) {
    const incomes = value
      .map((income) => formatAmountWithCurrency(income, currencyCode))
      .filter((income) => income.length > 0);

    if (incomes.length > 0) {
      return incomes.join(' - ');
    }
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return formatAmountWithCurrency(value, currencyCode);
  }

  return '-';
}

function formatAccountBalance(value: unknown, currencyCode: string) {
  return formatAmountWithCurrency(value, currencyCode);
}

function formatLoanRepayment(value: unknown, currencyCode: string) {
  return formatAmountWithCurrency(value, currencyCode);
}

export function buildStatisticsFromPayload(
  payload: unknown,
  rows: UserRow[],
): UserStatistics {
  if (!Array.isArray(payload)) {
    return {
      totalUsers: rows.length,
      activeUsers: rows.filter((row) => row.status === 'Active').length,
      usersWithLoans: 0,
      usersWithSavings: 0,
    };
  }

  const usersWithLoans = payload.reduce((count, item) => {
    if (!item || typeof item !== 'object') {
      return count;
    }

    const record = item as ApiUserRecord;
    const education = record.education;

    if (!education || typeof education !== 'object') {
      return count;
    }

    const repayment = parseNumberValue((education as ApiUserRecord).loanRepayment);
    return repayment !== null && repayment > 0 ? count + 1 : count;
  }, 0);

  const usersWithSavings = payload.reduce((count, item) => {
    if (!item || typeof item !== 'object') {
      return count;
    }

    const balance = parseNumberValue((item as ApiUserRecord).accountBalance);
    return balance !== null && balance > 0 ? count + 1 : count;
  }, 0);

  return {
    totalUsers: rows.length,
    activeUsers: rows.filter((row) => row.status === 'Active').length,
    usersWithLoans,
    usersWithSavings,
  };
}

export function buildPaginationTokens(
  currentPage: number,
  totalPages: number,
): PaginationToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const tokens: PaginationToken[] = [1];
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  if (startPage > 2) {
    tokens.push('...');
  }

  for (let page = startPage; page <= endPage; page += 1) {
    tokens.push(page);
  }

  if (endPage < totalPages - 1) {
    tokens.push('...');
  }

  tokens.push(totalPages);

  return tokens;
}

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

export function filterUserRowsByQuery(rows: UserRow[], query: string): UserRow[] {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return rows;
  }

  return rows.filter((row) => {
    const searchableValues = [
      row.organization,
      row.username,
      row.email,
      row.phoneNumber,
      row.dateJoined,
      row.status,
    ];

    return searchableValues.some((value) =>
      normalizeSearchValue(value).includes(normalizedQuery),
    );
  });
}

function containsFilterValue(target: string, filterValue: string) {
  const normalizedFilterValue = normalizeSearchValue(filterValue);

  if (!normalizedFilterValue) {
    return true;
  }

  return normalizeSearchValue(target).includes(normalizedFilterValue);
}

function formatDateToInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function matchesDateFilter(dateJoinedLabel: string, dateFilterValue: string) {
  const normalizedDateFilterValue = dateFilterValue.trim();

  if (!normalizedDateFilterValue) {
    return true;
  }

  const parsedJoinedDate = new Date(dateJoinedLabel);

  if (Number.isNaN(parsedJoinedDate.getTime())) {
    return false;
  }

  return formatDateToInputValue(parsedJoinedDate) === normalizedDateFilterValue;
}

export function filterUserRowsByAdvancedFilters(
  rows: UserRow[],
  filters: UserTableFilters,
): UserRow[] {
  return rows.filter((row) => {
    const organizationMatches = containsFilterValue(
      row.organization,
      filters.organization,
    );
    const usernameMatches = containsFilterValue(row.username, filters.username);
    const emailMatches = containsFilterValue(row.email, filters.email);
    const phoneMatches = containsFilterValue(row.phoneNumber, filters.phoneNumber);
    const dateMatches = matchesDateFilter(row.dateJoined, filters.dateJoined);
    const statusMatches = filters.status
      ? normalizeSearchValue(row.status) === normalizeSearchValue(filters.status)
      : true;

    return (
      organizationMatches &&
      usernameMatches &&
      emailMatches &&
      phoneMatches &&
      dateMatches &&
      statusMatches
    );
  });
}
