import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import RevealShell, { useSurpriseData, RevealLoading, RevealNotConfigured, RevealNotReady } from './RevealShell'
import { isFirebaseConfigured } from '../../lib/firebase'
import { daysBetween, formatDate } from '../../lib/utils'

export default function AnniversaryReveal() {
  const data = useSurpriseData('anniversary')

  if (!isFirebaseConfigured) {
    return (
      <RevealShell>
        <RevealNotConfigured />
      </RevealShell>
    )
  }

  if (data === undefined) {
    return (
      <RevealShell>
        <RevealLoading />
      </RevealShell>
    )
  }

  if (data === null) {
    return (
      <RevealShell>
        <Heart className="mb-4 text-crimson" size={32} />
        <RevealNotReady />
      </RevealShell>
    )
  }

  const days = data.startDate ? daysBetween(data.startDate, new Date()) : null

  return (
    <RevealShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-lg rounded-xl2 p-10 text-center"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-gold/70">Together Since</p>
        <p className="mt-2 text-sm text-white/60">{formatDate(data.startDate)}</p>
        <p className="font-stat mt-6 text-6xl font-extrabold text-gradient">
          {days !== null ? days.toLocaleString() : '—'}
        </p>
        <p className="mt-1 text-xs uppercase tracking-widest text-white/40">days together</p>
        <p className="mt-8 max-w-sm mx-auto font-heading text-xl leading-snug text-white/90">
          {data.wishesText || 'Happy anniversary.'}
        </p>
      </motion.div>
    </RevealShell>
  )
}
