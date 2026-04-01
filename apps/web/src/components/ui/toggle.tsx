'use client'

import { cn } from '@/lib/cn'
import { type HTMLAttributes, forwardRef, useState } from 'react'

export type ToggleProps = HTMLAttributes<HTMLButtonElement> & {
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  label?: string
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, defaultPressed = false, onPressedChange, label, ...props }, ref) => {
    const [pressed, setPressed] = useState(defaultPressed)

    const handleClick = () => {
      const newPressed = !pressed
      setPressed(newPressed)
      onPressedChange?.(newPressed)
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn('inline-flex items-center gap-3 cursor-pointer', className)}
        {...props}
      >
        <div
          className={cn(
            'relative h-5.5 w-10 rounded-full p-1',
            pressed ? 'bg-accent-yellow' : 'bg-border-primary'
          )}
        >
          <div
            className={cn(
              'h-4 w-4 rounded-full transition-all duration-200',
              pressed ? 'translate-x-[18px] bg-[#0A0A0A]' : 'bg-[#6B7280]'
            )}
          />
        </div>
        {label && (
          <span
            className={cn(
              'font-mono text-[12px]',
              pressed ? 'text-accent-yellow' : 'text-text-secondary'
            )}
          >
            {label}
          </span>
        )}
      </button>
    )
  }
)

Toggle.displayName = 'Toggle'

export { Toggle }
