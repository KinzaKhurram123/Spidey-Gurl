import { useState } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, Sparkle, Box, Archive, Link2, Copy, Check } from 'lucide-react'
import IconChip from '../../components/ui/IconChip'
import { cn } from '../../lib/utils'
import GatewayTab from './GatewayTab'
import GrandEntranceTab from './GrandEntranceTab'
import CharacterStageTab from './CharacterStageTab'
import RepositoriesTab from './RepositoriesTab'

const tabs = [
  { key: 'gateway', label: 'Gateway', icon: KeyRound, Comp: GatewayTab },
  { key: 'entrance', label: 'Grand Entrance', icon: Sparkle, Comp: GrandEntranceTab },
  { key: 'stage', label: '3D Character Stage', icon: Box, Comp: CharacterStageTab },
  { key: 'repos', label: 'Repositories', icon: Archive, Comp: RepositoriesTab },
]

function ShareLinkCard() {
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}/reveal/birthday`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <Link2 size={16} className="shrink-0 text-cyan" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wide text-white/35">Shareable Link</p>
        <p className="truncate text-sm text-white/70">{link}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10"
      >
        {copied ? <Check size={13} className="text-cyan" /> : <Copy size={13} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

export default function BirthdaySuite() {
  const [active, setActive] = useState('gateway')
  const ActiveComp = tabs.find((t) => t.key === active)?.Comp

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <IconChip icon={Sparkle} tone="crimson" size={48} />
        <div>
          <h1 className="font-heading text-3xl text-white">Birthday Suite</h1>
          <p className="mt-1 text-sm text-white/45">Craft every layer of her birthday surprise.</p>
        </div>
      </div>

      <ShareLinkCard />

      <div className="flex flex-wrap gap-2 border-b border-white/8 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              'relative flex items-center gap-2 rounded-t-2xl px-4 py-2.5 text-sm font-medium transition-colors',
              active === tab.key ? 'text-white' : 'text-white/40 hover:text-white/70'
            )}
          >
            <tab.icon size={15} />
            {tab.label}
            {active === tab.key && (
              <motion.span
                layoutId="birthday-tab-underline"
                className="absolute inset-x-2 -bottom-[5px] h-[3px] rounded-full"
                style={{ backgroundImage: 'linear-gradient(90deg, var(--accent-a), var(--accent-b))' }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {ActiveComp && <ActiveComp />}
      </motion.div>
    </div>
  )
}
