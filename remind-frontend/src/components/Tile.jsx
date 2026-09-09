import { usePatient } from '../context/PatientContext';

// src/components/Tile.jsx
//
// Large tappable activity tiles used on the Patient Home screen and similar
// "pick one of these" moments. Icon + text always paired, per the design
// system's accessibility rule (never icon-only on patient screens).

export default function Tile({ icon, label, sublabel, onClick, disabled = false, accent = 'teal' }) {
  const { theme } = usePatient();
  const accentClasses = {
    teal: 'bg-teal/10 text-teal',
    amber: 'bg-amber/15 text-amber-dark',
    sage: 'bg-sage-light text-sage'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'w-full text-left rounded-lg shadow-card border p-6',
        theme === 'light' ? 'bg-[#eadcc7] border-[#7a5b43]' : 'bg-[#183939] border-[#3c6a63]',
        'flex items-center gap-5 min-h-[88px]',
        'transition-transform duration-150 active:scale-[0.98]',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-soft'
      ].join(' ')}
    >
      <div className={`flex items-center justify-center w-16 h-16 rounded-md text-3xl ${accentClasses[accent]}`} aria-hidden="true">
        {icon}
      </div>
      <div>
        <p className="text-xl font-semibold text-charcoal">{label}</p>
        {sublabel && <p className="text-base text-charcoal/60 mt-1">{sublabel}</p>}
      </div>
    </button>
  );
}
