import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FolderKanban,
  CalendarClock,
  ListChecks,
  Plus,
  Trash2,
  Cake,
  Heart,
  Flower2,
  Gem,
  Sparkles,
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { Field, Input, Textarea } from '../components/ui/Field'
import EmptyState from '../components/ui/EmptyState'
import { useStore } from '../store/useStore'
import { cn, daysBetween, formatDate, priorityColors } from '../lib/utils'
import toast from 'react-hot-toast'

const typeIcons = { birthday: Cake, anniversary: Heart, apology: Flower2, proposal: Gem, custom: Sparkles }

export default function Dashboard() {
  const projects = useStore((s) => s.projects)
  const addProject = useStore((s) => s.addProject)
  const updateProject = useStore((s) => s.updateProject)
  const deleteProject = useStore((s) => s.deleteProject)
  const checklist = useStore((s) => s.checklist)
  const addChecklistItem = useStore((s) => s.addChecklistItem)
  const toggleChecklistItem = useStore((s) => s.toggleChecklistItem)
  const deleteChecklistItem = useStore((s) => s.deleteChecklistItem)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'birthday', priority: 'medium', launchDate: '' })
  const [checklistText, setChecklistText] = useState('')
  const [checklistPriority, setChecklistPriority] = useState('medium')

  const upcoming = useMemo(
    () =>
      [...projects]
        .filter((p) => p.launchDate)
        .sort((a, b) => new Date(a.launchDate) - new Date(b.launchDate)),
    [projects]
  )

  const nearest = upcoming[0]
  const nearestDays = nearest ? daysBetween(new Date(), nearest.launchDate) : null

  const handleCreate = () => {
    if (!form.name.trim()) {
      toast.error('Give the project a name')
      return
    }
    addProject(form)
    toast.success('Project added to the registry')
    setModalOpen(false)
    setForm({ name: '', type: 'birthday', priority: 'medium', launchDate: '' })
  }

  const handleAddChecklist = () => {
    if (!checklistText.trim()) return
    addChecklistItem({ text: checklistText.trim(), priority: checklistPriority })
    setChecklistText('')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-white">Mission Control</h1>
          <p className="mt-1 text-sm text-white/45">Every surprise, tracked, timed, and ready to launch.</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard icon={FolderKanban} label="Active Projects" value={projects.length} tone="crimson" delay={0} />
        <StatCard
          icon={CalendarClock}
          label="Next Launch In"
          value={nearestDays !== null ? `${nearestDays}d` : '—'}
          tone="gold"
          delay={0.06}
        />
        <StatCard
          icon={ListChecks}
          label="Checklist Done"
          value={`${checklist.filter((c) => c.done).length}/${checklist.length}`}
          tone="cyan"
          delay={0.12}
        />
      </div>

      <GlassCard className="overflow-x-auto" hover={false}>
        <h2 className="mb-5 font-heading text-lg text-white">Project Registry</h2>
        {projects.length === 0 ? (
          <EmptyState icon={FolderKanban} title="No projects yet" subtitle="Create your first surprise project to get started." />
        ) : (
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-white/35">
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Launch</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => {
                const Icon = typeIcons[p.type] || Sparkles
                const pc = priorityColors[p.priority] || priorityColors.medium
                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-white/5"
                  >
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={cn('grid h-9 w-9 place-items-center rounded-full border', pc.bg, pc.border)}>
                          <Icon size={16} className={pc.text} />
                        </div>
                        <span className="font-medium text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <Badge className={cn(pc.bg, pc.text, pc.border)}>{p.priority}</Badge>
                    </td>
                    <td className="py-3.5">
                      <select
                        value={p.status}
                        onChange={(e) => updateProject(p.id, { status: e.target.value })}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 outline-none"
                      >
                        <option className="bg-void-900" value="planning">planning</option>
                        <option className="bg-void-900" value="in-progress">in-progress</option>
                        <option className="bg-void-900" value="ready">ready</option>
                        <option className="bg-void-900" value="launched">launched</option>
                      </select>
                    </td>
                    <td className="py-3.5 text-white/60">{formatDate(p.launchDate)}</td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => {
                          deleteProject(p.id)
                          toast('Project removed', { icon: '🗑️' })
                        }}
                        className="rounded-full p-2 text-white/35 transition-colors hover:bg-crimson/10 hover:text-crimson"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        )}
      </GlassCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard hover={false}>
          <h2 className="mb-5 font-heading text-lg text-white">Launch Calendar</h2>
          {upcoming.length === 0 ? (
            <EmptyState icon={CalendarClock} title="Nothing scheduled" subtitle="Add a launch date to see the countdown." />
          ) : (
            <div className="space-y-3">
              {upcoming.map((p, i) => {
                const days = daysBetween(new Date(), p.launchDate)
                const pc = priorityColors[p.priority] || priorityColors.medium
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{p.name}</p>
                      <p className="text-xs text-white/40">{formatDate(p.launchDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn('font-stat text-xl font-bold', pc.text)}>
                        {days < 0 ? 'Past' : days === 0 ? 'Today' : `${days}d`}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </GlassCard>

        <GlassCard hover={false}>
          <h2 className="mb-5 font-heading text-lg text-white">Priority Checklist</h2>
          <div className="mb-4 flex gap-2">
            <Input
              value={checklistText}
              onChange={(e) => setChecklistText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
              placeholder="Add a to-do..."
            />
            <select
              value={checklistPriority}
              onChange={(e) => setChecklistPriority(e.target.value)}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-xs text-white/70 outline-none"
            >
              <option className="bg-void-900" value="high">high</option>
              <option className="bg-void-900" value="medium">medium</option>
              <option className="bg-void-900" value="low">low</option>
            </select>
            <Button variant="outline" onClick={handleAddChecklist}>
              Add
            </Button>
          </div>
          {checklist.length === 0 ? (
            <EmptyState icon={ListChecks} title="All clear" subtitle="No pending tasks." />
          ) : (
            <div className="space-y-2">
              {checklist.map((c, i) => {
                const pc = priorityColors[c.priority] || priorityColors.medium
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn('flex items-center justify-between rounded-2xl border px-4 py-3', pc.border, pc.bg)}
                  >
                    <button onClick={() => toggleChecklistItem(c.id)} className="flex items-center gap-3 text-left">
                      <span
                        className={cn(
                          'grid h-5 w-5 shrink-0 place-items-center rounded-full border-2',
                          c.done ? cn(pc.dot, 'border-transparent') : 'border-white/25'
                        )}
                      >
                        {c.done && <span className="h-2 w-2 rounded-full bg-black/40" />}
                      </span>
                      <span className={cn('text-sm', c.done ? 'text-white/35 line-through' : 'text-white/85')}>
                        {c.text}
                      </span>
                    </button>
                    <button
                      onClick={() => deleteChecklistItem(c.id)}
                      className="text-white/25 transition-colors hover:text-crimson"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          )}
        </GlassCard>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Project">
        <div className="space-y-4">
          <Field label="Project Name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Her Birthday Surprise" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
              >
                <option className="bg-void-900" value="birthday">Birthday</option>
                <option className="bg-void-900" value="anniversary">Anniversary</option>
                <option className="bg-void-900" value="apology">Apology</option>
                <option className="bg-void-900" value="proposal">Proposal</option>
                <option className="bg-void-900" value="custom">Custom</option>
              </select>
            </Field>
            <Field label="Priority">
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
              >
                <option className="bg-void-900" value="high">High</option>
                <option className="bg-void-900" value="medium">Medium</option>
                <option className="bg-void-900" value="low">Low</option>
              </select>
            </Field>
          </div>
          <Field label="Launch Date">
            <Input type="date" value={form.launchDate} onChange={(e) => setForm({ ...form, launchDate: e.target.value })} />
          </Field>
          <Button className="w-full" onClick={handleCreate}>
            Create Project
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, tone, delay }) {
  const tones = {
    crimson: 'text-crimson bg-crimson/15 border-crimson/30',
    gold: 'text-gold bg-gold/15 border-gold/30',
    cyan: 'text-cyan bg-cyan/15 border-cyan/30',
  }
  return (
    <GlassCard as={motion.div} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <div className="flex items-center gap-4">
        <div className={cn('grid h-12 w-12 place-items-center rounded-full border', tones[tone])}>
          <Icon size={20} />
        </div>
        <div>
          <p className="font-stat text-2xl font-bold text-white">{value}</p>
          <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
        </div>
      </div>
    </GlassCard>
  )
}
