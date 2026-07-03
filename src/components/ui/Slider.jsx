export default function Slider({ value, onChange, min = 0, max = 100, step = 1, gradient = 'linear-gradient(90deg, #22d3ee, #ffb020, #ff3d68)' }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full appearance-none cursor-pointer accent-crimson"
      style={{
        height: 8,
        borderRadius: 999,
        background: `linear-gradient(to right, transparent 0%, transparent 0%), ${gradient}`,
        backgroundSize: '100% 100%',
        opacity: 1,
        WebkitAppearance: 'none',
        boxShadow: `inset 0 0 0 9999px rgba(0,0,0,0.001)`,
      }}
    />
  )
}
