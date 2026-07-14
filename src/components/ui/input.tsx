import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-md border border-ink-200 bg-white/90 px-4 py-2 text-sm text-ink-800',
          'placeholder:text-ink-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:border-gold-400',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200',
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
