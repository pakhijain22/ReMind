import React from 'react'

/**
 * Hero illustration for the Landing page — a flat, layered "misty hills of
 * the Northeast" scene: rising sun, three depth layers of hills, a small
 * pagoda/monastery silhouette, scalloped tea-garden rows, and a winding
 * river. Built entirely in inline SVG using the existing teal/amber/sage
 * theme tokens (with dark: variants), so it needs no image assets and adds
 * no new dependencies — safe for production builds.
 */
export default function HillsIllustration({ className = 'w-full h-auto', preserveAspectRatio = 'xMidYMid meet' }) {
  return (
    <svg
      viewBox="0 0 600 340"
      className={className}
      preserveAspectRatio={preserveAspectRatio}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rising sun — soft glow + solid core */}
      <circle
        cx="440" cy="95" r="70"
        className="fill-amber/25 dark:fill-amber-dark/20"
      />
      <circle
        cx="440" cy="95" r="36"
        className="fill-amber/80 dark:fill-amber-dark/80 animate-[ringPulse_6s_ease-in-out_infinite]"
      />

      {/* Two small birds in flight */}
      <path
        d="M90,70 q10,-12 20,0 q10,-12 20,0"
        className="stroke-teal dark:stroke-teal-dark opacity-50"
        strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      <path
        d="M140,50 q8,-9 16,0 q8,-9 16,0"
        className="stroke-teal dark:stroke-teal-dark opacity-35"
        strokeWidth="2" fill="none" strokeLinecap="round"
      />

      {/* Far hill layer */}
      <path
        d="M0,190 C100,150 200,170 300,140 C400,110 500,155 600,125 L600,340 L0,340 Z"
        className="fill-teal/15 dark:fill-teal-dark/15"
      />

      {/* Mid hill layer */}
      <path
        d="M0,235 C120,195 220,215 320,185 C420,160 520,205 600,175 L600,340 L0,340 Z"
        className="fill-teal/35 dark:fill-teal-dark/30"
      />

      {/* Pagoda / monastery silhouette on the mid hill */}
      <g transform="translate(195,150)">
        <polygon points="0,34 34,34 30,22 4,22" className="fill-amber dark:fill-amber-dark" />
        <polygon points="4,22 30,22 26,12 8,12" className="fill-amber dark:fill-amber-dark" />
        <polygon points="8,12 26,12 22,3 12,3" className="fill-amber dark:fill-amber-dark" />
        <rect x="14" y="34" width="6" height="14" className="fill-charcoal/70 dark:fill-text-dark/60" />
        {/* prayer flag line */}
        <line x1="34" y1="24" x2="60" y2="14" className="stroke-charcoal/30 dark:stroke-text-dark/30" strokeWidth="1" />
        <polygon points="38,24 44,22 44,27" className="fill-rose/70" />
        <polygon points="46,22 52,20 52,25" className="fill-sage/70" />
        <polygon points="54,20 60,18 60,23" className="fill-teal/70 dark:fill-teal-dark/70" />
      </g>

      {/* Front hill layer (foreground silhouette) */}
      <path
        d="M0,280 C150,240 250,270 350,240 C450,220 550,258 600,232 L600,340 L0,340 Z"
        className="fill-teal/70 dark:fill-teal-dark/60"
      />

      {/* Winding river cutting through the hills */}
      <path
        d="M330,145 C310,185 348,215 316,252 C296,278 332,300 306,340"
        className="stroke-amber/60 dark:stroke-amber-dark/50"
        strokeWidth="5" fill="none" strokeLinecap="round"
      />

      {/* Tea-garden rows along the foreground */}
      <g className="fill-sage/50 dark:fill-sage-dark/40">
        {Array.from({ length: 11 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 58},322 q14,-16 28,0 q14,-16 28,0 L${i * 58 + 56},340 L${i * 58},340 Z`}
          />
        ))}
      </g>
    </svg>
  )
}
