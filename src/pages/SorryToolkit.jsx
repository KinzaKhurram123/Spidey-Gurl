import { useState } from 'react'
import { Flower2, Heart } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import IconChip from '../components/ui/IconChip'
import ShareLinkCard from '../components/ui/ShareLinkCard'
import Slider from '../components/ui/Slider'
import { Field, Textarea } from '../components/ui/Field'
import { useStore } from '../store/useStore'
import { cn } from '../lib/utils'
import toast from 'react-hot-toast'

const forgivenessLabel = (v) => {
  if (v < 25) return 'Still upset'
  if (v < 50) return 'Softening'
  if (v < 75) return 'Almost there'
  return 'All forgiven'
}

export default function SorryToolkit() {
  const sorry = useStore((s) => s.sorry)
  const updateSorry = useStore((s) => s.updateSorry)
  const [form, setForm] = useState(sorry)

  const handleSave = () => {
    updateSorry(form)
    toast.success('Sorry toolkit saved')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <IconChip icon={Flower2} tone="crimson" size={48} />
        <div>
          <h1 className="font-heading text-3xl text-white">Sorry Toolkit</h1>
          <p className="mt-1 text-sm text-white/45">Because a heartfelt apology deserves the right presentation.</p>
        </div>
      </div>

      <ShareLinkCard path="/reveal/sorry" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false} className="space-y-6">
          <Field label="Apology Text">
            <Textarea
              rows={6}
              value={form.apologyText}
              onChange={(e) => setForm({ ...form, apologyText: e.target.value })}
              placeholder="I'm sorry..."
            />
          </Field>

          <Field label={`Flowers Count — ${form.flowersCount}`}>
            <Slider
              value={form.flowersCount}
              onChange={(v) => setForm({ ...form, flowersCount: v })}
              min={1}
              max={50}
              gradient="linear-gradient(90deg, #ff3d68, #ffb020)"
            />
          </Field>

          <Field label={`Forgiveness Meter — ${forgivenessLabel(form.forgivenessSlider)}`}>
            <Slider
              value={form.forgivenessSlider}
              onChange={(v) => setForm({ ...form, forgivenessSlider: v })}
              gradient="linear-gradient(90deg, #ff3d68, #ffb020, #22d3ee)"
            />
          </Field>

          <Button onClick={handleSave}>Save Toolkit</Button>
        </GlassCard>

        <GlassCard hover={false} className="relative flex flex-col items-center justify-center overflow-hidden text-center">
          <div className="pointer-events-none absolute inset-0">
            {[...Array(Math.min(form.flowersCount, 30))].map((_, i) => (
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
            <p className="mt-4 max-w-sm font-heading text-xl text-white">{form.apologyText || 'Your apology preview'}</p>
            <p className="mt-4 font-stat text-sm uppercase tracking-widest text-white/40">
              {form.flowersCount} flowers · {forgivenessLabel(form.forgivenessSlider)}
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
