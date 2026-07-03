import { useState } from 'react'
import { KeyRound, Eye, EyeOff } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'
import { useStore } from '../../store/useStore'
import toast from 'react-hot-toast'

export default function GatewayTab() {
  const gateway = useStore((s) => s.birthday.gateway)
  const updateBirthdayGateway = useStore((s) => s.updateBirthdayGateway)
  const [value, setValue] = useState(gateway.passphrase)
  const [visible, setVisible] = useState(false)

  const handleSave = () => {
    updateBirthdayGateway({ passphrase: value })
    toast.success('Gateway passphrase updated')
  }

  return (
    <GlassCard hover={false} className="max-w-lg">
      <h3 className="mb-1 flex items-center gap-2 font-heading text-lg text-white">
        <KeyRound size={18} className="text-crimson" /> Entry Passphrase
      </h3>
      <p className="mb-5 text-sm text-white/40">
        This is the secret phrase she'll need to unlock the birthday experience.
      </p>
      <Field label="Passphrase">
        <div className="relative">
          <Input
            type={visible ? 'text' : 'password'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>
      <Button className="mt-5" onClick={handleSave}>
        Save Passphrase
      </Button>
    </GlassCard>
  )
}
