import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  alternates: { canonical: '/404' },
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-16 text-center text-[#1e1f21]">
      <div className="max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#6b6b6b]">
          404
        </p>
        <h1 className="mt-3 font-bold">Page not found</h1>
        <p className="mt-4 text-base text-[#4a4a4a]">
          The page you are looking for doesn&apos;t exist or may have moved.
        </p>
      </div>
    </main>
  );
}
