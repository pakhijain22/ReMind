// src/components/VoiceButton.jsx
//
// The speaker icon required on every patient-facing screen (design system,
// Chapter 02: "Voice narration available on every patient-facing screen").
// Tapping it reads `text` aloud; tapping again stops it.

import { useState, useEffect } from 'react';
import { speak, stopSpeaking, isSpeechSupported } from '../utils/voice';

export default function VoiceButton({ text, label = 'Read this screen aloud' }) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!isSpeechSupported()) return;
    const check = setInterval(() => {
      setSpeaking(window.speechSynthesis.speaking);
    }, 300);
    return () => clearInterval(check);
  }, []);

  if (!isSpeechSupported()) return null;

  function handleClick() {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      speak(text);
      setSpeaking(true);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={[
        'flex items-center justify-center w-14 h-14 rounded-full shadow-card',
        'transition-transform duration-150 active:scale-[0.98]',
        speaking ? 'bg-amber text-charcoal animate-pulse-soft' : 'bg-white/90 text-teal dark:bg-[#244b49] dark:text-[#f5ead8]'
      ].join(' ')}
    >
      <span className="text-2xl" aria-hidden="true">{speaking ? '🔊' : '🔈'}</span>
    </button>
  );
}
