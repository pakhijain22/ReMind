import React from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import VoiceButton from './VoiceButton.jsx'

/**
 * Shared header for interior pages — back button, title, optional
 * voice narration and theme toggle. Keeps every page visually
 * consistent with the Landing page's design language.
 */
export default function PageHeader({
  title,
  backTo,
  voiceText = null,
  showThemeToggle = false,
}) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(backTo)}
          aria-label="Go back"
          className="min-h-touch min-w-touch flex items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-charcoal/10 dark:border-white/10 shadow-sm text-xl text-teal dark:text-teal-dark active:scale-95 transition-transform"
        >
          ←
        </button>
        <h1 className="font-display text-2xl md:text-3xl font-medium text-charcoal dark:text-text-dark">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {showThemeToggle && <ThemeToggle />}
        {voiceText && <VoiceButton text={voiceText} />}
      </div>
    </div>
  )
}
