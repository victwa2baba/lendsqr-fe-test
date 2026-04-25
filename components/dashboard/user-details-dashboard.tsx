'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star } from 'lucide-react';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { LoadingSpinner } from '@/components/dashboard/loading-spinner';
import { DASHBOARD_USERS_API_ENDPOINT } from '@/lib/constants/dashboard';
import type { UserDetails } from '@/lib/types/dashboard';
import { findUserRecordById, mapApiUserRecordToDetails } from '@/utils/dashboard/users';

type UserDetailsDashboardProps = {
  userId: string;
};

type DetailSection = {
  title: string;
  fields: Array<{
    label: string;
    value: string;
  }>;
};

const DETAILS_TABS = [
  'General Details',
  'Documents',
  'Bank Details',
  'Loans',
  'Savings',
  'App and System',
] as const;

function UserTierStars({ tier }: { tier: number }) {
  return (
    <div className="mt-3 flex items-center gap-1 text-[#E9B200]">
      {Array.from({ length: 3 }, (_, starIndex) => {
        const isFilled = starIndex < tier;
        return (
          <Star
            key={`tier-star-${starIndex}`}
            className="size-4"
            fill={isFilled ? '#E9B200' : 'transparent'}
            strokeWidth={1.8}
          />
        );
      })}
    </div>
  );
}

function DetailsSectionBlock({
  sections,
}: {
  sections: DetailSection[];
}) {
  return (
    <div className="rounded-[4px] border border-[#213F7D0F] bg-white px-5 py-6 shadow-[3px_5px_20px_0px_rgba(0,0,0,0.04)] sm:px-[30px] sm:py-[30px]">
      {sections.map((section, sectionIndex) => (
        <section
          key={section.title}
          className={sectionIndex < sections.length - 1 ? 'mb-8 border-b border-[#213F7D1A] pb-[30px]' : ''}
        >
          <h2 className="text-[16px] font-medium leading-[19px] text-[#213F7D]">{section.title}</h2>

          <div className="mt-[30px] grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 xl:grid-cols-5">
            {section.fields.map((field) => (
              <div key={`${section.title}-${field.label}`}>
                <p className="text-[12px] uppercase leading-[14px] tracking-[0.6px] text-[#545F7D]">
                  {field.label}
                </p>
                <p className="mt-2 break-words text-[16px] font-medium leading-[19px] text-[#545F7D]">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function UserDetailsDashboard({ userId }: UserDetailsDashboardProps) {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const decodedUserId = decodeURIComponent(userId);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchUserDetails = async () => {
      setIsLoadingUser(true);
      setLoadError(null);

      try {
        const response = await fetch(DASHBOARD_USERS_API_ENDPOINT, {
          cache: 'no-store',
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch users (${response.status})`);
        }

        const payload = (await response.json()) as unknown;
        const matchedUserRecord = findUserRecordById(payload, decodedUserId);

        if (!matchedUserRecord) {
          throw new Error('The requested user could not be found.');
        }

        setUserDetails(mapApiUserRecordToDetails(matchedUserRecord));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setLoadError('Unable to load user details.');
        setUserDetails(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    void fetchUserDetails();

    return () => {
      abortController.abort();
    };
  }, [decodedUserId]);

  const detailsSections = useMemo<DetailSection[]>(() => {
    if (!userDetails) {
      return [];
    }

    return [
      {
        title: 'Personal Information',
        fields: [
          { label: 'Full Name', value: userDetails.fullName },
          { label: 'Phone Number', value: userDetails.phoneNumber },
          { label: 'Email Address', value: userDetails.email },
          { label: 'BVN', value: userDetails.bvn },
          { label: 'Gender', value: userDetails.gender },
          { label: 'Marital Status', value: userDetails.maritalStatus },
          { label: 'Children', value: userDetails.children },
          { label: 'Type of Residence', value: userDetails.typeOfResidence },
        ],
      },
      {
        title: 'Education and Employment',
        fields: [
          { label: 'Level of Education', value: userDetails.educationLevel },
          { label: 'Employment Status', value: userDetails.employmentStatus },
          { label: 'Sector of Employment', value: userDetails.sector },
          { label: 'Duration of Employment', value: userDetails.employmentDuration },
          { label: 'Office Email', value: userDetails.officeEmail },
          { label: 'Monthly Income', value: userDetails.monthlyIncome },
          { label: 'Loan Repayment', value: userDetails.loanRepayment },
        ],
      },
      {
        title: 'Socials',
        fields: [
          { label: 'Twitter', value: userDetails.twitter },
          { label: 'Facebook', value: userDetails.facebook },
          { label: 'Instagram', value: userDetails.instagram },
        ],
      },
      {
        title: 'Guarantor',
        fields: [
          { label: 'Full Name', value: userDetails.guarantorFullName },
          { label: 'Phone Number', value: userDetails.guarantorPhoneNumber },
          { label: 'Email Address', value: userDetails.guarantorEmail },
          { label: 'Relationship', value: userDetails.guarantorRelationship },
        ],
      },
    ];
  }, [userDetails]);

  const safeAvatarSrc = useMemo(() => {
    const avatarUrl = userDetails?.avatarSrc?.trim() ?? '';

    if (avatarUrl.startsWith('/')) {
      return avatarUrl;
    }

    if (avatarUrl.startsWith('https://i.pravatar.cc/')) {
      return avatarUrl;
    }

    return '/images/dashboard/avatar.png';
  }, [userDetails?.avatarSrc]);

  return (
    <DashboardShell
      searchPlaceholder="Search users"
      desktopMainClassName="min-w-0 px-6 pb-10 pt-10 xl:px-[60px] xl:pb-[40px] xl:pt-[60px]"
      mobileMainClassName="px-4 pb-8 pt-6 sm:px-6"
      desktopContent={
        <>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-[10px] text-[16px] leading-[19px] text-[#545F7D]"
          >
            <ArrowLeft className="size-4" strokeWidth={2.2} />
            <span>Back to Users</span>
          </Link>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-[24px] font-medium leading-[28px] text-[#213F7D]">
              User Details
            </h1>

            <div className="flex items-center gap-5">
              <button
                type="button"
                className="h-10 rounded-[8px] border border-[#E4033B] px-4 text-[14px] font-semibold uppercase tracking-[0.7px] text-[#E4033B]"
              >
                Blacklist User
              </button>
              <button
                type="button"
                className="h-10 rounded-[8px] border border-[#39CDCC] px-4 text-[14px] font-semibold uppercase tracking-[0.7px] text-[#39CDCC]"
              >
                Activate User
              </button>
            </div>
          </div>

          {isLoadingUser ? (
            <div className="mt-10">
              <LoadingSpinner label="Loading user details..." />
            </div>
          ) : null}

          {!isLoadingUser && loadError ? (
            <div className="mt-10 rounded-[4px] border border-[#E4033B29] bg-white px-5 py-4 text-[14px] text-[#E4033B]">
              <p>{loadError}</p>
            </div>
          ) : null}

          {!isLoadingUser && !loadError && userDetails ? (
            <>
              <section className="mt-10 overflow-hidden rounded-[4px] border border-[#213F7D0F] bg-white shadow-[3px_5px_20px_0px_rgba(0,0,0,0.04)]">
                <div className="flex flex-wrap items-center gap-8 px-5 py-6 sm:px-[30px]">
                  <div className="flex items-center gap-5">
                    <Image
                      src={safeAvatarSrc}
                      alt={userDetails.fullName}
                      width={100}
                      height={100}
                      className="size-[72px] rounded-full object-cover sm:size-[100px]"
                    />
                    <div>
                      <p className="text-[22px] font-medium leading-[26px] text-[#213F7D]">
                        {userDetails.fullName}
                      </p>
                      <p className="mt-2 text-[14px] leading-[16px] text-[#545F7D]">
                        {userDetails.username}
                      </p>
                    </div>
                  </div>

                  <div className="hidden h-20 w-px bg-[#545F7D1A] xl:block" />

                  <div>
                    <p className="text-[14px] leading-[16px] text-[#545F7D]">User&apos;s Tier</p>
                    <UserTierStars tier={userDetails.userTier} />
                  </div>

                  <div className="hidden h-20 w-px bg-[#545F7D1A] xl:block" />

                  <div>
                    <p className="text-[22px] font-medium leading-[26px] text-[#213F7D]">
                      {userDetails.accountBalance}
                    </p>
                    <p className="mt-2 text-[12px] leading-[14px] text-[#213F7D]">
                      {userDetails.accountNumber}/{userDetails.bankName}
                    </p>
                  </div>
                </div>

                <div className="no-scrollbar overflow-x-auto border-t border-[#213F7D0F]">
                  <div className="min-w-[800px] px-5 sm:px-[30px]">
                    <div className="grid grid-cols-6 gap-4">
                      {DETAILS_TABS.map((tabLabel, tabIndex) => (
                        <p
                          key={tabLabel}
                          className={[
                            'pb-3 pt-4 text-center text-[16px] leading-[19px]',
                            tabIndex === 0
                              ? 'border-b-2 border-[#39CDCC] text-[#39CDCC]'
                              : 'text-[#000000CC]',
                          ].join(' ')}
                        >
                          {tabLabel}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-[30px] max-w-[1037px]">
                <DetailsSectionBlock sections={detailsSections} />
              </section>
            </>
          ) : null}
        </>
      }
      mobileContent={
        <>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[14px] leading-[16px] text-[#545F7D]"
          >
            <ArrowLeft className="size-4" strokeWidth={2.2} />
            <span>Back to Users</span>
          </Link>

          <h1 className="mt-4 text-[24px] font-medium leading-[28px] text-[#213F7D]">
            User Details
          </h1>

          {isLoadingUser ? (
            <div className="mt-6">
              <LoadingSpinner label="Loading user details..." />
            </div>
          ) : null}

          {!isLoadingUser && loadError ? (
            <div className="mt-6 rounded-[6px] border border-[#E4033B29] bg-white px-4 py-4 text-[14px] text-[#E4033B]">
              <p>{loadError}</p>
            </div>
          ) : null}

          {!isLoadingUser && !loadError && userDetails ? (
            <>
              <section className="mt-6 rounded-[6px] border border-[#213F7D0F] bg-white px-4 py-5 shadow-[3px_5px_20px_0px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-4">
                  <Image
                    src={safeAvatarSrc}
                    alt={userDetails.fullName}
                    width={72}
                    height={72}
                    className="size-[72px] rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[20px] font-medium leading-[24px] text-[#213F7D]">
                      {userDetails.fullName}
                    </p>
                    <p className="mt-1 text-[13px] leading-[16px] text-[#545F7D]">
                      {userDetails.username}
                    </p>
                    <UserTierStars tier={userDetails.userTier} />
                  </div>
                </div>

                <div className="mt-5 border-t border-[#213F7D0F] pt-4">
                  <p className="text-[20px] font-medium leading-[24px] text-[#213F7D]">
                    {userDetails.accountBalance}
                  </p>
                  <p className="mt-1 text-[12px] leading-[14px] text-[#213F7D]">
                    {userDetails.accountNumber}/{userDetails.bankName}
                  </p>
                </div>
              </section>

              <section className="mt-6">
                <DetailsSectionBlock sections={detailsSections} />
              </section>
            </>
          ) : null}
        </>
      }
    />
  );
}
