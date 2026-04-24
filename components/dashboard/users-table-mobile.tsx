import { MoreVertical } from 'lucide-react';

import { TABLE_HEADERS } from '@/lib/constants/dashboard';
import type { UserRow } from '@/lib/types/dashboard';
import { getStatusPalette } from '@/utils/dashboard/users';

type MobileUsersTableProps = {
  rows: UserRow[];
};

export function MobileUsersTable({ rows }: MobileUsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-[8px] border border-[#213F7D0F] bg-white shadow-[3px_5px_20px_0px_rgba(0,0,0,0.04)]">
      <table className="min-w-[960px] border-collapse">
        <thead>
          <tr className="border-b border-[#213F7D1A]">
            {TABLE_HEADERS.map((header) => (
              <th
                key={header || 'actions-mobile'}
                className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-[#545F7D]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const palette = getStatusPalette(row.status);
            return (
              <tr
                key={`mobile-${row.organization}-${row.username}`}
                className="border-b border-[#213F7D1A] text-[13px] text-[#545F7D]"
              >
                <td className="whitespace-nowrap px-4 py-4">{row.organization}</td>
                <td className="whitespace-nowrap px-4 py-4">{row.username}</td>
                <td className="whitespace-nowrap px-4 py-4">{row.email}</td>
                <td className="whitespace-nowrap px-4 py-4">{row.phoneNumber}</td>
                <td className="whitespace-nowrap px-4 py-4">{row.dateJoined}</td>
                <td className="whitespace-nowrap px-4 py-4">
                  <span
                    className="inline-flex h-[28px] items-center justify-center rounded-[100px] px-3"
                    style={{
                      backgroundColor: palette.background,
                      color: palette.color,
                    }}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <MoreVertical className="size-4 text-[#545F7D]" strokeWidth={2} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
