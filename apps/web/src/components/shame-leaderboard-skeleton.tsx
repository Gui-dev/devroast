export function ShameLeaderboardSkeleton() {
  return (
    <div className="flex flex-col border border-border-primary">
      <div className="flex h-10 items-center gap-4 bg-bg-surface px-5 py-0 sm:gap-6 md:gap-6">
        <span className="w-6 font-mono text-[12px] font-medium text-text-tertiary sm:w-10">#</span>
        <span className="w-[60px] font-mono text-[12px] font-medium text-text-tertiary">score</span>
        <span className="flex-1 font-mono text-[12px] font-medium text-text-tertiary">code</span>
        <span className="hidden w-[100px] font-mono text-[12px] font-medium text-text-tertiary sm:block">
          lang
        </span>
      </div>
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="flex flex-wrap items-center gap-4 border-b border-border-primary px-5 py-4 sm:gap-6 md:gap-6"
        >
          <span className="w-6 font-mono text-[11px] text-text-tertiary sm:w-10 sm:text-[13px]">
            #{i}
          </span>
          <span className="w-10 font-mono text-[11px] font-bold text-accent-red sm:w-[60px] sm:text-[13px]">
            <span className="inline-block w-8 h-3 animate-pulse bg-text-tertiary/20 rounded" />
          </span>
          <span className="min-w-0 flex-1 font-mono text-[11px] text-text-secondary sm:text-[12px]">
            <span className="inline-block w-32 h-3 animate-pulse bg-text-tertiary/20 rounded" />
          </span>
          <span className="hidden w-[100px] font-mono text-[11px] text-text-tertiary sm:block sm:text-[12px] md:text-[13px]">
            <span className="inline-block w-16 h-3 animate-pulse bg-text-tertiary/20 rounded" />
          </span>
        </div>
      ))}
      <p className="py-3 text-center font-sans text-xs text-text-tertiary sm:text-sm">
        <span className="inline-block w-48 h-3 animate-pulse bg-text-tertiary/20 rounded" />
      </p>
    </div>
  )
}
