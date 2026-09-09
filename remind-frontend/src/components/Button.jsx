import { usePatient } from '../context/PatientContext';

// src/components/Button.jsx
//
// One button component, used everywhere, so touch targets, press feedback,
// and colour usage stay consistent. Minimum 56px tall on the "large" size
// used throughout patient-facing screens.

const VARIANTS = {
  primary: 'bg-teal text-offwhite hover:bg-teal-dark',
  amber: 'bg-amber text-charcoal hover:bg-amber-dark',
  outline: 'bg-transparent text-teal border-2 border-teal hover:bg-teal/5',
  danger: 'bg-rose text-offwhite hover:bg-rose/90',
  ghost: 'bg-transparent text-teal hover:bg-teal/5'
};

const SIZES = {
  large: 'min-h-[56px] px-8 text-xl',
  medium: 'min-h-[48px] px-6 text-base',
  small: 'min-h-[40px] px-4 text-sm'
};

const LIGHT_ACCENT_BORDERS = {
  teal: 'border-teal',
  amber: 'border-amber-dark',
  sage: 'border-sage'
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'large',
  icon = null,
  fullWidth = false,
  disabled = false,
  type = 'button'
}) {
  const { theme, accent } = usePatient();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-3 rounded-md font-body font-semibold',
        'transition-transform duration-150 active:scale-[0.98]',
        'shadow-card disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        theme === 'light'
          ? `bg-[#eadcc7] text-charcoal border-2 ${LIGHT_ACCENT_BORDERS[accent] || LIGHT_ACCENT_BORDERS.teal} hover:bg-[#f3e8d5]`
          : VARIANTS[variant],
        SIZES[size],
        fullWidth ? 'w-full' : ''
      ].join(' ')}
    >
      {icon && <span className="text-2xl leading-none" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
