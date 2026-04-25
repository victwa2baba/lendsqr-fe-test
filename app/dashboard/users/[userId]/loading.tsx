import { LoadingSpinner } from '@/components/dashboard/loading-spinner';

export default function UserDetailsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBFBFB] px-4">
      <LoadingSpinner label="Loading user details..." />
    </div>
  );
}
