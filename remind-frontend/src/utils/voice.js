// src/utils/voice.js
//
// Thin wrapper around the Web Speech API. Every patient-facing screen has a
// speaker icon (VoiceButton) that reads text aloud on tap — this is the one
// function that does the actual speaking, so tone/rate/voice selection stays
// consistent everywhere.

export function speak(text) {
  if (!('speechSynthesis' in window)) return;

  // Cancel anything currently being read so taps don't stack up queued speech.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92; // slightly slower — easier to follow for elderly listeners
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSupported() {
  return 'speechSynthesis' in window;
}
