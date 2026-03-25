export function ShameLeaderboardSkeleton() {
  return (
    <div className="flex flex-col border border-border-primary">
      <div className="flex h-10 items-center gap-4 border-b border-border-primary bg-bg-surface px-5 sm:gap-6">
        <span className="w-10 font-mono text-[12px] font-medium text-text-tertiary">#</span>
        <span className="w-[60px] font-mono text-[12px] font-medium text-text-tertiary">score</span>
        <span className="flex-1 font-mono text-[12px] font-medium text-text-tertiary">code</span>
        <span className="hidden w-[100px] font-mono text-[12px] font-medium text-text-tertiary sm:block">
          lang
        </span>
      </div>
      {[1, 2, 3].map(i => (
        <article
          key={i}
          className="flex flex-col border-b border-border-primary overflow-hidden last:border-b-0"
        >
          <div className="flex h-12 items-center gap-4 px-5 sm:gap-6">
            <div className="w-10 flex items-center">
              <span className="font-mono text-[12px] font-medium text-text-tertiary">
                <span className="inline-block w-4 h-4 animate-pulse bg-text-tertiary/20 rounded" />
              </span>
            </div>
            <div className="w-[60px] flex items-center">
              <span className="font-mono text-[12px] font-bold text-accent-red">
                <span className="inline-block w-8 h-4 animate-pulse bg-text-tertiary/20 rounded" />
              </span>
            </div>
            <div className="flex-1 min-w-0 h-12 bg-bg-input">
              <span className="inline-block w-full h-4 animate-pulse bg-text-tertiary/10 rounded mb-2 mt-3" />
              <span className="inline-block w-3/4 h-4 animate-pulse bg-text-tertiary/10 rounded" />
            </div>
            <div className="hidden w-[100px] items-center sm:flex">
              <span className="font-mono text-xs text-text-secondary">
                <span className="inline-block w-16 h-4 animate-pulse bg-text-tertiary/20 rounded" />
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
