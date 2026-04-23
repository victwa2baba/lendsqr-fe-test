'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type NavProps = {
  className?: string;
};

const MENU_ANIMATION_MS = 200;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();

  const isActivePath = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const openMenu = useCallback(() => {
    setIsMenuVisible(true);
    requestAnimationFrame(() => setIsMenuOpen(true));
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!isMenuVisible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [closeMenu, isMenuVisible]);

  useEffect(() => {
    if (!isMenuOpen) return;
    requestAnimationFrame(() => closeButtonRef.current?.focus());
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuVisible) return;
    if (isMenuOpen) return;

    const timeoutId = window.setTimeout(() => {
      setIsMenuVisible(false);
    }, MENU_ANIMATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isMenuOpen, isMenuVisible]);

  return (
    <header className={cn('w-full bg-white', className)} data-node-id="45:443">
      <div className="mx-auto flex h-[97px] w-full max-w-[1400px] items-center justify-between px-5 py-4 lg:px-[180px]">
        <Link
          href="/"
          className="relative hidden  md:flex h-[65px] w-[166px] shrink-0 items-start overflow-hidden bg-white p-[1.652px]"
          aria-label="Dorasal Technical Services Ltd"
        >
          <Image
            alt="dorasal logo"
            className="size-full max-w-none hidden md:block"
            src="/images/dts-logo.svg"
            width={166}
            height={65}
          />
        </Link>
        <Link
          href="/"
          className="relative flex h-[50px] w-[127px] shrink-0 items-start overflow-hidden md:hidden bg-white p-[1.652px]"
          aria-label="Dorasal Technical Services Ltd"
        >
          <Image
            alt="dorasal logo"
            className="size-full max-w-none  md:hidden"
            src="/images/dts-logo.svg"
            width={127}
            height={50}
          />
        </Link>

        <nav className="hidden shrink-0 items-center gap-10 text-[16px] font-medium leading-none text-black md:flex">
          <Link
            href="/about"
            className={cn(
              'relative rounded-[8px] px-2 py-1 hover:opacity-80',
              "after:absolute after:bottom-[-10px] after:left-2 after:right-2 after:h-[2px] after:rounded-full after:transition-colors after:content-['']",
              isActivePath('/about')
                ? 'after:bg-[#4294E4]'
                : 'after:bg-transparent',
            )}
          >
            About
          </Link>
          <Link
            href="/services"
            className={cn(
              'relative rounded-[8px] px-2 py-1 hover:opacity-80',
              "after:absolute after:bottom-[-10px] after:left-2 after:right-2 after:h-[2px] after:rounded-full after:transition-colors after:content-['']",
              isActivePath('/services')
                ? 'after:bg-[#4294E4]'
                : 'after:bg-transparent',
            )}
          >
            Services &amp; Equipment
          </Link>
        </nav>

        <Link
          href="/contact"
          className="hidden shrink-0 rounded-[8px] border-[0.5px] border-[#BDDEFF] bg-[#004A95] px-5 py-4 text-[16px] font-medium leading-none text-white hover:brightness-110 md:inline-flex"
        >
          Book a Quote
        </Link>

        <Button
          type="button"
          className=" hover:bg-black/5 md:hidden"
          aria-label="Open menu"
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          onClick={openMenu}
          variant={'ghost'}
        >
          <Image
            alt="menu icon"
            src="/images/menu-icon.svg"
            width={16}
            height={16}
          />
        </Button>
      </div>

      {isMenuVisible ? (
        <div
          id="mobile-menu"
          className={cn(
            'fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 ease-out md:hidden',
            isMenuOpen ? 'opacity-100' : 'opacity-0',
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
        >
          <div
            className={cn(
              'ml-auto flex h-[321px] w-full flex-col bg-[#004A95] pb-6 transition-transform duration-200 ease-out will-change-transform',
              isMenuOpen ? 'translate-y-0' : '-translate-y-full',
            )}
            data-node-id="94:1011"
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
          >
            <div
              className="w-full border border-[#F3F3F3] bg-white p-4"
              data-node-id="94:1012"
            >
              <div className="flex w-full items-center justify-between">
                <Link
                  href="/"
                  className="relative flex h-[50px] w-[128px] shrink-0 items-start overflow-hidden bg-white"
                  aria-label="Dorasal Technical Services Ltd"
                  onClick={closeMenu}
                  data-node-id="94:1031"
                >
                  <Image
                    alt="dorasal logo"
                    className="block size-full max-w-none"
                    src="/images/dts-logo.svg"
                    width={127}
                    height={50}
                  />
                </Link>

                <Button
                  ref={closeButtonRef}
                  type="button"
                  className="inline-flex items-center justify-center rounded-[8px] p-2 text-[#004A95] hover:bg-black/5"
                  aria-label="Close menu"
                  onClick={closeMenu}
                  variant={'ghost'}
                >
                  <Image
                    src="/images/close-x.svg"
                    alt="close button"
                    width={16}
                    height={16}
                  />
                </Button>
              </div>
            </div>

            <div
              className="flex w-full flex-col gap-10 px-0 pt-6"
              data-node-id="94:1017"
            >
              <div
                className="flex w-full px-4 flex-col gap-4"
                data-node-id="94:1018"
              >
                <Link
                  href="/about"
                  className={cn(
                    'px-4 text-[16px] font-medium leading-none',
                    isActivePath('/about')
                      ? 'bg-[#E6F2FF] py-3 text-[#1E1F21]'
                      : 'py-2 text-white',
                  )}
                  onClick={closeMenu}
                  data-node-id="94:1019"
                >
                  About
                </Link>
                <span className="bg-[#E6F2FF] h-[1px]"></span>
                <Link
                  href="/services"
                  className={cn(
                    'px-4 text-[16px] font-medium leading-none',
                    isActivePath('/services')
                      ? 'bg-[#E6F2FF] py-3 text-[#1E1F21]'
                      : 'py-2 text-white',
                  )}
                  onClick={closeMenu}
                  data-node-id="94:1021"
                >
                  Services &amp; Equipment
                </Link>
              </div>

              <div className="px-4" data-node-id="98:1926">
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center rounded-[8px] border-[0.5px] border-[#78BBFF] bg-[#E6F2FF] px-5 py-4 text-[16px] font-medium leading-none text-[#1E1F21] hover:brightness-105"
                  onClick={closeMenu}
                >
                  Book a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
