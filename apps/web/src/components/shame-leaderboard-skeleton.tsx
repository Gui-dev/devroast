export function ShameLeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {[1, 2, 3].map(i => (
        <article key={i} className="flex flex-col border border-border-primary overflow-hidden">
          <div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[13px] text-text-tertiary">#</span>
                <span className="font-mono text-[13px] font-bold text-accent-amber">
                  <span className="inline-block w-4 h-4 animate-pulse bg-text-tertiary/20 rounded" />
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-text-tertiary">score:</span>
                <span className="font-mono text-[13px] font-bold text-accent-red">
                  <span className="inline-block w-8 h-4 animate-pulse bg-text-tertiary/20 rounded" />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-text-secondary">
                <span className="inline-block w-16 h-4 animate-pulse bg-text-tertiary/20 rounded" />
              </span>
              <span className="font-mono text-xs text-text-tertiary">
                <span className="inline-block w-12 h-4 animate-pulse bg-text-tertiary/20 rounded" />
              </span>
            </div>
          </div>
          <div className="h-32 bg-bg-input p-3">
            <span className="inline-block w-full h-4 animate-pulse bg-text-tertiary/10 rounded mb-2" />
            <span className="inline-block w-3/4 h-4 animate-pulse bg-text-tertiary/10 rounded mb-2" />
            <span className="inline-block w-1/2 h-4 animate-pulse bg-text-tertiary/10 rounded" />
          </div>
        </article>
      ))}
      <p className="font-mono text-xs text-text-tertiary text-center">
        <span className="inline-block w-48 h-3 animate-pulse bg-text-tertiary/20 rounded" />
      </p>
    </div>
  )
}
