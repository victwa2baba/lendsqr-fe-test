type LoadingSpinnerProps = {
  label: string;
};

export function LoadingSpinner({ label }: LoadingSpinnerProps) {
  return (
    <div className="flex h-[220px] items-center justify-center">
      <div className="flex items-center gap-3 text-[#545F7D]" role="status" aria-live="polite">
        <span
          aria-hidden="true"
          className="inline-flex size-5 animate-spin rounded-full border-2 border-[#39CDCC] border-t-transparent"
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
