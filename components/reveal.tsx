'use client';

import { useEffect, useRef, useState } from 'react';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'none';
};

export function Reveal({
  children,
  className = '',
  direction = 'none',
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const offsetClass =
    direction === 'left'
      ? '-translate-x-6'
      : direction === 'right'
        ? 'translate-x-6'
        : '';

  const visibilityClass = inView
    ? 'opacity-100 translate-x-0'
    : `opacity-0 ${offsetClass}`;

  return (
    <div
      ref={ref}
      className={`will-change-transform transition-all duration-700 ease-out ${visibilityClass} ${className}`}
    >
      {children}
    </div>
  );
}
