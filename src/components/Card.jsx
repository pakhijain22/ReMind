import React from 'react'

/**
 * Shared Card component — soft shadow, off-white background,
 * used across dashboards, memory vault entries, reminder items, etc.
 */
export default function Card({ children, className = '', onClick = null }) {
  const interactive = onClick ? 'cursor-pointer hover:shadow-lg active:scale-[0.99]' : ''
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-surface-dark rounded-2xl shadow-md p-5 transition-all ${interactive} ${className}`}
    >
      {children}
    </div>
  )
}
