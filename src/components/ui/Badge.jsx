import { cn } from '../../lib/utils'

export default function Badge({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider',
        className
      )}
    >
      {children}
    </span>
  )
}
