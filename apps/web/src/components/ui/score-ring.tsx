import { cn } from '@/lib/cn'
import { getScoreColor } from '@/lib/get-score-color'
import { type HTMLAttributes, forwardRef } from 'react'

export type ScoreRingProps = HTMLAttributes<HTMLDivElement> & {
  score: number
  maxScore?: number
}

const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, score, maxScore = 10, ...props }, ref) => {
    const size = 180
    const strokeWidth = 4
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const progress = Math.min(Math.max(score / maxScore, 0), 1)
    const strokeDashoffset = circumference * (1 - progress)
    const scoreColor = getScoreColor(score, maxScore)

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className="absolute inset-0 -rotate-90"
          width={size}
          height={size}
          role="img"
          aria-label={`Score: ${score} out of ${maxScore}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1f1f1f"
            strokeWidth={strokeWidth}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="36%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span
            className="font-mono text-[48px] font-bold leading-none text-text-primary"
            style={{ color: scoreColor }}
          >
            {score}
          </span>
          <span className="font-mono text-[16px] leading-none text-text-tertiary">/{maxScore}</span>
        </div>
      </div>
    )
  }
)

ScoreRing.displayName = 'ScoreRing'

export { ScoreRing }
