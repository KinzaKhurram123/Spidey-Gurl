import { useState } from 'react'
import { Link2, Copy, Check } from 'lucide-react'

export default function ShareLinkCard({ path }) {
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}${path}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <Link2 size={16} className="shrink-0 text-cyan" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wide text-white/35">Shareable Link</p>
        <p className="truncate text-sm text-white/70">{link}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10"
      >
        {copied ? <Check size={13} className="text-cyan" /> : <Copy size={13} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
