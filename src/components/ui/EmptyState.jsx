import IconChip from './IconChip'

export default function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <IconChip icon={icon} tone="neutral" size={52} />
      <p className="font-heading text-lg text-white/80">{title}</p>
      {subtitle && <p className="max-w-sm text-sm text-white/40">{subtitle}</p>}
    </div>
  )
}
