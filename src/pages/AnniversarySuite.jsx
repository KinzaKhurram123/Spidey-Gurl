import { useState } from 'react'
import { Heart } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import IconChip from '../components/ui/IconChip'
import { Field, Input, Textarea } from '../components/ui/Field'
import { useStore } from '../store/useStore'
import { daysBetween, formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

export default function AnniversarySuite() {
  const anniversary = useStore((s) => s.anniversary)
  const updateAnniversary = useStore((s) => s.updateAnniversary)
  const [form, setForm] = useState(anniversary)

  const days = form.startDate ? daysBetween(form.startDate, new Date()) : null

  const handleSave = () => {
    updateAnniversary(form)
    toast.success('Anniversary suite saved')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <IconChip icon={Heart} tone="crimson" size={48} />
        <div>
          <h1 className="font-heading text-3xl text-white">Anniversary Suite</h1>
          <p className="mt-1 text-sm text-white/45">Celebrate every day you've built together.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false} className="space-y-5">
          <Field label="Relationship Start Date">
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </Field>
          <Field label="Wishes Text">
            <Textarea
              rows={6}
              value={form.wishesText}
              onChange={(e) => setForm({ ...form, wishesText: e.target.value })}
              placeholder="Happy anniversary..."
            />
          </Field>
          <Button onClick={handleSave}>Save Anniversary</Button>
        </GlassCard>

        <GlassCard hover={false} className="flex flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/35">Together Since</p>
          <p className="mt-2 text-sm text-white/60">{formatDate(form.startDate)}</p>
          <p className="font-stat mt-6 text-6xl font-extrabold text-gradient">
            {days !== null ? days.toLocaleString() : '—'}
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/40">days together</p>
          <p className="mt-8 max-w-xs font-heading text-lg text-white/85">
            {form.wishesText || 'Your wishes text will appear here'}
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
