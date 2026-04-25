'use client';

import Image from 'next/image';
import { ChevronDown, LogOut } from 'lucide-react';

import { LoadingSpinner } from '@/components/dashboard/loading-spinner';
import { DesktopUsersTable } from '@/components/dashboard/users-table-desktop';
import { MobileUsersTable } from '@/components/dashboard/users-table-mobile';
import { useUsersDashboard } from '@/components/dashboard/use-users-dashboard';
import { Header, MobileHeader } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { NAV_SECTIONS } from '@/lib/constants/dashboard';

export function UsersDashboard() {
  const { logout } = useAuth();
  const userName = 'Adedeji';
  const avatarSrc = '/images/dashboard/avatar.png';

  const {
    appliedFilters,
    currentPage,
    formattedPaginationTotalUsers,
    formattedVisibleUsers,
    handleApplyFilters,
    handleNextPage,
    handlePreviousPage,
    handleResetFilters,
    handleSearch,
    handleUpdateUserStatus,
    hasActiveFilters,
    isLoadingUsers,
    organizationOptions,
    paginatedRows,
    paginationDisabled,
    paginationTokens,
    searchQuery,
    setCurrentPage,
    statItems,
    totalPages,
    usersLoadError,
  } = useUsersDashboard();

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-['Work_Sans'] text-[#545F7D]">
      <div className="hidden lg:block">
        <div className="mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-[283px_minmax(0,1fr)] grid-rows-[100px_minmax(0,1fr)]">
          <Header
            userName={userName}
            avatarSrc={avatarSrc}
            onSearch={handleSearch}
            searchPlaceholder="Search users"
          />
          <Sidebar sections={NAV_SECTIONS} onLogout={logout} />

          <main className="min-w-0 px-6 pb-10 pt-10 xl:px-[60px] xl:pb-[40px] xl:pt-[60px]">
            <h1 className="text-[24px] font-medium leading-[28px] text-[#213F7D]">Users</h1>

            <section className="mt-10 grid max-w-[1037px] grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-x-[26px] xl:gap-y-0">
              {statItems.map((item) => (
                <article
                  key={item.label}
                  className="h-[160px] rounded-[4px] border border-[#213F7D0F] bg-white px-[30px] py-5 shadow-[3px_5px_20px_0px_rgba(0,0,0,0.04)]"
                >
                  <div
                    className="inline-flex size-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${item.tint}1A` }}
                  >
                    <Image
                      src={item.iconSrc}
                      alt=""
                      width={24}
                      height={24}
                      aria-hidden
                      className="size-6"
                    />
                  </div>
                  <p className="mt-[14px] text-[14px] font-medium uppercase leading-[16px] tracking-[0.7px] text-[#545F7D]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-[24px] font-semibold leading-[28px] text-[#213F7D]">
                    {item.value}
                  </p>
                </article>
              ))}
            </section>

            <section className="mt-10 max-w-[1037px]">
              {isLoadingUsers ? <LoadingSpinner label="Loading users..." /> : null}
              {usersLoadError ? (
                <p className="mb-4 text-sm text-[#E4033B]">{usersLoadError}</p>
              ) : null}
              {!isLoadingUsers && paginatedRows.length > 0 ? (
                <DesktopUsersTable
                  rows={paginatedRows}
                  filters={appliedFilters}
                  hasActiveFilters={hasActiveFilters}
                  organizationOptions={organizationOptions}
                  onApplyFilters={handleApplyFilters}
                  onResetFilters={handleResetFilters}
                  onUpdateUserStatus={handleUpdateUserStatus}
                />
              ) : null}
              {!isLoadingUsers && !usersLoadError && paginatedRows.length === 0 ? (
                <div className="rounded-[4px] border border-[#213F7D14] bg-white px-4 py-6 text-sm text-[#545F7D]">
                  <p>
                    {searchQuery || hasActiveFilters
                      ? 'No users matched the current search and filter settings.'
                      : 'No users available.'}
                  </p>
                  {hasActiveFilters ? (
                    <button
                      type="button"
                      className="mt-4 inline-flex h-9 items-center rounded-[8px] bg-[#39CDCC] px-4 text-[13px] font-semibold text-white"
                      onClick={handleResetFilters}
                    >
                      Reset filters
                    </button>
                  ) : null}
                </div>
              ) : null}
            </section>

            <section className="mt-5 flex max-w-[1037px] flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-[10px] text-[14px] leading-[16px] text-[#545F7D]">
                <span>Showing</span>
                <button
                  type="button"
                  className="inline-flex h-[30px] items-center gap-2 rounded-[4px] bg-[#213F7D1A] px-3 font-medium text-[#213F7D]"
                >
                  <span>{formattedVisibleUsers}</span>
                  <ChevronDown className="size-[14px]" strokeWidth={2.5} />
                </button>
                <span>out of {formattedPaginationTotalUsers}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-5 text-[16px] leading-[19px] text-[#545F7D99]">
                  <button
                    type="button"
                    className="inline-flex size-6 items-center justify-center rounded-[4px] bg-[#213F7D1A] text-[#213F7D] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                    onClick={handlePreviousPage}
                    disabled={paginationDisabled || currentPage === 1}
                  >
                    <ChevronDown className="size-[14px] rotate-90" strokeWidth={2.5} />
                  </button>
                  {paginationTokens.map((token, tokenIndex) =>
                    token === '...' ? (
                      <span key={`desktop-ellipsis-${tokenIndex}`}>...</span>
                    ) : (
                      <button
                        key={`desktop-page-${token}`}
                        type="button"
                        className={token === currentPage ? 'font-medium text-[#213F7D]' : ''}
                        onClick={() => setCurrentPage(token)}
                        disabled={paginationDisabled}
                      >
                        {token}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    className="inline-flex size-6 items-center justify-center rounded-[4px] bg-[#213F7D1A] text-[#213F7D] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                    onClick={handleNextPage}
                    disabled={paginationDisabled || currentPage === totalPages}
                  >
                    <ChevronDown className="size-[14px] -rotate-90" strokeWidth={2.5} />
                  </button>
                </div>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    className="inline-flex h-[30px] items-center rounded-[8px] border border-[#39CDCC66] px-3 text-[12px] font-semibold text-[#39CDCC]"
                    onClick={handleResetFilters}
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>
            </section>
          </main>
        </div>
      </div>

      <div className="lg:hidden">
        <MobileHeader userName={userName} avatarSrc={avatarSrc} />

        <main className="px-4 pb-8 pt-6 sm:px-6">
          <h1 className="text-[24px] font-medium leading-[28px] text-[#213F7D]">Users</h1>

          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {statItems.map((item) => (
              <article
                key={`mobile-${item.label}`}
                className="rounded-[6px] border border-[#213F7D0F] bg-white px-5 py-4 shadow-[3px_5px_20px_0px_rgba(0,0,0,0.04)]"
              >
                <div
                  className="inline-flex size-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${item.tint}1A` }}
                >
                  <Image
                    src={item.iconSrc}
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden
                    className="size-6"
                  />
                </div>
                <p className="mt-3 text-[12px] font-medium uppercase tracking-[0.6px] text-[#545F7D]">
                  {item.label}
                </p>
                <p className="mt-2 text-[22px] font-semibold leading-[26px] text-[#213F7D]">
                  {item.value}
                </p>
              </article>
            ))}
          </section>

          <section className="mt-6">
            {isLoadingUsers ? <LoadingSpinner label="Loading users..." /> : null}
            {usersLoadError ? (
              <p className="mb-4 text-sm text-[#E4033B]">{usersLoadError}</p>
            ) : null}
            {!isLoadingUsers && paginatedRows.length > 0 ? (
              <MobileUsersTable
                rows={paginatedRows}
                onUpdateUserStatus={handleUpdateUserStatus}
              />
            ) : null}
            {!isLoadingUsers && !usersLoadError && paginatedRows.length === 0 ? (
              <div className="rounded-[6px] border border-[#213F7D14] bg-white px-4 py-6 text-sm text-[#545F7D]">
                <p>
                  {searchQuery || hasActiveFilters
                    ? 'No users matched the current search and filter settings.'
                    : 'No users available.'}
                </p>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    className="mt-4 inline-flex h-9 items-center rounded-[8px] bg-[#39CDCC] px-4 text-[13px] font-semibold text-white"
                    onClick={handleResetFilters}
                  >
                    Reset filters
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className="mt-5 flex flex-wrap items-center justify-between gap-4 text-[14px] leading-[16px] text-[#545F7D]">
            <div className="flex items-center gap-2">
              <span>Showing</span>
              <button
                type="button"
                className="inline-flex h-[30px] items-center gap-2 rounded-[4px] bg-[#213F7D1A] px-3 font-medium text-[#213F7D]"
              >
                <span>{formattedVisibleUsers}</span>
                <ChevronDown className="size-[14px]" strokeWidth={2.5} />
              </button>
              <span>of {formattedPaginationTotalUsers}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 text-[#545F7D99]">
                <button
                  type="button"
                  className="inline-flex size-6 items-center justify-center rounded-[4px] bg-[#213F7D1A] text-[#213F7D] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                  onClick={handlePreviousPage}
                  disabled={paginationDisabled || currentPage === 1}
                >
                  <ChevronDown className="size-[14px] rotate-90" strokeWidth={2.5} />
                </button>
                {paginationTokens.map((token, tokenIndex) =>
                  token === '...' ? (
                    <span key={`mobile-ellipsis-${tokenIndex}`}>...</span>
                  ) : (
                    <button
                      key={`mobile-page-${token}`}
                      type="button"
                      className={token === currentPage ? 'font-medium text-[#213F7D]' : ''}
                      onClick={() => setCurrentPage(token)}
                      disabled={paginationDisabled}
                    >
                      {token}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  className="inline-flex size-6 items-center justify-center rounded-[4px] bg-[#213F7D1A] text-[#213F7D] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                  onClick={handleNextPage}
                  disabled={paginationDisabled || currentPage === totalPages}
                >
                  <ChevronDown className="size-[14px] -rotate-90" strokeWidth={2.5} />
                </button>
              </div>
              {hasActiveFilters ? (
                <button
                  type="button"
                  className="inline-flex h-[30px] items-center rounded-[8px] border border-[#39CDCC66] px-3 text-[12px] font-semibold text-[#39CDCC]"
                  onClick={handleResetFilters}
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          </section>

          <button
            type="button"
            className="mt-8 inline-flex h-[42px] items-center gap-2 rounded-[6px] border border-[#213F7D33] px-4 text-[14px] font-medium text-[#213F7D]"
            onClick={logout}
          >
            <LogOut className="size-[16px]" strokeWidth={2} />
            <span>Logout</span>
          </button>
        </main>
      </div>
    </div>
  );
}
