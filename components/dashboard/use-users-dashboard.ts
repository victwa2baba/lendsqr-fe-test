'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  DASHBOARD_USERS_API_ENDPOINT,
  EMPTY_USER_STATISTICS,
  STAT_ITEMS,
  USERS_PER_PAGE,
} from '@/lib/constants/dashboard';
import type {
  PaginationToken,
  StatCardItem,
  UserRow,
  UserStatistics,
} from '@/lib/types/dashboard';
import {
  buildPaginationTokens,
  buildStatisticsFromPayload,
  mapApiUsersToRows,
} from '@/utils/dashboard/users';

const USER_COUNT_FORMATTER = new Intl.NumberFormat('en-US');

export function useUsersDashboard() {
  const [tableRows, setTableRows] = useState<UserRow[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersLoadError, setUsersLoadError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics>(EMPTY_USER_STATISTICS);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setUsersLoadError(null);

      try {
        const response = await fetch(DASHBOARD_USERS_API_ENDPOINT, {
          cache: 'no-store',
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch users (${response.status})`);
        }

        const payload = (await response.json()) as unknown;
        const mappedRows = mapApiUsersToRows(payload);

        if (mappedRows.length === 0) {
          throw new Error('No users were returned from the API.');
        }

        setTableRows(mappedRows);
        setStatistics(buildStatisticsFromPayload(payload, mappedRows));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setUsersLoadError('Unable to load users from API.');
        setTableRows([]);
        setStatistics(EMPTY_USER_STATISTICS);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    void fetchUsers();

    return () => {
      abortController.abort();
    };
  }, []);

  const totalUsers = statistics.totalUsers;
  const totalPages = Math.max(1, Math.ceil(totalUsers / USERS_PER_PAGE));
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return tableRows.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [currentPage, tableRows]);
  const visibleUsers = paginatedRows.length;
  const formattedTotalUsers = USER_COUNT_FORMATTER.format(totalUsers);
  const formattedVisibleUsers = USER_COUNT_FORMATTER.format(visibleUsers);
  const formattedActiveUsersCount = USER_COUNT_FORMATTER.format(statistics.activeUsers);
  const formattedUsersWithLoansCount = USER_COUNT_FORMATTER.format(statistics.usersWithLoans);
  const formattedUsersWithSavingsCount = USER_COUNT_FORMATTER.format(
    statistics.usersWithSavings,
  );

  const statItems = useMemo<StatCardItem[]>(() => {
    return STAT_ITEMS.map((item) => {
      let value = formattedTotalUsers;

      if (item.label === 'Users') {
        value = formattedTotalUsers;
      }

      if (item.label === 'Active Users') {
        value = formattedActiveUsersCount;
      }

      if (item.label === 'Users with Loans') {
        value = formattedUsersWithLoansCount;
      }

      if (item.label === 'Users with Savings') {
        value = formattedUsersWithSavingsCount;
      }

      return { ...item, value };
    });
  }, [
    formattedActiveUsersCount,
    formattedTotalUsers,
    formattedUsersWithLoansCount,
    formattedUsersWithSavingsCount,
  ]);

  const paginationTokens = useMemo<PaginationToken[]>(
    () => buildPaginationTokens(currentPage, totalPages),
    [currentPage, totalPages],
  );
  const paginationDisabled = isLoadingUsers || totalUsers === 0;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePreviousPage = () => {
    setCurrentPage((previousPage) => Math.max(1, previousPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((previousPage) => Math.min(totalPages, previousPage + 1));
  };

  return {
    currentPage,
    formattedTotalUsers,
    formattedVisibleUsers,
    handleNextPage,
    handlePreviousPage,
    isLoadingUsers,
    paginatedRows,
    paginationDisabled,
    paginationTokens,
    setCurrentPage,
    statItems,
    totalPages,
    usersLoadError,
  };
}
