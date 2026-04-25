'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  DASHBOARD_USERS_API_ENDPOINT,
  EMPTY_USER_STATISTICS,
  EMPTY_USER_TABLE_FILTERS,
  STAT_ITEMS,
  USERS_PER_PAGE,
} from '@/lib/constants/dashboard';
import type {
  PaginationToken,
  StatCardItem,
  UserRow,
  UserStatus,
  UserStatistics,
  UserTableFilters,
} from '@/lib/types/dashboard';
import {
  buildPaginationTokens,
  buildStatisticsFromPayload,
  filterUserRowsByAdvancedFilters,
  filterUserRowsByQuery,
  mapApiUsersToRows,
} from '@/utils/dashboard/users';

const USER_COUNT_FORMATTER = new Intl.NumberFormat('en-US');

export function useUsersDashboard() {
  const [tableRows, setTableRows] = useState<UserRow[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersLoadError, setUsersLoadError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics>(EMPTY_USER_STATISTICS);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<UserTableFilters>(
    EMPTY_USER_TABLE_FILTERS,
  );

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

  const queryFilteredRows = useMemo(
    () => filterUserRowsByQuery(tableRows, searchQuery),
    [searchQuery, tableRows],
  );
  const filteredRows = useMemo(
    () => filterUserRowsByAdvancedFilters(queryFilteredRows, appliedFilters),
    [appliedFilters, queryFilteredRows],
  );
  const totalUsers = tableRows.length;
  const organizationOptions = useMemo(() => {
    const uniqueOrganizations = new Set(
      tableRows
        .map((row) => row.organization.trim())
        .filter((organization) => organization.length > 0),
    );

    return Array.from(uniqueOrganizations).sort((firstOrganization, secondOrganization) =>
      firstOrganization.localeCompare(secondOrganization),
    );
  }, [tableRows]);
  const totalFilteredUsers = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredUsers / USERS_PER_PAGE));
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return filteredRows.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [currentPage, filteredRows]);
  const visibleUsers = paginatedRows.length;
  const formattedTotalUsers = USER_COUNT_FORMATTER.format(totalUsers);
  const formattedVisibleUsers = USER_COUNT_FORMATTER.format(visibleUsers);
  const activeUsersCount = tableRows.filter((row) => row.status === 'Active').length;
  const formattedActiveUsersCount = USER_COUNT_FORMATTER.format(activeUsersCount);
  const formattedUsersWithLoansCount = USER_COUNT_FORMATTER.format(statistics.usersWithLoans);
  const formattedUsersWithSavingsCount = USER_COUNT_FORMATTER.format(
    statistics.usersWithSavings,
  );
  const hasActiveFilters = useMemo(
    () =>
      Object.values(appliedFilters).some(
        (value) => typeof value === 'string' && value.trim().length > 0,
      ),
    [appliedFilters],
  );
  const hasActiveSearch = searchQuery.trim().length > 0;
  const paginationTotalUsers = hasActiveFilters || hasActiveSearch
    ? totalFilteredUsers
    : totalUsers;
  const formattedPaginationTotalUsers = USER_COUNT_FORMATTER.format(paginationTotalUsers);

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
  const paginationDisabled = isLoadingUsers || totalFilteredUsers === 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters, searchQuery]);

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

  const handleSearch = (query: string) => {
    setSearchQuery(query.trim());
  };

  const handleApplyFilters = (filters: UserTableFilters) => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    setAppliedFilters(EMPTY_USER_TABLE_FILTERS);
  };

  const handleUpdateUserStatus = (email: string, status: UserStatus) => {
    setTableRows((previousRows) =>
      previousRows.map((row) => (row.email === email ? { ...row, status } : row)),
    );
  };

  return {
    appliedFilters,
    currentPage,
    formattedPaginationTotalUsers,
    formattedTotalUsers,
    formattedVisibleUsers,
    handleApplyFilters,
    handleNextPage,
    handlePreviousPage,
    handleResetFilters,
    isLoadingUsers,
    organizationOptions,
    hasActiveFilters,
    handleUpdateUserStatus,
    paginatedRows,
    paginationDisabled,
    paginationTokens,
    searchQuery,
    handleSearch,
    setCurrentPage,
    statItems,
    totalPages,
    usersLoadError,
  };
}
