import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { useStore } from '../store/useStore'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

export default function Login() {
  const login = useStore((s) => s.login)
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = login(value)
    if (ok) {
      toast.success('Welcome back, Admin')
    } else {
      setShake(true)
      toast.error('Incorrect passphrase')
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0">
        {[...Array(16)].map((_, i) => (
          <span
            key={i}
            className="absolute animate-float-slow rounded-full opacity-30 blur-sm"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: 6 + (i % 4) * 4,
              height: 6 + (i % 4) * 4,
              backgroundImage: i % 2 ? 'linear-gradient(135deg, #ff3d68, #ffb020)' : 'linear-gradient(135deg, #22d3ee, #ff3d68)',
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative z-10 w-full max-w-sm rounded-xl2 p-8 text-center"
      >
        <div
          className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-a), var(--accent-b))' }}
        >
          <Lock size={26} className="text-white" />
        </div>
        <h1 className="font-heading text-2xl text-white">
          Spidey <span className="text-gradient">Gurl</span> Zone
        </h1>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.25em] text-white/35">
          <ShieldCheck size={13} /> Admin Access Only
        </p>

        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.45 }}
          className="mt-8 space-y-4"
        >
          <input
            autoFocus
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter passphrase"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-center text-sm tracking-widest text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-crimson/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(255,61,104,0.12)]"
          />
          <Button type="submit" icon={Sparkles} className="w-full">
            Enter the Zone
          </Button>
        </motion.form>

        <p className="mt-6 text-[11px] text-white/25">Default passphrase: spidey123</p>
      </motion.div>
    </div>
  )
}
