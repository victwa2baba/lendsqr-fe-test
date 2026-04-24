import { Filter, MoreVertical } from 'lucide-react';

import { TABLE_COLUMN_TEMPLATE, TABLE_HEADERS } from '@/lib/constants/dashboard';
import type { UserRow } from '@/lib/types/dashboard';
import { getStatusPalette } from '@/utils/dashboard/users';

type DesktopUsersTableProps = {
  rows: UserRow[];
};

export function DesktopUsersTable({ rows }: DesktopUsersTableProps) {
  return (
    <div className="no-scrollbar overflow-x-auto rounded-[4px] border border-[#213F7D0F] bg-white shadow-[3px_5px_20px_0px_rgba(0,0,0,0.04)]">
      <div className="min-w-[1037px]">
        <div className="px-[30px] pt-[30px]">
          <div
            className="grid h-[30px] items-center gap-x-[35px]"
            style={{ gridTemplateColumns: TABLE_COLUMN_TEMPLATE }}
          >
            {TABLE_HEADERS.map((header) => (
              <div key={header || 'actions'} className="flex items-center gap-[10px]">
                {header ? (
                  <>
                    <span className="text-[12px] font-semibold uppercase leading-[14px] tracking-[0.6px] text-[#545F7D]">
                      {header}
                    </span>
                    <Filter className="size-[14px] text-[#545F7D]" strokeWidth={2} />
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[31px] px-[30px]">
          {rows.map((row, index) => {
            const palette = getStatusPalette(row.status);
            return (
              <div
                key={`${row.organization}-${row.username}`}
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
                <button
                  type="button"
                  className="inline-flex size-5 items-center justify-center text-[#545F7D]"
                  aria-label={`Open actions for ${row.username}`}
                >
                  <MoreVertical className="size-4" strokeWidth={2} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
