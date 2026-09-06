import React from 'react'

/**
 * Speaker icon that reads given text aloud using the browser's
 * built-in Web Speech API (SpeechSynthesis). Required on every
 * patient-facing screen per the design system.
 */
export default function VoiceButton({ text, label = 'Read this screen aloud' }) {
  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Voice narration is not supported on this device.')
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  return (
    <button
      onClick={speak}
      aria-label={label}
      className="min-h-touch min-w-touch rounded-full bg-teal text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
    >
      <span className="text-2xl" aria-hidden="true">🔊</span>
    </button>
  )
}
