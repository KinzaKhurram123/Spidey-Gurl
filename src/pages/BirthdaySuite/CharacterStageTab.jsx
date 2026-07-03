import { useState } from 'react'
import { Box, Link2 } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'
import EmptyState from '../../components/ui/EmptyState'
import { useStore } from '../../store/useStore'
import toast from 'react-hot-toast'

export default function CharacterStageTab() {
  const characterStage = useStore((s) => s.birthday.characterStage)
  const updateCharacterStage = useStore((s) => s.updateCharacterStage)
  const [url, setUrl] = useState(characterStage.glbUrl)

  const handleSave = () => {
    updateCharacterStage({ glbUrl: url })
    toast.success('3D character stage updated')
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GlassCard hover={false}>
        <h3 className="mb-1 flex items-center gap-2 font-heading text-lg text-white">
          <Box size={18} className="text-cyan" /> 3D Character Model
        </h3>
        <p className="mb-5 text-sm text-white/40">Drop in a .glb model URL to stage a 3D character on her surprise page.</p>
        <Field label="GLB Model URL">
          <div className="relative">
            <Link2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <Input
              className="pl-10"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/model.glb"
            />
          </div>
        </Field>
        <Button className="mt-5" onClick={handleSave}>
          Save Model URL
        </Button>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="mb-4 font-heading text-lg text-white">Stage Preview</h3>
        <div className="h-72 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          {url ? (
            <model-viewer
              src={url}
              camera-controls="true"
              auto-rotate="true"
              shadow-intensity="1"
              style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
            />
          ) : (
            <EmptyState icon={Box} title="No model loaded" subtitle="Paste a GLB URL to preview the character in 3D." />
          )}
        </div>
      </GlassCard>
    </div>
  )
}
