// src/components/NERBackground.jsx
//
// The subtle North-East India feel the brief asked for: layered hill
// silhouettes (evoking the Khasi/Naga hills) and a thin woven-textile
// diamond border, both rendered in the existing Warm Trust palette at very
// low opacity. No literal photos, no people, no place names — just a mood,
// sitting quietly behind the real content.
//
// Usage: <NERBackground /> once near the root of a page, positioned fixed
// so it doesn't scroll away or interfere with layout.

import { usePatient } from '../context/PatientContext';

export default function NERBackground({ variant = 'default' }) {
  const { theme } = usePatient();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className={isDark ? 'absolute inset-0 bg-gradient-to-br from-[#102f32] via-[#183f3b] to-[#261f2b]' : 'absolute inset-0 bg-gradient-to-br from-[#cbded2] via-[#eee5d5] to-[#b9d0ca]'} />
      {!isDark && <div className="absolute inset-0 bg-[url('/images/img.jpg')] bg-cover bg-center opacity-[0.58] mix-blend-multiply" />}
      {isDark && <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(232,163,61,0.2),transparent_22%),linear-gradient(145deg,transparent_55%,rgba(8,38,40,0.5))]" />}

      <svg
        className="absolute top-[12%] right-[9%] w-24 h-24 opacity-[0.22]"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="34" fill={isDark ? '#F0B860' : '#E8A33D'} />
        <circle cx="50" cy="50" r="24" fill="#F0B860" opacity="0.65" />
      </svg>

      <svg
        className="absolute right-0 bottom-[7%] w-40 h-[48%] opacity-[0.12]"
        viewBox="0 0 160 420"
        preserveAspectRatio="xMaxYMax meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M130 420 C125 300 135 170 108 0" fill="none" stroke="#315e50" strokeWidth="7" strokeLinecap="round" />
        <path d="M116 300 C80 275 57 250 45 214 M122 240 C145 215 151 190 151 158 M113 170 C81 148 68 123 63 91" fill="none" stroke="#315e50" strokeWidth="5" strokeLinecap="round" />
        <path d="M45 214 C70 216 82 229 91 246 C70 249 54 239 45 214 M151 158 C129 160 118 173 112 190 C132 188 145 178 151 158 M63 91 C85 95 97 108 103 124 C82 122 69 110 63 91" fill="#3E7C59" />
      </svg>

      {/* Thin woven-textile diamond border along the very top, echoing NER
          handloom patterns without depicting anything literal */}
      <svg
        className="absolute top-0 left-0 w-full h-[14px] opacity-[0.14]"
        viewBox="0 0 160 14"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="nerDiamondBorder" width="16" height="14" patternUnits="userSpaceOnUse">
            <polygon points="8,0 16,7 8,14 0,7" fill="#E8A33D" />
          </pattern>
        </defs>
        <rect width="160" height="14" fill="url(#nerDiamondBorder)" />
      </svg>

      <svg
        className="absolute bottom-0 left-0 w-full h-[10px] opacity-[0.11]"
        viewBox="0 0 160 10"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="nerBottomWeave" width="20" height="10" patternUnits="userSpaceOnUse">
            <path d="M0 5 L5 0 L10 5 L15 0 L20 5" fill="none" stroke="#3E7C59" strokeWidth="1.5" />
            <path d="M0 5 L5 10 L10 5 L15 10 L20 5" fill="none" stroke="#E8A33D" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="160" height="10" fill="url(#nerBottomWeave)" />
      </svg>

      {variant === 'warm' && (
        <div className="absolute inset-0 bg-gradient-to-b from-amber/[0.03] via-transparent to-transparent" />
      )}
    </div>
  );
}
