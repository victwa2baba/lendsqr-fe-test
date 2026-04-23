'use client';

import { useEffect, useRef, useState } from 'react';

type InViewProps = {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
};

export function InView({
  children,
  className = '',
  threshold = 1,
}: InViewProps) {
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
      { threshold },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      data-inview={inView ? 'true' : 'false'}
      className={className}
    >
      {children}
    </div>
  );
}
