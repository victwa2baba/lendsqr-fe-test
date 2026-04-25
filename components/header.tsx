'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import Image from 'next/image';
import { Bell, ChevronDown, Search } from 'lucide-react';

const SEARCH_DEBOUNCE_DELAY_MS = 400;

type HeaderProps = {
  avatarSrc: string;
  userName: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  showDocsLink?: boolean;
};

export function Header({
  avatarSrc,
  userName,
  onSearch,
  searchPlaceholder = 'Search for anything',
  showDocsLink = true,
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const hasInitializedSearch = useRef(false);
  const lastDispatchedQuery = useRef<string | null>(null);

  const dispatchSearch = useCallback(
    (rawQuery: string) => {
      if (!onSearch) {
        return;
      }

      const query = rawQuery.trim();

      if (query === lastDispatchedQuery.current) {
        return;
      }

      lastDispatchedQuery.current = query;
      onSearch(query);
    },
    [onSearch],
  );

  useEffect(() => {
    if (!onSearch) {
      return;
    }

    if (!hasInitializedSearch.current) {
      hasInitializedSearch.current = true;
      return;
    }

    const debounceTimer = setTimeout(() => {
      dispatchSearch(searchValue);
    }, SEARCH_DEBOUNCE_DELAY_MS);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [dispatchSearch, onSearch, searchValue]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    dispatchSearch(searchValue);
  };

  const handleSearchInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <header className="col-span-2 sticky top-0 z-30 flex h-[100px] items-center justify-between border-b border-[#213F7D0F] bg-white px-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.04)] lg:px-6 xl:px-[30px]">
      <div className="flex min-w-0 flex-1 items-center gap-6 xl:gap-[168px]">
        <Image
          src="/images/login/lendsqr-logo.svg"
          alt="Lendsqr"
          width={144}
          height={30}
          className="h-[30px] w-[144px] shrink-0"
          priority
        />

        <form
          className="hidden h-[40px] min-w-0 max-w-[400px] flex-1 overflow-hidden rounded-[8px] border border-[#213F7D33] md:flex"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="search"
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder={searchPlaceholder}
            className="h-full flex-1 bg-white px-5 text-[14px] leading-[16px] text-[#213F7D] placeholder:text-[#545F7DB2] focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex w-[56px] items-center justify-center bg-[#39CDCC] text-white"
            aria-label="Search"
          >
            <Search className="size-[14px]" strokeWidth={2.5} />
          </button>
        </form>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-4 text-[#213F7D] lg:gap-6 xl:gap-[33px]">
        {showDocsLink ? (
          <button
            type="button"
            className="hidden text-[16px] underline underline-offset-2 xl:block"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            Docs
          </button>
        ) : null}

        <button
          type="button"
          className="inline-flex items-center justify-center text-[#213F7D]"
          aria-label="Notifications"
        >
          <Bell className="size-[26px]" strokeWidth={1.8} />
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-[10px]"
          aria-label="User menu"
        >
          <Image
            src={avatarSrc}
            alt={userName}
            width={48}
            height={48}
            className="size-10 rounded-full object-cover xl:size-12"
            priority
          />
          <span className="hidden text-[16px] font-medium text-[#213F7D] xl:inline">
            {userName}
          </span>
          <ChevronDown className="size-4 text-[#213F7D]" strokeWidth={2.4} />
        </button>
      </div>
    </header>
  );
}

type MobileHeaderProps = {
  avatarSrc: string;
  userName: string;
};

export function MobileHeader({
  avatarSrc,
  userName,
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#213F7D14] bg-white px-5">
      <Image
        src="/images/login/lendsqr-logo.svg"
        alt="Lendsqr"
        width={110}
        height={23}
        className="h-[23px] w-[110px]"
        priority
      />
      <button type="button" className="inline-flex items-center gap-2">
        <Image
          src={avatarSrc}
          alt={userName}
          width={36}
          height={36}
          className="size-9 rounded-full object-cover"
          priority
        />
        <ChevronDown className="size-4 text-[#213F7D]" strokeWidth={2.5} />
      </button>
    </header>
  );
}
