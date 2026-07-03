export function cn(...args) {
  return args.filter(Boolean).join(' ')
}

export function daysBetween(dateA, dateB = new Date()) {
  const a = new Date(dateA)
  const b = new Date(dateB)
  const ms = b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0)
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const priorityColors = {
  high: { text: 'text-crimson', bg: 'bg-crimson/15', border: 'border-crimson/40', dot: 'bg-crimson' },
  medium: { text: 'text-gold', bg: 'bg-gold/15', border: 'border-gold/40', dot: 'bg-gold' },
  low: { text: 'text-cyan', bg: 'bg-cyan/15', border: 'border-cyan/40', dot: 'bg-cyan' },
}

export const occasionIconKey = {
  birthday: 'Cake',
  anniversary: 'Heart',
  apology: 'Flower2',
  proposal: 'Gem',
  custom: 'Sparkles',
}
