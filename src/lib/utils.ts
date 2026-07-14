// Simple className utility (lightweight clsx + tailwind-merge alternative)
export type ClassValue = string | number | null | undefined | false | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []
  
  for (const input of inputs) {
    if (!input) continue
    
    if (Array.isArray(input)) {
      const nested = cn(...input)
      if (nested) classes.push(nested)
    } else if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input))
    }
  }
  
  // Simple tailwind-merge: remove duplicate utility classes
  // For MVP, just join them - Tailwind handles specificity
  return [...new Set(classes.join(' ').split(/\s+/).filter(Boolean))].join(' ')
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
