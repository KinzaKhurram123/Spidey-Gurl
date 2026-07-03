import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Sparkles, Trash2 } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import IconChip from '../components/ui/IconChip'
import { Field, Input, Textarea } from '../components/ui/Field'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

const swatches = ['#ff3d68', '#ffb020', '#22d3ee', '#a855f7', '#34d399', '#f472b6']

export default function CustomOccasion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const occasion = useStore((s) => s.occasions.find((o) => o.id === id))
  const updateOccasion = useStore((s) => s.updateOccasion)
  const deleteOccasion = useStore((s) => s.deleteOccasion)

  const [form, setForm] = useState(occasion || { name: '', accentColor: '#ff3d68', content: '' })

  useEffect(() => {
    if (occasion) setForm(occasion)
  }, [occasion?.id])

  if (!occasion) {
    return (
      <GlassCard hover={false} className="mx-auto max-w-md text-center">
        <p className="text-white/60">This occasion no longer exists.</p>
        <Button className="mt-4" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </GlassCard>
    )
  }

  const handleSave = () => {
    updateOccasion(id, form)
    toast.success('Occasion saved')
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${occasion.name}"? This cannot be undone.`)) {
      deleteOccasion(id)
      toast('Occasion deleted', { icon: '🗑️' })
      navigate('/')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <IconChip icon={Sparkles} size={48} className="border" style={{ color: form.accentColor, background: `${form.accentColor}22`, borderColor: `${form.accentColor}55` }} />
          <div>
            <h1 className="font-heading text-3xl text-white">{occasion.name}</h1>
            <p className="mt-1 text-sm text-white/45">Custom occasion configuration</p>
          </div>
        </div>
        <Button variant="danger" icon={Trash2} onClick={handleDelete}>
          Delete Occasion
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false} className="space-y-5">
          <Field label="Occasion Name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>

          <Field label="Accent Color">
            <div className="flex flex-wrap gap-2">
              {swatches.map((color) => (
                <button
                  key={color}
                  onClick={() => setForm({ ...form, accentColor: color })}
                  className="h-9 w-9 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: form.accentColor === color ? '#fff' : 'transparent',
                  }}
                />
              ))}
            </div>
          </Field>

          <Field label="Content">
            <Textarea
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write the story, message, or plan for this occasion..."
            />
          </Field>

          <Button onClick={handleSave}>Save Occasion</Button>
        </GlassCard>

        <GlassCard hover={false} style={{ borderColor: `${form.accentColor}40` }}>
          <h3 className="mb-4 font-heading text-lg text-white">Preview</h3>
          <div
            className="flex min-h-[16rem] flex-col items-center justify-center rounded-2xl border p-6 text-center"
            style={{ borderColor: `${form.accentColor}40`, background: `${form.accentColor}0d` }}
          >
            <p className="font-heading text-2xl text-white">{form.name}</p>
            <p className="mt-4 max-w-sm whitespace-pre-wrap text-sm text-white/60">
              {form.content || 'Content preview will appear here'}
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
