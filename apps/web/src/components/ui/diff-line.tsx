import { cn } from '@/lib/cn'
import { type HTMLAttributes, forwardRef } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

const diffLineStyles = tv({
  base: ['flex items-center gap-2 px-4 py-2 font-mono text-[13px] font-normal'],
  variants: {
    variant: {
      removed: 'bg-diff-removed',
      added: 'bg-diff-added',
      context: 'bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'context',
  },
})

export type DiffLineProps = VariantProps<typeof diffLineStyles> & HTMLAttributes<HTMLDivElement>

const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(diffLineStyles({ variant, className }))} {...props}>
        <span
          className={cn(
            'w-4 text-center',
            variant === 'removed' && 'text-accent-red',
            variant === 'added' && 'text-accent-yellow',
            variant === 'context' && 'text-text-tertiary'
          )}
        >
          {variant === 'removed' ? '-' : variant === 'added' ? '+' : ' '}
        </span>
        <span
          className={cn(
            'flex-1',
            variant === 'removed' && 'text-text-secondary',
            variant === 'added' && 'text-text-primary',
            variant === 'context' && 'text-text-secondary'
          )}
        >
          {children}
        </span>
      </div>
    )
  }
)

DiffLine.displayName = 'DiffLine'

export { DiffLine, diffLineStyles }
