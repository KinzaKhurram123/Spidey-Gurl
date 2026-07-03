import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function GlassCard({ children, className, hover = true, as: Comp = motion.div, ...props }) {
  return (
    <Comp
      className={cn(
        'glass rounded-xl2 p-6 relative',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(255,61,104,0.35)] hover:border-white/20',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
