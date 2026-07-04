import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Sparkle, Heart, Flower2, Box, BookHeart, Mail, ScrollText, ArrowRight } from 'lucide-react'
import { isFirebaseConfigured, subscribeSurprise } from '../../lib/firebase'
import { formatDate } from '../../lib/utils'

export default function BirthdayReveal() {
  const [data, setData] = useState(undefined)
  const [step, setStep] = useState('gateway')
  const [passInput, setPassInput] = useState('')
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setData(null)
      return
    }
    const unsub = subscribeSurprise('birthday', setData, (err) => {
      console.error('subscribeSurprise error:', err)
    })
    return unsub
  }, [])

  if (!isFirebaseConfigured) {
    return (
      <RevealShell>
        <p className="max-w-sm text-center text-white/60">
          Ye surprise abhi ready nahi hai. Cloud sync configure nahi hui.
        </p>
      </RevealShell>
    )
  }

  if (data === undefined) {
    return (
      <RevealShell>
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-crimson" />
      </RevealShell>
    )
  }

  if (data === null) {
    return (
      <RevealShell>
        <Sparkle className="mb-4 text-gold" size={32} />
        <p className="max-w-sm text-center text-white/60">Kuch special taiyar ho raha hai... thodi der baad wapas aana.</p>
      </RevealShell>
    )
  }

  const handleUnlock = (e) => {
    e.preventDefault()
    if (passInput.trim().toLowerCase() === (data.gateway?.passphrase || '').trim().toLowerCase()) {
      setStep('entrance')
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <RevealShell>
      <AnimatePresence mode="wait">
        {step === 'gateway' && (
          <motion.div
            key="gateway"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass w-full max-w-sm rounded-xl2 p-8 text-center"
          >
            <div
              className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full"
              style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-a), var(--accent-b))' }}
            >
              <Lock size={26} className="text-white" />
            </div>
            <h1 className="font-heading text-2xl text-white">A Surprise Awaits</h1>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/35">Enter the passphrase to continue</p>
            <motion.form
              onSubmit={handleUnlock}
              animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.45 }}
              className="mt-8 space-y-4"
            >
              <input
                autoFocus
                type="text"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                placeholder="Passphrase"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-center text-sm tracking-widest text-white placeholder-white/30 outline-none focus:border-crimson/50"
              />
              <button
                type="submit"
                className="w-full rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-lg"
                style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-a), var(--accent-b))' }}
              >
                Unlock
              </button>
            </motion.form>
          </motion.div>
        )}

        {step === 'entrance' && (
          <EntranceStep key="entrance" entrance={data.entrance} onNext={() => setStep('stage')} />
        )}

        {step === 'stage' && (
          <StageStep key="stage" glbUrl={data.characterStage?.glbUrl} onNext={() => setStep('vault')} />
        )}

        {step === 'vault' && <VaultStep key="vault" repositories={data.repositories} />}
      </AnimatePresence>
    </RevealShell>
  )
}

function RevealShell({ children }) {
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

function EntranceStep({ entrance, onNext }) {
  const theme = entrance?.theme || ''
  const wishText = entrance?.wishText || ''
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="glass relative w-full max-w-lg overflow-hidden rounded-xl2 p-10 text-center"
    >
      {entrance?.floatingHearts &&
        [...Array(6)].map((_, i) => (
          <Heart
            key={`h-${i}`}
            size={16 + (i % 3) * 6}
            className="absolute text-crimson/50 animate-float-slow"
            style={{ left: `${10 + i * 15}%`, top: `${15 + (i % 3) * 20}%`, animationDelay: `${i * 0.4}s` }}
          />
        ))}
      {entrance?.floatingPetals &&
        [...Array(6)].map((_, i) => (
          <Flower2
            key={`p-${i}`}
            size={14 + (i % 3) * 5}
            className="absolute text-gold/50 animate-float-slow"
            style={{ right: `${8 + i * 14}%`, top: `${12 + (i % 4) * 18}%`, animationDelay: `${i * 0.3 + 0.2}s` }}
          />
        ))}
      <p className="relative z-10 text-xs uppercase tracking-[0.3em] text-gold/70">{theme || 'A Little Surprise'}</p>
      <p className="relative z-10 mt-6 font-heading text-3xl leading-snug text-white">{wishText}</p>
      <button
        onClick={onNext}
        className="relative z-10 mt-10 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
        style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-a), var(--accent-b))' }}
      >
        Keep Going <ArrowRight size={16} />
      </button>
    </motion.div>
  )
}

function StageStep({ glbUrl, onNext }) {
  if (!glbUrl) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-a), var(--accent-b))' }}
        >
          Continue <ArrowRight size={16} />
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="glass w-full max-w-lg rounded-xl2 p-6 text-center"
    >
      <h2 className="mb-4 flex items-center justify-center gap-2 font-heading text-lg text-white">
        <Box size={18} className="text-cyan" /> A Little Companion
      </h2>
      <div className="h-72 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <model-viewer
          src={glbUrl}
          camera-controls="true"
          auto-rotate="true"
          shadow-intensity="1"
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        />
      </div>
      <button
        onClick={onNext}
        className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
        style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-a), var(--accent-b))' }}
      >
        Continue <ArrowRight size={16} />
      </button>
    </motion.div>
  )
}

function VaultStep({ repositories }) {
  const [active, setActive] = useState('memoryVault')
  const memoryVault = repositories?.memoryVault || []
  const messageJar = repositories?.messageJar || []
  const secretLetters = repositories?.secretLetters || []

  const tabs = [
    { key: 'memoryVault', label: 'Memory Vault', icon: BookHeart },
    { key: 'messageJar', label: 'Message Jar', icon: Mail },
    { key: 'secretLetters', label: 'Secret Letters', icon: ScrollText },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass w-full max-w-xl rounded-xl2 p-6"
    >
      <h2 className="mb-4 text-center font-heading text-lg text-white">One More Thing...</h2>
      <div className="mb-5 flex justify-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={cnTab(active === t.key)}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {active === 'memoryVault' && (
        <div className="max-h-80 space-y-3 overflow-y-auto">
          {memoryVault.length === 0 && <EmptyNote text="No memories added yet." />}
          {memoryVault.map((m) => (
            <div key={m.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              {m.title && <p className="font-medium text-white">{m.title}</p>}
              {m.description && <p className="mt-1 text-sm text-white/60">{m.description}</p>}
              {m.date && <p className="mt-2 text-xs text-white/30">{formatDate(m.date)}</p>}
            </div>
          ))}
        </div>
      )}

      {active === 'messageJar' && <MessageJar messages={messageJar} />}

      {active === 'secretLetters' && (
        <div className="max-h-80 space-y-3 overflow-y-auto">
          {secretLetters.length === 0 && <EmptyNote text="No letters yet." />}
          {secretLetters.map((l) => (
            <SecretLetter key={l.id} letter={l} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

function MessageJar({ messages }) {
  const [picked, setPicked] = useState(null)
  if (messages.length === 0) return <EmptyNote text="The jar is empty for now." />
  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <AnimatePresence mode="wait">
        {picked ? (
          <motion.p
            key={picked.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-sm text-center font-heading text-lg text-white"
          >
            {picked.message}
          </motion.p>
        ) : (
          <p className="text-sm text-white/40">Pull a little note out of the jar.</p>
        )}
      </AnimatePresence>
      <button
        onClick={() => setPicked(messages[Math.floor(Math.random() * messages.length)])}
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
        style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-a), var(--accent-b))' }}
      >
        <Mail size={15} /> Pull a Note
      </button>
    </div>
  )
}

function SecretLetter({ letter }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="w-full rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-left"
    >
      <p className="font-medium text-white">{letter.title || 'A Secret Letter'}</p>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 overflow-hidden text-sm text-white/60"
          >
            {letter.content}
          </motion.p>
        )}
      </AnimatePresence>
      {!open && <p className="mt-1 text-xs text-white/30">Tap to open</p>}
    </button>
  )
}

function EmptyNote({ text }) {
  return <p className="py-6 text-center text-sm text-white/35">{text}</p>
}

function cnTab(active) {
  return `flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
    active ? 'border-white/25 bg-white/10 text-white' : 'border-white/10 text-white/45'
  }`
}
