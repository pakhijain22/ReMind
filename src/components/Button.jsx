import React from 'react'

/**
 * Shared Button component.
 * variant: "primary" (teal) | "secondary" (amber) | "ghost" (outline)
 * Always meets the 56x56px minimum touch target for patient-facing screens.
 */
export default function Button({
  children,
  onClick,
  variant = 'primary',
  icon = null,
  fullWidth = false,
  disabled = false,
  type = 'button',
}) {
  const base =
    'min-h-touch min-w-touch px-6 py-3 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-teal text-white hover:bg-teal/90',
    secondary: 'bg-amber text-charcoal hover:bg-amber/90',
    ghost: 'bg-transparent border-2 border-teal text-teal hover:bg-teal/5',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}
