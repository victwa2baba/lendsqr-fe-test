'use client';

import type { LucideIcon } from 'lucide-react';
import { BriefcaseBusiness, ChevronDown, Database, LogOut } from 'lucide-react';

export type NavItem = {
  label: string;
  Icon: LucideIcon;
  active?: boolean;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

type SidebarProps = {
  sections: NavSection[];
  onLogout: () => void;
  version?: string;
};

function SidebarItem({ item }: { item: NavItem }) {
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
      <item.Icon className="size-4 shrink-0" strokeWidth={1.75} />
      <span className="text-[16px] font-normal leading-[19px]">{item.label}</span>
    </button>
  );
}

export function Sidebar({
  sections,
  onLogout,
  version = 'v1.2.0',
}: SidebarProps) {
  return (
    <aside className="no-scrollbar min-h-0 overflow-y-auto border-r border-[#213F7D0F] bg-white pb-8 pt-[39px] shadow-[0px_5px_20px_0px_rgba(0,0,0,0.04)]">
      <div className="px-[30px]">
        <button
          type="button"
          className="flex h-[40px] items-center gap-[10px] text-[16px] text-[#545F7D]"
        >
          <BriefcaseBusiness className="size-4" strokeWidth={1.75} />
          <span>Switch Organization</span>
          <ChevronDown className="size-4" strokeWidth={2} />
        </button>
      </div>

      <button
        type="button"
        className="mt-6 flex h-[40px] w-full items-center gap-[10px] px-[30px] text-left text-[16px] text-[#7A8CB1]"
      >
        <Database className="size-4" strokeWidth={1.75} />
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

      <div className="mt-[30px] border-t border-[#213F7D1A] pt-5">
        <button
          type="button"
          className="flex h-[40px] w-full items-center gap-[10px] px-[30px] text-left text-[16px] text-[#545F7D]"
          onClick={onLogout}
        >
          <LogOut className="size-4" strokeWidth={1.9} />
          <span>Logout</span>
        </button>

        <p className="px-[30px] pt-[14px] text-[12px] leading-[14px] text-[#213F7D99]">
          {version}
        </p>
      </div>
    </aside>
  );
}
