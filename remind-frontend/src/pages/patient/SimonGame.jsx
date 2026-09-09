import { useEffect, useRef, useState } from 'react';
import PageShell from '../../components/PageShell';
import Button from '../../components/Button';
import VoiceButton from '../../components/VoiceButton';
import { speak } from '../../utils/voice';

const BUTTONS = [
  { id: 'sun', icon: '☀️', color: 'bg-amber' },
  { id: 'leaf', icon: '🍃', color: 'bg-sage' },
  { id: 'water', icon: '💧', color: 'bg-teal-light' },
  { id: 'flower', icon: '🌼', color: 'bg-rose' }
];

function randomId() { return BUTTONS[Math.floor(Math.random() * BUTTONS.length)].id; }

export default function SimonGame() {
  const [sequence, setSequence] = useState([]);
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(null);
  const [showing, setShowing] = useState(false);
  const [message, setMessage] = useState('Press Start to watch the pattern.');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function startRound(previous = []) {
    const next = [...previous, randomId()];
    setSequence(next);
    setIndex(0);
    setShowing(true);
    setMessage('Watch the pattern.');
    next.forEach((id, position) => setTimeout(() => {
      setActive(id);
      setTimeout(() => setActive(null), 360);
    }, position * 620));
    timer.current = setTimeout(() => {
      setShowing(false);
      setMessage('Now repeat the pattern.');
    }, next.length * 620 + 180);
  }

  function press(id) {
    if (showing || !sequence.length) return;
    setActive(id);
    setTimeout(() => setActive(null), 160);
    if (id !== sequence[index]) {
      setSequence([]);
      setMessage('Nice try. Press Start to try again.');
      speak('Nice try. Press Start to try again.');
      return;
    }
    if (index + 1 === sequence.length) {
      if (sequence.length === 5) {
        setSequence([]);
        setMessage('Wonderful memory!');
        speak('Wonderful memory.');
      } else {
        setMessage('Well done. Watch the next pattern.');
        timer.current = setTimeout(() => startRound(sequence), 800);
      }
    } else setIndex(index + 1);
  }

  return (
    <PageShell maxWidth="max-w-2xl" backTo="/game" backLabel="Back to games">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display text-teal font-semibold">Follow the Pattern</h1><p className="text-base text-charcoal/60 mt-1">Round {sequence.length || 0} of 5</p></div>
        <VoiceButton text="Watch the buttons, then press them in the same order." />
      </div>
      <p className="mt-8 text-center text-lg text-charcoal/75" role="status">{message}</p>
      <div className="grid grid-cols-2 gap-5 mt-6 max-w-md mx-auto">
        {BUTTONS.map((button) => <button key={button.id} type="button" disabled={showing || !sequence.length} onClick={() => press(button.id)} className={`${button.color} min-h-32 rounded-lg shadow-card text-4xl transition-all ${active === button.id ? 'brightness-150 scale-105' : ''} disabled:opacity-70`}>{button.icon}</button>)}
      </div>
      <div className="mt-14 flex justify-center"><Button onClick={() => startRound([])} disabled={showing}>{sequence.length ? 'Restart' : 'Start game'}</Button></div>
    </PageShell>
  );
}
