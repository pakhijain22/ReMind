import React from 'react'

/**
 * Wraps content with a real photo background at low opacity, plus a solid
 * color scrim on top — never raw photo behind text, per the design
 * system's "no busy patterns behind text" rule. The scrim guarantees
 * WCAG AA contrast regardless of which photo is used.
 *
 * `src` should point to a local file in /public/images/ (not a hotlinked
 * external URL) so it's cached correctly by the service worker for
 * offline use, and so it doesn't depend on a third-party image host
 * staying online. If the file is missing, the scrim's solid background
 * still renders correctly — nothing breaks, the photo is purely additive.
 */
export default function PhotoBackdrop({ src, opacity = 0.35, className = '', children }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity }}
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-offwhite via-offwhite/85 to-offwhite dark:from-bg-dark dark:via-bg-dark/85 dark:to-bg-dark"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
