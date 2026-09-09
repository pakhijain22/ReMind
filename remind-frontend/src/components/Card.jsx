import { usePatient } from '../context/PatientContext';

// src/components/Card.jsx
//
// Soft elevation, never a hard border — this is what the design system calls
// for so the app reads as a real product rather than a wireframe.

export default function Card({ children, className = '', padded = true, animate = true }) {
  const { theme } = usePatient();

  return (
    <div
      className={[
        theme === 'light'
          ? 'bg-[#f4ecde]/95 border-amber/20'
          : 'bg-[#183939] border-[#3c6a63]',
        'backdrop-blur-sm rounded-lg shadow-card border',
        padded ? 'p-6' : '',
        animate ? 'animate-rise-in' : '',
        className
      ].join(' ')}
    >
      {children}
    </div>
  );
}
