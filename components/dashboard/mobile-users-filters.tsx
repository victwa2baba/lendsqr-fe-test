'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';

import { EMPTY_USER_TABLE_FILTERS } from '@/lib/constants/dashboard';
import type { UserStatus, UserTableFilters } from '@/lib/types/dashboard';

type MobileUsersFiltersProps = {
  filters: UserTableFilters;
  hasActiveFilters: boolean;
  organizationOptions: string[];
  onApplyFilters: (filters: UserTableFilters) => void;
  onResetFilters: () => void;
};

const STATUS_FILTER_OPTIONS: UserStatus[] = [
  'Inactive',
  'Pending',
  'Blacklisted',
  'Active',
];

export function MobileUsersFilters({
  filters,
  hasActiveFilters,
  organizationOptions,
  onApplyFilters,
  onResetFilters,
}: MobileUsersFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterDraft, setFilterDraft] = useState<UserTableFilters>(filters);

  useEffect(() => {
    setFilterDraft(filters);
  }, [filters]);

  const handleFilterInputChange = (field: keyof UserTableFilters, value: string) => {
    setFilterDraft((previousFilters) => ({
      ...previousFilters,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApplyFilters(filterDraft);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilterDraft(EMPTY_USER_TABLE_FILTERS);
    onResetFilters();
    setIsOpen(false);
  };

  return (
    <section className="mt-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[#39CDCC66] bg-white px-4 text-[13px] font-semibold text-[#39CDCC]"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((previousState) => !previousState)}
        >
          <Filter className="size-4" strokeWidth={2} />
          <span>{isOpen ? 'Hide Filters' : 'Show Filters'}</span>
        </button>

        {hasActiveFilters ? (
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-[8px] border border-[#545F7D66] bg-white px-4 text-[13px] font-semibold text-[#545F7D]"
            onClick={handleReset}
          >
            Clear Filters
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <div className="mt-4 rounded-[8px] border border-[#213F7D14] bg-white px-4 py-5 shadow-[3px_5px_20px_0px_rgba(0,0,0,0.04)]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-[6px]">
              <span className="text-[13px] font-medium leading-[16px] text-[#545F7D]">
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
              <span className="text-[13px] font-medium leading-[16px] text-[#545F7D]">
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
              <span className="text-[13px] font-medium leading-[16px] text-[#545F7D]">
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
              <span className="text-[13px] font-medium leading-[16px] text-[#545F7D]">
                Date Joined
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
              <span className="text-[13px] font-medium leading-[16px] text-[#545F7D]">
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
              <span className="text-[13px] font-medium leading-[16px] text-[#545F7D]">
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

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                className="h-10 w-full rounded-[8px] border border-[#545F7D] text-[14px] font-semibold text-[#545F7D]"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                type="submit"
                className="h-10 w-full rounded-[8px] bg-[#39CDCC] text-[14px] font-semibold text-white"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
