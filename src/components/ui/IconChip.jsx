import { cn } from '../../lib/utils'

const tones = {
  crimson: 'bg-crimson/15 text-crimson border-crimson/30',
  gold: 'bg-gold/15 text-gold border-gold/30',
  cyan: 'bg-cyan/15 text-cyan border-cyan/30',
  neutral: 'bg-white/10 text-white/70 border-white/15',
}

export default function IconChip({ icon: Icon, tone = 'crimson', size = 40, className, style, ...rest }) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full border shrink-0',
        tone && tones[tone],
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      <Icon size={size * 0.5} strokeWidth={2} />
    </div>
  )
}
