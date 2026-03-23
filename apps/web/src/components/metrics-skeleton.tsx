export function MetricsSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
      <span className="font-sans text-xs text-text-tertiary sm:text-sm">
        <span className="inline-block w-12 h-3 animate-pulse bg-text-tertiary/20 rounded" />
        {' codes roasted'}
      </span>
      <span className="hidden text-text-tertiary sm:block">·</span>
      <span className="font-sans text-xs text-text-tertiary sm:text-sm">
        {'avg score: '}
        <span className="inline-block w-8 h-3 animate-pulse bg-text-tertiary/20 rounded" />
        /10
      </span>
    </div>
  )
}
