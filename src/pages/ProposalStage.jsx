import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Gem, PartyPopper } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import IconChip from '../components/ui/IconChip'
import { Field, Input, Textarea } from '../components/ui/Field'
import { useStore } from '../store/useStore'
import { cn } from '../lib/utils'
import toast from 'react-hot-toast'

const behaviors = [
  { key: 'shrink', label: 'Shrink', desc: 'Button shrinks smaller with every hover attempt.' },
  { key: 'dodge-cursor', label: 'Dodge Cursor', desc: 'Button darts away whenever the cursor gets close.' },
  { key: 'teleport', label: 'Teleport', desc: 'Button jumps to a random spot on the stage.' },
]

export default function ProposalStage() {
  const proposal = useStore((s) => s.proposal)
  const updateProposal = useStore((s) => s.updateProposal)
  const [form, setForm] = useState(proposal)
  const [accepted, setAccepted] = useState(false)

  const handleSave = () => {
    updateProposal(form)
    toast.success('Proposal stage saved')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <IconChip icon={Gem} tone="gold" size={48} />
        <div>
          <h1 className="font-heading text-3xl text-white">Proposal Stage</h1>
          <p className="mt-1 text-sm text-white/45">Set the stage for the one question that matters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false} className="space-y-5">
          <Field label="The Question">
            <Input
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Will you marry me?"
            />
          </Field>
          <Field label="Yes Response Text">
            <Textarea
              rows={3}
              value={form.yesResponseText}
              onChange={(e) => setForm({ ...form, yesResponseText: e.target.value })}
              placeholder="You just made me the happiest..."
            />
          </Field>
          <Field label="No Button Escape Logic">
            <div className="space-y-2">
              {behaviors.map((b) => (
                <button
                  key={b.key}
                  onClick={() => setForm({ ...form, noButtonBehavior: b.key })}
                  className={cn(
                    'w-full rounded-2xl border px-4 py-3 text-left transition-all',
                    form.noButtonBehavior === b.key
                      ? 'border-crimson/40 bg-crimson/10'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  )}
                >
                  <p className="text-sm font-medium text-white">{b.label}</p>
                  <p className="text-xs text-white/40">{b.desc}</p>
                </button>
              ))}
            </div>
          </Field>
          <Button onClick={handleSave}>Save Proposal</Button>
        </GlassCard>

        <GlassCard hover={false} className="flex flex-col items-center justify-center">
          <h3 className="mb-4 font-heading text-lg text-white">Live Preview</h3>
          <ProposalPreview form={form} accepted={accepted} setAccepted={setAccepted} />
        </GlassCard>
      </div>
    </div>
  )
}

function ProposalPreview({ form, accepted, setAccepted }) {
  const stageRef = useRef(null)
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const [noScale, setNoScale] = useState(1)

  const randomPos = () => {
    const bounds = stageRef.current?.getBoundingClientRect()
    const w = bounds ? bounds.width - 100 : 160
    const h = bounds ? bounds.height - 100 : 120
    return { x: Math.random() * w - w / 2, y: Math.random() * h - h / 2 }
  }

  const handleNoInteract = (e) => {
    if (form.noButtonBehavior === 'shrink') {
      setNoScale((s) => Math.max(0.3, s - 0.15))
    } else if (form.noButtonBehavior === 'teleport') {
      setNoPos(randomPos())
    } else if (form.noButtonBehavior === 'dodge-cursor') {
      setNoPos(randomPos())
    }
  }

  return (
    <div
      ref={stageRef}
      className="relative flex h-72 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 text-center"
    >
      {accepted ? (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
          <PartyPopper size={36} className="mx-auto text-gold" />
          <p className="font-heading text-xl text-white">{form.yesResponseText || 'She said yes!'}</p>
          <button onClick={() => setAccepted(false)} className="text-xs text-white/40 underline">
            reset preview
          </button>
        </motion.div>
      ) : (
        <>
          <p className="mb-8 font-heading text-2xl text-white">{form.question || 'Will you marry me?'}</p>
          <div className="flex items-center gap-6">
            <Button onClick={() => setAccepted(true)}>Yes</Button>
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
          <p className="mt-6 text-[11px] uppercase tracking-widest text-white/25">
            Escape mode: {form.noButtonBehavior}
          </p>
        </>
      )}
    </div>
  )
}
