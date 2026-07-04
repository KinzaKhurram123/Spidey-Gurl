import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Gem, PartyPopper } from 'lucide-react'
import RevealShell, { useSurpriseData, RevealLoading, RevealNotConfigured, RevealNotReady } from './RevealShell'
import { isFirebaseConfigured } from '../../lib/firebase'

export default function ProposalReveal() {
  const data = useSurpriseData('proposal')
  const [accepted, setAccepted] = useState(false)

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
        <Gem className="mb-4 text-gold" size={32} />
        <RevealNotReady />
      </RevealShell>
    )
  }

  return (
    <RevealShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-lg rounded-xl2 p-8"
      >
        <ProposalStageArea data={data} accepted={accepted} setAccepted={setAccepted} />
      </motion.div>
    </RevealShell>
  )
}

function ProposalStageArea({ data, accepted, setAccepted }) {
  const stageRef = useRef(null)
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const [noScale, setNoScale] = useState(1)

  useEffect(() => {
    setNoPos({ x: 0, y: 0 })
    setNoScale(1)
  }, [data.noButtonBehavior])

  const randomPos = () => {
    const bounds = stageRef.current?.getBoundingClientRect()
    const w = bounds ? bounds.width - 100 : 160
    const h = bounds ? bounds.height - 100 : 120
    return { x: Math.random() * w - w / 2, y: Math.random() * h - h / 2 }
  }

  const handleNoInteract = () => {
    if (data.noButtonBehavior === 'shrink') {
      setNoScale((s) => Math.max(0.3, s - 0.15))
    } else if (data.noButtonBehavior === 'teleport' || data.noButtonBehavior === 'dodge-cursor') {
      setNoPos(randomPos())
    }
  }

  return (
    <div
      ref={stageRef}
      className="relative flex h-80 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 text-center"
    >
      {accepted ? (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
          <PartyPopper size={40} className="mx-auto text-gold" />
          <p className="font-heading text-2xl text-white">{data.yesResponseText || 'You made me the happiest person alive!'}</p>
        </motion.div>
      ) : (
        <>
          <p className="mb-8 font-heading text-2xl text-white">{data.question || 'Will you marry me?'}</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setAccepted(true)}
              className="rounded-full px-6 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-a), var(--accent-b))' }}
            >
              Yes
            </button>
            <motion.button
              onMouseEnter={handleNoInteract}
              onClick={handleNoInteract}
              animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70"
            >
              No
            </motion.button>
          </div>
        </>
      )}
    </div>
  )
}
