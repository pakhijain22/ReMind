import React, { useEffect, useState } from 'react'

/**
 * Toggles the 'dark' class on <html>, which Tailwind's darkMode: 'class'
 * strategy reads. Persists the choice in localStorage so it survives reloads.
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('remind-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = saved ? saved === 'dark' : prefersDark
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('remind-theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-charcoal/10 dark:border-white/10 shadow-sm text-lg"
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
    </button>
  )
}
