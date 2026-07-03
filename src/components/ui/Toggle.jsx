import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={cn(
          'relative h-7 w-12 rounded-full border transition-colors duration-300',
          checked ? 'border-transparent' : 'border-white/15 bg-white/10'
        )}
        style={checked ? { backgroundImage: 'linear-gradient(135deg, var(--accent-a), var(--accent-b))' } : undefined}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow"
          style={{ left: checked ? 22 : 2 }}
        />
      </span>
      {label && <span className="text-sm text-white/75">{label}</span>}
    </button>
  )
}
