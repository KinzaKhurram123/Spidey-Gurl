import { useState } from 'react'
import { motion } from 'framer-motion'
import { Archive, BookHeart, Mail, ScrollText, Plus, Trash2 } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import Button from '../../components/ui/Button'
import { Field, Input, Textarea } from '../../components/ui/Field'
import EmptyState from '../../components/ui/EmptyState'
import { useStore } from '../../store/useStore'
import { formatDate, cn } from '../../lib/utils'
import toast from 'react-hot-toast'

const repoConfig = {
  memoryVault: {
    label: 'Memory Vault',
    icon: BookHeart,
    tone: 'crimson',
    fields: [
      { key: 'title', label: 'Title', placeholder: 'Our first trip' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'What made it special...' },
      { key: 'date', label: 'Date', type: 'date' },
    ],
  },
  messageJar: {
    label: 'Message Jar',
    icon: Mail,
    tone: 'gold',
    fields: [
      { key: 'message', label: 'Message', type: 'textarea', placeholder: 'A little note to pull out anytime...' },
    ],
  },
  secretLetters: {
    label: 'Secret Letters',
    icon: ScrollText,
    tone: 'cyan',
    fields: [
      { key: 'title', label: 'Title', placeholder: 'Open when you miss me' },
      { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Dear you...' },
      { key: 'unlockDate', label: 'Unlock Date', type: 'date' },
    ],
  },
}

export default function RepositoriesTab() {
  const [active, setActive] = useState('memoryVault')
  const config = repoConfig[active]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {Object.entries(repoConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={cn(
              'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
              active === key
                ? 'border-white/25 bg-white/10 text-white'
                : 'border-white/10 text-white/45 hover:border-white/20 hover:text-white/80'
            )}
          >
            <cfg.icon size={15} />
            {cfg.label}
          </button>
        ))}
      </div>

      <RepoSection repoKey={active} config={config} />
    </div>
  )
}

function RepoSection({ repoKey, config }) {
  const items = useStore((s) => s.birthday.repositories[repoKey])
  const addRepoItem = useStore((s) => s.addRepoItem)
  const deleteRepoItem = useStore((s) => s.deleteRepoItem)
  const emptyForm = Object.fromEntries(config.fields.map((f) => [f.key, '']))
  const [form, setForm] = useState(emptyForm)

  const handleAdd = () => {
    const hasContent = config.fields.some((f) => form[f.key]?.trim())
    if (!hasContent) {
      toast.error('Fill in at least one field')
      return
    }
    addRepoItem(repoKey, form)
    toast.success(`Added to ${config.label}`)
    setForm(emptyForm)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
      <GlassCard hover={false}>
        <h3 className="mb-4 flex items-center gap-2 font-heading text-lg text-white">
          <Archive size={17} className="text-white/50" /> New Entry
        </h3>
        <div className="space-y-4">
          {config.fields.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.type === 'textarea' ? (
                <Textarea
                  rows={4}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                />
              ) : (
                <Input
                  type={f.type || 'text'}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                />
              )}
            </Field>
          ))}
          <Button icon={Plus} className="w-full" onClick={handleAdd}>
            Add to {config.label}
          </Button>
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="mb-4 font-heading text-lg text-white">{config.label} ({items.length})</h3>
        {items.length === 0 ? (
          <EmptyState icon={config.icon} title="Empty for now" subtitle="Entries you add will show up here." />
        ) : (
          <div className="max-h-[26rem] space-y-3 overflow-y-auto pr-1">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {item.title && <p className="truncate font-medium text-white">{item.title}</p>}
                    {(item.description || item.content || item.message) && (
                      <p className="mt-1 line-clamp-3 text-sm text-white/55">
                        {item.description || item.content || item.message}
                      </p>
                    )}
                    {(item.date || item.unlockDate) && (
                      <p className="mt-2 text-xs text-white/30">{formatDate(item.date || item.unlockDate)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      deleteRepoItem(repoKey, item.id)
                      toast('Entry deleted', { icon: '🗑️' })
                    }}
                    className="shrink-0 rounded-full p-2 text-white/30 transition-colors hover:bg-crimson/10 hover:text-crimson"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
