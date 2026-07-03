import { cn } from '../../lib/utils'

export function Label({ children }) {
  return <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/45">{children}</label>
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-crimson/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(255,61,104,0.12)]',
        className
      )}
      {...props}
    />
  )
}

export function Textarea({ className, rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-crimson/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(255,61,104,0.12)]',
        className
      )}
      {...props}
    />
  )
}

export function Field({ label, children }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      {children}
    </div>
  )
}
