import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'
import { type HTMLAttributes, forwardRef } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

const cardStyles = tv({
  base: ['flex w-[480px] flex-col gap-3 border border-border-primary p-5'],
})

export type CardProps = VariantProps<typeof cardStyles> &
  HTMLAttributes<HTMLDivElement> & {
    variant?: 'critical' | 'warning' | 'good' | 'needs_serious_help'
    title?: string
    description?: string
  }

const variantLabels: Record<NonNullable<CardProps['variant']>, string> = {
  critical: 'critical',
  warning: 'warning',
  good: 'good',
  needs_serious_help: 'needs_serious_help',
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, title, description, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardStyles({ className }))} {...props}>
        {variant && (
          <div className="flex items-center gap-2">
            <Badge variant={variant}>{variantLabels[variant]}</Badge>
          </div>
        )}
        {title && <p className="font-mono text-[13px] text-text-primary">{title}</p>}
        {description && (
          <p className="font-sans text-[12px] leading-6 text-text-secondary">{description}</p>
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card, cardStyles }
