import { cn } from '@/lib/cn'
import { type HTMLAttributes, forwardRef } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

const cardStyles = tv({
  base: ['flex w-full max-w-[480px] flex-col gap-3 border border-border-primary p-5'],
  variants: {
    variant: {
      critical: 'border-l-4 border-l-accent-red',
      warning: 'border-l-4 border-l-accent-amber',
      good: 'border-l-4 border-l-accent-yellow',
      needs_serious_help: 'border-l-4 border-l-accent-red',
    },
  },
})

export type CardProps = VariantProps<typeof cardStyles> &
  HTMLAttributes<HTMLDivElement> & {
    variant?: 'critical' | 'warning' | 'good' | 'needs_serious_help'
  }

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardStyles({ variant }), className)} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p ref={ref} className={cn('font-mono text-[13px] text-text-primary', className)} {...props}>
        {children}
      </p>
    )
  }
)

CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('font-sans text-[12px] leading-6 text-text-secondary', className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)

CardDescription.displayName = 'CardDescription'

export { Card, CardHeader, CardTitle, CardDescription }
