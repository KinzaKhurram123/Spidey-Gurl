import { useEffect, useState } from 'react'
import { isFirebaseConfigured, subscribeSurprise } from '../../lib/firebase'

export function useSurpriseData(key) {
  const [data, setData] = useState(undefined)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setData(null)
      return
    }
    const unsub = subscribeSurprise(key, setData, (err) => {
      console.error(`subscribeSurprise(${key}) error:`, err)
    })
    return unsub
  }, [key])

  return data
}

export default function RevealShell({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute animate-float-slow rounded-full opacity-20 blur-sm"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 57) % 100}%`,
              width: 6 + (i % 4) * 4,
              height: 6 + (i % 4) * 4,
              backgroundImage: i % 2 ? 'linear-gradient(135deg, #ff3d68, #ffb020)' : 'linear-gradient(135deg, #22d3ee, #ff3d68)',
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex w-full flex-col items-center">{children}</div>
    </div>
  )
}

export function RevealLoading() {
  return <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-crimson" />
}

export function RevealNotConfigured() {
  return (
    <p className="max-w-sm text-center text-white/60">This surprise isn't set up yet. Cloud sync isn't configured.</p>
  )
}

export function RevealNotReady() {
  return <p className="max-w-sm text-center text-white/60">Something special is on its way... check back soon.</p>
}
