export const ACCENT_PRESETS = {
  'crimson-gold': { label: 'Crimson & Gold', a: '#ff3d68', b: '#ffb020' },
  'gold-crimson': { label: 'Gold & Crimson', a: '#ffb020', b: '#ff3d68' },
  'crimson-cyan': { label: 'Crimson & Cyan', a: '#ff3d68', b: '#22d3ee' },
  'cyan-gold': { label: 'Cyan & Gold', a: '#22d3ee', b: '#ffb020' },
}

export function applyAccent(key) {
  const preset = ACCENT_PRESETS[key] || ACCENT_PRESETS['crimson-gold']
  document.documentElement.style.setProperty('--accent-a', preset.a)
  document.documentElement.style.setProperty('--accent-b', preset.b)
}
