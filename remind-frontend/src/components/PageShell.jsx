// src/components/PageShell.jsx
//
// Every page is wrapped in this. It carries the one signature motion the
// design system asks for (a soft cross-fade + 8px rise on load — nothing
// scattered beyond that) and the subtle NER background motif, so individual
// pages never have to remember to add either.

import NERBackground from './NERBackground';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { stopSpeaking } from '../utils/voice';

export default function PageShell({ children, maxWidth = 'max-w-3xl', bgVariant = 'default', backTo = null, backLabel = 'Back' }) {
  const navigate = useNavigate();

  useEffect(() => () => stopSpeaking(), []);

  return (
    <div className="min-h-screen w-full">
      <NERBackground variant={bgVariant} />
      <div className={`relative mx-auto ${maxWidth} px-5 py-8 animate-rise-in`}>
        <div className="mb-8 flex min-h-12 items-start justify-between gap-4">
          <button
            className="inline-flex items-center gap-2"
            aria-label="Go to ReMind home"
            onClick={() => navigate('/')}
          >
            <img src="/icons/logo.jpeg" alt="ReMind" className="h-12 w-12 rounded-full object-cover shadow-card" />
            <span className="font-display text-xl font-semibold text-teal">ReMind</span>
          </button>
          {backTo && (
            <button className="shrink-0 rounded-md bg-[#f4ecde]/90 px-3 py-2 text-base text-teal shadow-card dark:bg-[#183939] dark:text-[#f5ead8]" onClick={() => navigate(backTo)}>
              ← {backLabel}
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
