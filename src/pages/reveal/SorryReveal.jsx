import { Flower2, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import RevealShell, { useSurpriseData, RevealLoading, RevealNotConfigured, RevealNotReady } from './RevealShell'
import { isFirebaseConfigured } from '../../lib/firebase'

const forgivenessLabel = (v) => {
  if (v < 25) return 'Still upset'
  if (v < 50) return 'Softening'
  if (v < 75) return 'Almost there'
  return 'All forgiven'
}

export default function SorryReveal() {
  const data = useSurpriseData('sorry')

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

  const flowersCount = data.flowersCount || 0
  const forgivenessSlider = data.forgivenessSlider ?? 50

  return (
    <RevealShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass relative w-full max-w-lg overflow-hidden rounded-xl2 p-10 text-center"
      >
        <div className="pointer-events-none absolute inset-0">
          {[...Array(Math.min(flowersCount, 30))].map((_, i) => (
            <Flower2
              key={i}
              size={12 + (i % 3) * 6}
              className="absolute text-crimson/40 animate-float-slow"
              style={{
                left: `${(i * 13) % 100}%`,
                top: `${(i * 29) % 100}%`,
                animationDelay: `${(i % 6) * 0.3}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <Heart size={40} className="mx-auto text-crimson" fill="currentColor" fillOpacity={0.15} />
          <p className="mt-6 font-heading text-2xl leading-snug text-white">
            {data.apologyText || "I'm sorry."}
          </p>
          <div className="mx-auto mt-8 max-w-xs">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${forgivenessSlider}%`,
                  backgroundImage: 'linear-gradient(90deg, #ff3d68, #ffb020, #22d3ee)',
                }}
              />
            </div>
            <p className="mt-2 font-stat text-xs uppercase tracking-widest text-white/40">
              {flowersCount} flowers &middot; {forgivenessLabel(forgivenessSlider)}
            </p>
          </div>
        </div>
      </motion.div>
    </RevealShell>
  )
}
