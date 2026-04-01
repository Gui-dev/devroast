import { cn } from '@/lib/cn'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

const buttonStyles = tv({
  base: [
    'inline-flex items-center justify-center font-mono font-medium transition-colors cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  variants: {
    variant: {
      default: 'bg-accent-yellow text-[#1a2e1c] hover:bg-accent-yellow/90',
      secondary:
        'border border-border-primary bg-transparent text-text-primary hover:bg-border-primary/50',
      link: 'border border-border-primary bg-transparent text-text-secondary hover:text-text-primary',
    },
    size: {
      default: 'px-6 py-[10px] text-[13px]',
      sm: 'px-4 py-2 text-[12px]',
      lg: 'px-8 py-3 text-sm',
      icon: 'size-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export type ButtonProps = VariantProps<typeof buttonStyles> &
  ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonStyles({ variant, size, className }))} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonStyles }
