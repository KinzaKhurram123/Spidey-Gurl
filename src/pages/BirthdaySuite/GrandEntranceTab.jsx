import { useState } from 'react'
import { Sparkle, Heart, Flower2 } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import Button from '../../components/ui/Button'
import Toggle from '../../components/ui/Toggle'
import { Field, Input, Textarea } from '../../components/ui/Field'
import { useStore } from '../../store/useStore'
import toast from 'react-hot-toast'

export default function GrandEntranceTab() {
  const entrance = useStore((s) => s.birthday.entrance)
  const updateBirthdayEntrance = useStore((s) => s.updateBirthdayEntrance)
  const [form, setForm] = useState(entrance)

  const handleSave = () => {
    updateBirthdayEntrance(form)
    toast.success('Grand entrance updated')
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassCard hover={false}>
        <h3 className="mb-1 flex items-center gap-2 font-heading text-lg text-white">
          <Sparkle size={18} className="text-gold" /> Entrance Details
        </h3>
        <p className="mb-5 text-sm text-white/40">Set the mood and message for the moment she walks in.</p>
        <div className="space-y-4">
          <Field label="Theme">
            <Input
              value={form.theme}
              onChange={(e) => setForm({ ...form, theme: e.target.value })}
              placeholder="Midnight Rose Garden"
            />
          </Field>
          <Field label="Wish Text">
            <Textarea
              rows={5}
              value={form.wishText}
              onChange={(e) => setForm({ ...form, wishText: e.target.value })}
              placeholder="Happy Birthday..."
            />
          </Field>
          <div className="flex flex-wrap gap-6 pt-2">
            <Toggle
              checked={form.floatingHearts}
              onChange={(v) => setForm({ ...form, floatingHearts: v })}
              label="Floating Hearts"
            />
            <Toggle
              checked={form.floatingPetals}
              onChange={(v) => setForm({ ...form, floatingPetals: v })}
              label="Floating Petals"
            />
          </div>
          <Button onClick={handleSave}>Save Entrance</Button>
        </div>
      </GlassCard>

      <GlassCard hover={false} className="relative overflow-hidden">
        <h3 className="mb-4 font-heading text-lg text-white">Live Preview</h3>
        <div className="relative flex h-72 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-void-800 to-black p-6 text-center">
          {form.floatingHearts &&
            [...Array(6)].map((_, i) => (
              <Heart
                key={`h-${i}`}
                size={16 + (i % 3) * 6}
                className="absolute text-crimson/60 animate-float-slow"
                style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 20}%`, animationDelay: `${i * 0.4}s` }}
              />
            ))}
          {form.floatingPetals &&
            [...Array(6)].map((_, i) => (
              <Flower2
                key={`p-${i}`}
                size={14 + (i % 3) * 5}
                className="absolute text-gold/60 animate-float-slow"
                style={{ right: `${8 + i * 14}%`, top: `${15 + (i % 4) * 18}%`, animationDelay: `${i * 0.3 + 0.2}s` }}
              />
            ))}
          <p className="relative z-10 font-heading text-xs uppercase tracking-[0.3em] text-gold/70">
            {form.theme || 'Untitled Theme'}
          </p>
          <p className="relative z-10 mt-4 max-w-xs font-heading text-xl text-white">
            {form.wishText || 'Your wish text will appear here'}
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
