'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

import { SIDEBAR_META_ICONS } from '@/lib/constants/dashboard';
import type { DashboardNavItem, DashboardNavSection } from '@/lib/types/dashboard';

type SidebarProps = {
  sections: DashboardNavSection[];
};

function SidebarItem({ item }: { item: DashboardNavItem }) {
  return (
    <button
      type="button"
      className={[
        'flex h-[40px] w-full items-center gap-[10px] px-[30px] text-left',
        item.active
          ? 'border-l-[3px] border-[#39CDCC] bg-[#39CDCC0F] text-[#213F7D]'
          : 'border-l-[3px] border-transparent text-[#7A8CB1]',
      ].join(' ')}
    >
      <Image
        src={item.iconSrc}
        alt=""
        width={16}
        height={16}
        aria-hidden
        className="size-4 shrink-0"
      />
      <span className="text-[16px] font-normal leading-[19px]">{item.label}</span>
    </button>
  );
}

export function Sidebar({ sections }: SidebarProps) {
  return (
    <aside className="no-scrollbar min-h-0 overflow-y-auto border-r border-[#213F7D0F] bg-white pb-8 pt-[39px] shadow-[0px_5px_20px_0px_rgba(0,0,0,0.04)]">
      <div className="px-[30px]">
        <button
          type="button"
          className="flex h-[40px] items-center gap-[10px] text-[16px] text-[#545F7D]"
        >
          <Image
            src={SIDEBAR_META_ICONS.switchOrganization}
            alt=""
            width={16}
            height={16}
            aria-hidden
            className="size-4"
          />
          <span>Switch Organization</span>
          <ChevronDown className="size-4" strokeWidth={2} />
        </button>
      </div>

      <button
        type="button"
        className="mt-6 flex h-[40px] w-full items-center gap-[10px] px-[30px] text-left text-[16px] text-[#7A8CB1]"
      >
        <Image
          src={SIDEBAR_META_ICONS.dashboard}
          alt=""
          width={16}
          height={16}
          aria-hidden
          className="size-4"
        />
        <span>Dashboard</span>
      </button>

      <div className="mt-[30px] space-y-[20px]">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-[30px] text-[12px] font-medium uppercase leading-[14px] tracking-[0.6px] text-[#545F7D99]">
              {section.title}
            </p>
            <div className="mt-[10px]">
              {section.items.map((item) => (
                <SidebarItem key={`${section.title}-${item.label}`} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
