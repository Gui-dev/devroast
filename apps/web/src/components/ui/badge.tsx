import { cn } from '@/lib/cn'
import { type HTMLAttributes, forwardRef } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

const badgeStyles = tv({
  base: ['inline-flex items-center gap-2 font-mono'],
  variants: {
    variant: {
      critical: 'text-accent-red',
      warning: 'text-accent-amber',
      good: 'text-accent-yellow',
      needs_serious_help: 'text-accent-red text-[13px]',
    },
  },
  defaultVariants: {
    variant: 'critical',
  },
})

export type BadgeProps = VariantProps<typeof badgeStyles> & HTMLAttributes<HTMLSpanElement>

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(badgeStyles({ variant, className }))} {...props}>
        <span
          className={cn(
            'size-2 rounded-full',
            variant === 'critical' && 'bg-accent-red',
            variant === 'warning' && 'bg-accent-amber',
            variant === 'good' && 'bg-accent-yellow',
            variant === 'needs_serious_help' && 'bg-accent-red'
          )}
        />
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeStyles }
