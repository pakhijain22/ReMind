import React from 'react'

/**
 * Shared Tile component — large, icon + text, patient-facing.
 * Never icon-only, per design system rules.
 */
export default function Tile({ icon, label, onClick, accent = 'teal' }) {
  const accents = {
    teal: 'bg-teal text-white',
    amber: 'bg-amber text-charcoal',
    sage: 'bg-sage text-white',
  }

  return (
    <button
      onClick={onClick}
      className={`min-h-touch w-full rounded-3xl p-6 flex flex-col items-center justify-center gap-3 shadow-md active:scale-95 transition-transform ${accents[accent]}`}
    >
      <span className="text-4xl" aria-hidden="true">{icon}</span>
      <span className="text-xl font-bold">{label}</span>
    </button>
  )
}
