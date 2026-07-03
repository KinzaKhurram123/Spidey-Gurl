import { useState } from 'react'
import { Download, KeyRound, Palette, TriangleAlert, Check } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Field, Input } from '../ui/Field'
import { useStore } from '../../store/useStore'
import { ACCENT_PRESETS, applyAccent } from '../../lib/accents'
import toast from 'react-hot-toast'

export default function SettingsModal({ open, onClose }) {
  const auth = useStore((s) => s.auth)
  const settings = useStore((s) => s.settings)
  const changePassphrase = useStore((s) => s.changePassphrase)
  const setThemeAccent = useStore((s) => s.setThemeAccent)
  const exportBackup = useStore((s) => s.exportBackup)
  const factoryReset = useStore((s) => s.factoryReset)

  const [newPass, setNewPass] = useState('')

  const handlePassphraseSave = () => {
    if (!newPass.trim()) {
      toast.error('Passphrase cannot be empty')
      return
    }
    changePassphrase(newPass.trim())
    setNewPass('')
    toast.success('Passphrase updated')
  }

  const handleAccentSelect = (key) => {
    setThemeAccent(key)
    applyAccent(key)
    toast.success('Theme accent updated')
  }

  const handleExport = () => {
    const json = exportBackup()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spidey-gurl-zone-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Backup exported')
  }

  const handleFactoryReset = () => {
    if (window.confirm('This will erase all data and restore defaults. Continue?')) {
      factoryReset()
      toast.success('Factory reset complete')
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Settings" maxWidth="max-w-xl">
      <div className="space-y-8">
        <section>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
            <KeyRound size={16} className="text-crimson" /> Gateway Passphrase
          </h4>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder={`Current: ${auth.passphrase}`}
            />
            <Button variant="outline" onClick={handlePassphraseSave}>
              Save
            </Button>
          </div>
        </section>

        <section>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
            <Palette size={16} className="text-gold" /> Theme Accent
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(ACCENT_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handleAccentSelect(key)}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/70 transition-all hover:border-white/25"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-5 w-5 rounded-full"
                    style={{ backgroundImage: `linear-gradient(135deg, ${preset.a}, ${preset.b})` }}
                  />
                  {preset.label}
                </span>
                {settings.themeAccent === key && <Check size={16} className="text-cyan" />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
            <Download size={16} className="text-cyan" /> Backup
          </h4>
          <Button variant="ghost" icon={Download} onClick={handleExport}>
            Export JSON Backup
          </Button>
        </section>

        <section className="rounded-2xl border border-crimson/25 bg-crimson/[0.05] p-4">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-crimson">
            <TriangleAlert size={16} /> Danger Zone
          </h4>
          <p className="mb-3 text-xs text-white/40">
            This permanently erases all occasions, repositories, and settings.
          </p>
          <Button variant="danger" onClick={handleFactoryReset}>
            Factory Reset
          </Button>
        </section>
      </div>
    </Modal>
  )
}
