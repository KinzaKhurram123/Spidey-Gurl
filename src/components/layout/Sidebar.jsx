import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Cake,
  Flower2,
  Heart,
  Gem,
  Sparkles,
  Settings,
  LogOut,
  Plus,
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'
import toast from 'react-hot-toast'

const mainLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/birthday', label: 'Birthday Suite', icon: Cake },
  { to: '/sorry', label: 'Sorry Toolkit', icon: Flower2 },
  { to: '/anniversary', label: 'Anniversary Suite', icon: Heart },
  { to: '/proposal', label: 'Proposal Stage', icon: Gem },
]

export default function Sidebar({ onOpenSettings }) {
  const occasions = useStore((s) => s.occasions)
  const addOccasion = useStore((s) => s.addOccasion)
  const logout = useStore((s) => s.logout)
  const navigate = useNavigate()

  const handleAddOccasion = () => {
    const name = window.prompt('Name this custom occasion:')
    if (!name) return
    const colors = ['#ff3d68', '#ffb020', '#22d3ee', '#a855f7']
    const accentColor = colors[Math.floor(Math.random() * colors.length)]
    const id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
    addOccasion({ id, name, accentColor, content: '' })
    toast.success(`"${name}" occasion created`)
    navigate(`/occasion/${id}`)
  }

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-white/5 bg-black/20 px-4 py-6">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg font-bold text-white"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-a), var(--accent-b))' }}
        >
          SG
        </div>
        <div>
          <p className="font-heading text-base leading-tight text-white">Spidey Gurl</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">Zone Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-white/30">Occasions</p>
        {mainLinks.map((link, i) => (
          <NavItem key={link.to} link={link} index={i} />
        ))}

        {occasions.length > 0 && (
          <p className="px-3 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-widest text-white/30">
            Custom Occasions
          </p>
        )}
        {occasions.map((occ, i) => (
          <NavItem
            key={occ.id}
            link={{ to: `/occasion/${occ.id}`, label: occ.name, icon: Sparkles }}
            index={i}
            accent={occ.accentColor}
          />
        ))}

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAddOccasion}
          className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-dashed border-white/15 px-3 py-3 text-sm text-white/50 transition-colors hover:border-white/30 hover:text-white/80"
        >
          <Plus size={18} />
          New Occasion
        </motion.button>
      </nav>

      <div className="mt-4 space-y-1 border-t border-white/5 pt-4">
        <button
          onClick={onOpenSettings}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Settings size={18} />
          Settings
        </button>
        <button
          onClick={() => {
            logout()
            toast('Signed out', { icon: '🔒' })
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-white/60 transition-colors hover:bg-crimson/10 hover:text-crimson"
        >
          <LogOut size={18} />
          Lock Panel
        </button>
      </div>
    </aside>
  )
}

function NavItem({ link, index, accent }) {
  const Icon = link.icon
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <NavLink
        to={link.to}
        end={link.end}
        className={({ isActive }) =>
          cn(
            'group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200',
            isActive ? 'text-white' : 'text-white/55 hover:bg-white/5 hover:text-white/90'
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.span
                layoutId="active-nav-pill"
                className="absolute inset-0 rounded-2xl"
                style={{
                  backgroundImage: accent
                    ? `linear-gradient(135deg, ${accent}33, ${accent}0d)`
                    : 'linear-gradient(135deg, color-mix(in srgb, var(--accent-a) 22%, transparent), color-mix(in srgb, var(--accent-b) 8%, transparent))',
                  border: `1px solid ${accent ? accent + '55' : 'color-mix(in srgb, var(--accent-a) 35%, transparent)'}`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <Icon size={18} className="relative z-10" style={accent && isActive ? { color: accent } : undefined} />
            <span className="relative z-10 truncate">{link.label}</span>
          </>
        )}
      </NavLink>
    </motion.div>
  )
}
