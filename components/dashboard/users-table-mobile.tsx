import { useEffect, useState } from 'react';
import { Eye, MoreVertical, UserCheck, UserX } from 'lucide-react';

import { TABLE_HEADERS } from '@/lib/constants/dashboard';
import type { UserRow, UserStatus } from '@/lib/types/dashboard';
import { getStatusPalette } from '@/utils/dashboard/users';

type MobileUsersTableProps = {
  rows: UserRow[];
  onUpdateUserStatus: (email: string, status: UserStatus) => void;
};

export function MobileUsersTable({
  rows,
  onUpdateUserStatus,
}: MobileUsersTableProps) {
  const [activeActionMenuEmail, setActiveActionMenuEmail] = useState<string | null>(null);

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (!target) {
        return;
      }

      if (!target.closest('[data-mobile-users-table-actions]')) {
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
            const isActionMenuOpen = activeActionMenuEmail === row.email;
            return (
              <tr
                key={`mobile-${row.email}`}
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
                  <div className="relative" data-mobile-users-table-actions>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center text-[#545F7D]"
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
                      <div className="absolute right-0 top-7 z-20 w-[170px] rounded-[4px] border border-[#545F7D0A] bg-white py-2 shadow-[3px_5px_20px_0px_rgba(0,0,0,0.08)]">
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] leading-[16px] text-[#545F7D]"
                          onClick={() => setActiveActionMenuEmail(null)}
                        >
                          <Eye className="size-4" strokeWidth={2} />
                          <span>View Details</span>
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] leading-[16px] text-[#545F7D]"
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
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] leading-[16px] text-[#545F7D]"
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
