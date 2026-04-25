import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, MoreVertical, UserCheck, UserX } from 'lucide-react';

import {
  EMPTY_USER_TABLE_FILTERS,
  TABLE_COLUMN_TEMPLATE,
  TABLE_HEADERS,
} from '@/lib/constants/dashboard';
import type { UserRow, UserStatus, UserTableFilters } from '@/lib/types/dashboard';
import { getStatusPalette } from '@/utils/dashboard/users';

type DesktopUsersTableProps = {
  rows: UserRow[];
  filters: UserTableFilters;
  hasActiveFilters: boolean;
  organizationOptions: string[];
  onApplyFilters: (filters: UserTableFilters) => void;
  onResetFilters: () => void;
  onUpdateUserStatus: (email: string, status: UserStatus) => void;
};

const STATUS_FILTER_OPTIONS: UserStatus[] = [
  'Inactive',
  'Pending',
  'Blacklisted',
  'Active',
];

const FILTER_PANEL_LEFT_OFFSET = 30;
const FILTER_PANEL_TOP_OFFSET = 82;

export function DesktopUsersTable({
  rows,
  filters,
  hasActiveFilters,
  organizationOptions,
  onApplyFilters,
  onResetFilters,
  onUpdateUserStatus,
}: DesktopUsersTableProps) {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [activeActionMenuEmail, setActiveActionMenuEmail] = useState<string | null>(null);
  const [filterDraft, setFilterDraft] = useState<UserTableFilters>(filters);

  useEffect(() => {
    setFilterDraft(filters);
  }, [filters]);

  useEffect(() => {
    setActiveActionMenuEmail(null);
  }, [rows]);

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (!target) {
        return;
      }

      if (!target.closest('[data-users-table-actions]')) {
        setActiveActionMenuEmail(null);
      }
    };

    const handleEscapeKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setActiveActionMenuEmail(null);
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    document.addEventListener('keydown', handleEscapeKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
      document.removeEventListener('keydown', handleEscapeKeyDown);
    };
  }, []);

  const handleFilterInputChange = (field: keyof UserTableFilters, value: string) => {
    setFilterDraft((previousFilters) => ({
      ...previousFilters,
      [field]: value,
    }));
  };

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApplyFilters(filterDraft);
    setIsFilterPanelOpen(false);
  };

  const handleFilterReset = () => {
    setFilterDraft(EMPTY_USER_TABLE_FILTERS);
    onResetFilters();
  };

  const handleFilterToggle = () => {
    setIsFilterPanelOpen((previousState) => !previousState);
  };

  return (
    <div className="relative rounded-[4px] border border-[#213F7D0F] bg-white shadow-[3px_5px_20px_0px_rgba(0,0,0,0.04)]">
      {isFilterPanelOpen ? (
        <div
          data-users-table-filter
          className="absolute z-30 w-[270px] rounded-[4px] border border-[#545F7D24] bg-white px-5 py-[30px] shadow-[3px_5px_20px_0px_rgba(0,0,0,0.06)]"
          style={{
            left: `${FILTER_PANEL_LEFT_OFFSET}px`,
            top: `${FILTER_PANEL_TOP_OFFSET}px`,
          }}
        >
          <form className="space-y-5" onSubmit={handleFilterSubmit}>
            <label className="block space-y-[6px]">
              <span className="text-[14px] font-medium leading-[16px] text-[#545F7D]">
                Organization
              </span>
              <select
                value={filterDraft.organization}
                onChange={(event) =>
                  handleFilterInputChange('organization', event.target.value)
                }
                className="h-10 w-full rounded-[8px] border border-[#213F7D33] bg-white px-3 text-[14px] text-[#545F7D] focus:border-[#39CDCC] focus:outline-none"
              >
                <option value="">Select</option>
                {organizationOptions.map((organizationOption) => (
                  <option key={organizationOption} value={organizationOption}>
                    {organizationOption}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-[6px]">
              <span className="text-[14px] font-medium leading-[16px] text-[#545F7D]">
                Username
              </span>
              <input
                type="text"
                value={filterDraft.username}
                onChange={(event) => handleFilterInputChange('username', event.target.value)}
                placeholder="User"
                className="h-10 w-full rounded-[8px] border border-[#213F7D33] px-3 text-[14px] text-[#545F7D] placeholder:text-[#545F7D99] focus:border-[#39CDCC] focus:outline-none"
              />
            </label>

            <label className="block space-y-[6px]">
              <span className="text-[14px] font-medium leading-[16px] text-[#545F7D]">
                Email
              </span>
              <input
                type="email"
                value={filterDraft.email}
                onChange={(event) => handleFilterInputChange('email', event.target.value)}
                placeholder="Email"
                className="h-10 w-full rounded-[8px] border border-[#213F7D33] px-3 text-[14px] text-[#545F7D] placeholder:text-[#545F7D99] focus:border-[#39CDCC] focus:outline-none"
              />
            </label>

            <label className="block space-y-[6px]">
              <span className="text-[14px] font-medium leading-[16px] text-[#545F7D]">
                Date
              </span>
              <input
                type="date"
                value={filterDraft.dateJoined}
                onChange={(event) =>
                  handleFilterInputChange('dateJoined', event.target.value)
                }
                className="h-10 w-full rounded-[8px] border border-[#213F7D33] px-3 text-[14px] text-[#545F7D] focus:border-[#39CDCC] focus:outline-none"
              />
            </label>

            <label className="block space-y-[6px]">
              <span className="text-[14px] font-medium leading-[16px] text-[#545F7D]">
                Phone Number
              </span>
              <input
                type="text"
                value={filterDraft.phoneNumber}
                onChange={(event) =>
                  handleFilterInputChange('phoneNumber', event.target.value)
                }
                placeholder="Phone Number"
                className="h-10 w-full rounded-[8px] border border-[#213F7D33] px-3 text-[14px] text-[#545F7D] placeholder:text-[#545F7D99] focus:border-[#39CDCC] focus:outline-none"
              />
            </label>

            <label className="block space-y-[6px]">
              <span className="text-[14px] font-medium leading-[16px] text-[#545F7D]">
                Status
              </span>
              <select
                value={filterDraft.status}
                onChange={(event) => handleFilterInputChange('status', event.target.value)}
                className="h-10 w-full rounded-[8px] border border-[#213F7D33] bg-white px-3 text-[14px] text-[#545F7D] focus:border-[#39CDCC] focus:outline-none"
              >
                <option value="">Select</option>
                {STATUS_FILTER_OPTIONS.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center gap-[14px] pt-[10px]">
              <button
                type="button"
                className="h-10 w-full rounded-[8px] border border-[#545F7D] text-[14px] font-semibold leading-[16px] text-[#545F7D]"
                onClick={handleFilterReset}
              >
                Reset
              </button>
              <button
                type="submit"
                className="h-10 w-full rounded-[8px] bg-[#39CDCC] text-[14px] font-semibold leading-[16px] text-white"
              >
                Filter
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="no-scrollbar overflow-x-auto">
        <div className="min-w-[1037px]">
          <div className="relative px-[30px] pt-[30px]">
            <div
              className="grid h-[30px] items-center gap-x-[35px]"
              style={{ gridTemplateColumns: TABLE_COLUMN_TEMPLATE }}
            >
              {TABLE_HEADERS.map((header) => (
                <div key={header || 'actions'} className="flex items-center gap-1">
                  {header ? (
                    <>
                      <span className="text-[12px] font-semibold uppercase leading-[14px] tracking-[0.6px] text-[#545F7D]">
                        {header}
                      </span>
                      <button
                        type="button"
                        data-users-table-filter
                        className="inline-flex items-center justify-center"
                        aria-label="Open users filter"
                        aria-pressed={hasActiveFilters}
                        onClick={handleFilterToggle}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 3.33325H14V4.66659H2V3.33325ZM4 7.33325H12V8.66659H4V7.33325ZM6.66667 11.3333H9.33333V12.6666H6.66667V11.3333Z"
                            fill="#000000"
                          />
                        </svg>
                      </button>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-[31px] px-[30px]">
            {rows.map((row, index) => {
              const palette = getStatusPalette(row.status);
              const isActionMenuOpen = activeActionMenuEmail === row.email;
              const shouldOpenActionsUpward = index >= rows.length - 2;
              const actionMenuPositionClass = shouldOpenActionsUpward
                ? 'bottom-full mb-2'
                : 'top-full mt-2';

              return (
                <div
                  key={row.email}
                  className={[
                    'grid h-[62px] items-center gap-x-[35px]',
                    index === rows.length - 1 ? '' : 'border-b border-[#213F7D1A]',
                  ].join(' ')}
                  style={{ gridTemplateColumns: TABLE_COLUMN_TEMPLATE }}
                >
                  <span className="truncate text-[14px] leading-[16px] text-[#545F7D]">
                    {row.organization}
                  </span>
                  <span className="truncate text-[14px] leading-[16px] text-[#545F7D]">
                    {row.username}
                  </span>
                  <span className="truncate text-[14px] leading-[16px] text-[#545F7D]">
                    {row.email}
                  </span>
                  <span className="truncate text-[14px] leading-[16px] text-[#545F7D]">
                    {row.phoneNumber}
                  </span>
                  <span className="truncate text-[14px] leading-[16px] text-[#545F7D]">
                    {row.dateJoined}
                  </span>
                  <span
                    className="inline-flex h-[30px] items-center justify-center rounded-[100px] px-3 text-[14px] leading-[16px]"
                    style={{
                      backgroundColor: palette.background,
                      color: palette.color,
                    }}
                  >
                    {row.status}
                  </span>

                  <div className="relative z-40" data-users-table-actions>
                    <button
                      type="button"
                      className="inline-flex size-5 items-center justify-center text-[#545F7D]"
                      aria-label={`Open actions for ${row.username}`}
                      onClick={() =>
                        setActiveActionMenuEmail((previousEmail) =>
                          previousEmail === row.email ? null : row.email,
                        )
                      }
                    >
                      <MoreVertical className="size-4" strokeWidth={2} />
                    </button>

                    {isActionMenuOpen ? (
                      <div
                        className={[
                          'absolute right-0 z-50 w-[180px] rounded-[4px] border border-[#545F7D0A] bg-white py-3 shadow-[3px_5px_20px_0px_rgba(0,0,0,0.08)]',
                          actionMenuPositionClass,
                        ].join(' ')}
                      >
                        <Link
                          href={`/dashboard/users/${encodeURIComponent(row.id)}`}
                          className="flex w-full items-center gap-2 px-5 py-2 text-left text-[14px] leading-[16px] text-[#545F7D] hover:bg-[#39CDCC0D]"
                          onClick={() => setActiveActionMenuEmail(null)}
                        >
                          <Eye className="size-4" strokeWidth={2} />
                          <span>View Details</span>
                        </Link>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-5 py-2 text-left text-[14px] leading-[16px] text-[#545F7D] hover:bg-[#39CDCC0D]"
                          onClick={() => {
                            onUpdateUserStatus(row.email, 'Blacklisted');
                            setActiveActionMenuEmail(null);
                          }}
                        >
                          <UserX className="size-4" strokeWidth={2} />
                          <span>Blacklist User</span>
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-5 py-2 text-left text-[14px] leading-[16px] text-[#545F7D] hover:bg-[#39CDCC0D]"
                          onClick={() => {
                            onUpdateUserStatus(row.email, 'Active');
                            setActiveActionMenuEmail(null);
                          }}
                        >
                          <UserCheck className="size-4" strokeWidth={2} />
                          <span>Activate User</span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
