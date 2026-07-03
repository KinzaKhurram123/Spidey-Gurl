import { useState } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, Sparkle, Box, Archive } from 'lucide-react'
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
