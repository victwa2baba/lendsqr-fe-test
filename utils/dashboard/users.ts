import type {
  ApiUserRecord,
  PaginationToken,
  UserRow,
  UserStatistics,
  UserStatus,
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

    if (!email) {
      return rows;
    }

    const userNameFromEmail = email.includes('@') ? email.split('@')[0] : 'unknown';

    rows.push({
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
