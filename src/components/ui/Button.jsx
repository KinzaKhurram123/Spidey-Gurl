import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const variants = {
  primary: 'text-white',
  ghost: 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10',
  danger: 'bg-crimson/15 text-crimson border border-crimson/40 hover:bg-crimson/25',
  outline: 'bg-transparent border border-white/15 text-white/80 hover:border-white/30 hover:text-white',
}

export default function Button({
  children,
  variant = 'primary',
  className,
  icon: Icon,
  type = 'button',
  ...props
}) {
  const isGradient = variant === 'primary'
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.03 }}
      className={cn(
        'shine-sweep relative inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none',
        isGradient && 'shadow-[0_8px_24px_-8px_rgba(255,61,104,0.6)]',
        variants[variant],
        className
      )}
      style={isGradient ? { backgroundImage: 'linear-gradient(135deg, var(--accent-a), var(--accent-b))' } : undefined}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={2.25} />}
      {children}
    </motion.button>
  )
}
