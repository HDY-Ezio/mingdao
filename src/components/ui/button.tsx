import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'ink' | 'gold' | 'navy' | 'cinnabar' | 'outline' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none'

    const variants: Record<ButtonVariant, string> = {
      default: 'bg-ink-900 text-ink-50 hover:bg-ink-800 shadow-ink-sm',
      ink: 'bg-ink-900 text-white hover:bg-ink-800 shadow-ink-sm hover:shadow-ink hover:-translate-y-0.5',
      gold: 'bg-gradient-to-br from-gold-500 to-gold-600 text-white hover:from-gold-400 hover:to-gold-500 shadow-[0_4px_20px_rgba(184,148,47,0.15)] hover:shadow-[0_6px_24px_rgba(184,148,47,0.25)] hover:-translate-y-0.5 border border-gold-500/20',
      navy: 'bg-gradient-to-br from-navy-600 to-navy-800 text-white hover:from-navy-500 hover:to-navy-700 shadow-navy hover:shadow-navy-lg hover:-translate-y-0.5 border border-navy-500/30',
      cinnabar: 'bg-gradient-to-br from-cinnabar-500 to-cinnabar-700 text-white hover:from-cinnabar-400 hover:to-cinnabar-600 shadow-[0_4px_20px_rgba(224,79,61,0.2)] hover:shadow-[0_6px_24px_rgba(224,79,61,0.35)] hover:-translate-y-0.5 border border-cinnabar-500/30',
      outline: 'border border-ink-300 bg-transparent text-ink-800 hover:bg-ink-50 hover:border-ink-400',
      ghost: 'hover:bg-ink-100 text-ink-800',
      link: 'text-navy-600 underline-offset-4 hover:underline p-0',
    }

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-sm',
      lg: 'h-14 px-8 text-base',
      icon: 'h-10 w-10',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
