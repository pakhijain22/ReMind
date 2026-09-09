import { useState } from 'react';
import PageShell from '../../components/PageShell';
import Button from '../../components/Button';
import VoiceButton from '../../components/VoiceButton';
import { speak } from '../../utils/voice';

const SYMBOLS = ['🍵', '🎋', '🦋', '🌾', '🥁', '🌼'];
function makeRound() {
  const visible = [...SYMBOLS].sort(() => Math.random() - 0.5);
  return { visible, missing: visible[Math.floor(Math.random() * visible.length)] };
}

export default function MissingTileGame() {
  const [round, setRound] = useState(makeRound);
  const [hidden, setHidden] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState('Look carefully at the tiles.');
  const [score, setScore] = useState(0);

  function start() {
    setRound(makeRound());
    setHidden(false);
    setPlaying(true);
    setMessage('Remember the tiles.');
    setTimeout(() => { setHidden(true); setMessage('Which tile is missing?'); }, 2200);
  }

  function choose(symbol) {
    if (!hidden || !playing) return;
    setPlaying(false);
    if (symbol === round.missing) { setScore((value) => value + 1); setMessage('Well remembered!'); speak('Well remembered.'); }
    else { setMessage(`Nice try. It was ${round.missing}.`); speak('Nice try.'); }
  }

  return (
    <PageShell maxWidth="max-w-2xl" backTo="/game" backLabel="Back to games">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display text-teal font-semibold">Remember the Missing Tile</h1><p className="text-base text-charcoal/60 mt-1">Score: {score}</p></div>
        <VoiceButton text="Look at the tiles, remember them, and find the missing one." />
      </div>
      <p className="mt-8 text-center text-lg text-charcoal/75" role="status">{message}</p>
      <div className="grid grid-cols-3 gap-5 mt-6 max-w-md mx-auto">
        {(hidden ? round.visible.filter((symbol) => symbol !== round.missing) : round.visible).map((symbol) => <div key={symbol} className="aspect-square rounded-lg bg-[#eadcc7] dark:bg-[#183939] border-2 border-[#7a5b43] dark:border-[#8ed0bd] shadow-card flex items-center justify-center text-4xl">{hidden ? '🌿' : symbol}</div>)}
      </div>
      {hidden && <div className="mt-8"><p className="text-center text-base text-charcoal/70 mb-3">Choose the missing tile</p><div className="flex flex-wrap justify-center gap-4">{SYMBOLS.map((symbol) => <button key={symbol} type="button" onClick={() => choose(symbol)} disabled={!playing} className="w-16 h-16 rounded-lg bg-[#eadcc7] dark:bg-[#183939] border-2 border-[#7a5b43] dark:border-[#8ed0bd] shadow-card text-3xl disabled:opacity-60">{symbol}</button>)}</div></div>}
      <div className="mt-14 flex justify-center"><Button onClick={start} disabled={playing}>{playing ? 'Remembering…' : 'Start round'}</Button></div>
    </PageShell>
  );
}
