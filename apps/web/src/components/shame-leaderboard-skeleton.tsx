export function ShameLeaderboardSkeleton() {
  return (
    <div className="flex flex-col border border-border-primary">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="flex flex-wrap items-center gap-2 border-b border-border-primary px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:gap-6 md:px-5"
        >
          <span className="w-6 font-mono text-[11px] text-text-tertiary sm:w-10 sm:text-[13px]">
            #{i}
          </span>
          <span className="w-10 font-mono text-[11px] font-bold text-accent-red sm:w-[60px] sm:text-[13px]">
            <span className="inline-block w-8 h-3 animate-pulse bg-text-tertiary/20 rounded" />
          </span>
          <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-text-secondary sm:text-[12px]">
            <span className="inline-block w-32 h-3 animate-pulse bg-text-tertiary/20 rounded" />
          </span>
          <span className="hidden w-[100px] font-mono text-[11px] text-text-tertiary sm:block sm:text-[12px] md:text-[13px]">
            <span className="inline-block w-16 h-3 animate-pulse bg-text-tertiary/20 rounded" />
          </span>
        </div>
      ))}
    </div>
  )
}
