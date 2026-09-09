import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import Button from '../../components/Button';
import VoiceButton from '../../components/VoiceButton';
import { usePatient } from '../../context/PatientContext';
import { submitGameSession, getNextDifficulty } from '../../api/client';
import { speak } from '../../utils/voice';

// Pairs per level, per the blueprint: Level 1 = 4 cards, Level 2 = 6 cards, Level 3 = 8 cards.
const LEVEL_CARD_COUNT = { 1: 4, 2: 6, 3: 8 };

// A small, neutral icon set for the pattern-match game — motifs, not people or places.
const ICON_SET = ['🍵', '🎋', '🧣', '🏔️', '🌾', '🥁', '🦋', '🪈'];

function buildDeck(level) {
  const pairCount = LEVEL_CARD_COUNT[level] / 2;
  const icons = ICON_SET.slice(0, pairCount);
  const deck = [...icons, ...icons]
    .map((icon, i) => ({ id: `${icon}-${i}`, icon, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);
  return deck;
}

function makeClientRequestId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function Game() {
  const { patient } = usePatient();
  const navigate = useNavigate();

  const [level, setLevel] = useState(2);
  const [deck, setDeck] = useState(() => buildDeck(2));
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [lastResults, setLastResults] = useState([]); // "correct" | "wrong", most recent last
  const [roundMessage, setRoundMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const allMatched = useMemo(() => deck.every((c) => c.matched), [deck]);

  useEffect(() => {
    speak('Find the matching pairs. Tap two cards at a time.');
  }, []);

  function handleFlip(card) {
    if (card.flipped || card.matched || selected.length === 2) return;

    const updated = deck.map((c) => (c.id === card.id ? { ...c, flipped: true } : c));
    const nowSelected = [...selected, card.id];
    setDeck(updated);
    setSelected(nowSelected);

    if (nowSelected.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = nowSelected;
      const first = updated.find((c) => c.id === firstId);
      const second = updated.find((c) => c.id === secondId);

      setTimeout(() => {
        if (first.icon === second.icon) {
          setDeck((d) => d.map((c) => (c.id === firstId || c.id === secondId ? { ...c, matched: true } : c)));
        } else {
          setDeck((d) => d.map((c) => (c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c)));
        }
        setSelected([]);
      }, 700);
    }
  }

  useEffect(() => {
    if (allMatched && deck.length > 0) {
      finishRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMatched]);

  async function finishRound() {
    setSaving(true);
    const pairCount = LEVEL_CARD_COUNT[level] / 2;
    const optimalMoves = pairCount + 1; // a generous "did well" threshold
    const result = moves <= optimalMoves ? 'correct' : 'wrong';
    const score = Math.max(10, 100 - moves * 6);

    const updatedResults = [...lastResults, result].slice(-3);
    setLastResults(updatedResults);
    setRoundMessage(result === 'correct' ? 'Well done! That was a great round.' : "Nice try — let's try that again.");
    speak(result === 'correct' ? 'Well done! That was a great round.' : "Nice try. Let's try that again.");

    try {
      await submitGameSession({
        patientId: patient.id,
        difficultyLevel: level,
        moves,
        score,
        completedAt: new Date().toISOString(),
        clientRequestId: makeClientRequestId(),
        gameType: 'pattern-match'
      });
    } catch {
      // Fails gently — the round still counts locally even if the save didn't go through yet.
    }

    let nextLevel = level;
    if (updatedResults.length === 3) {
      try {
        const aiResult = await getNextDifficulty({ currentLevel: level, lastThreeResults: updatedResults });
        nextLevel = aiResult.nextLevel;
      } catch {
        // Fall back to the same rule locally if the AI call fails, so the game never stalls.
        const allCorrect = updatedResults.every((r) => r === 'correct');
        const allWrong = updatedResults.every((r) => r === 'wrong');
        if (allCorrect) nextLevel = Math.min(level + 1, 3);
        if (allWrong) nextLevel = Math.max(level - 1, 1);
      }
    }

    setTimeout(() => {
      setLevel(nextLevel);
      setDeck(buildDeck(nextLevel));
      setMoves(0);
      setSelected([]);
      setRoundMessage('');
      setSaving(false);
    }, 1800);
  }

  const progress = deck.length ? Math.round((deck.filter((c) => c.matched).length / deck.length) * 100) : 0;

  return (
    <PageShell maxWidth="max-w-2xl" backTo="/game" backLabel="Back to Games">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-teal font-semibold">Memory Game</h1>
          <p className="text-base text-charcoal/60 mt-1">Level {level} of 3</p>
        </div>
        <VoiceButton text="Find the matching pairs. Tap two cards at a time." />
      </div>

      {/* Progress shown as a filling sun, never a countdown clock */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">🌞</span>
        <div className="flex-1 h-3 bg-white/70 rounded-full overflow-hidden shadow-card">
          <div className="h-full bg-amber transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {roundMessage && (
        <p className="mt-4 text-center text-xl text-sage font-semibold" role="status">{roundMessage}</p>
      )}

      <div
        className="mt-6 grid gap-4"
        style={{ gridTemplateColumns: `repeat(${deck.length <= 4 ? 2 : deck.length <= 6 ? 3 : 4}, minmax(0, 1fr))` }}
      >
        {deck.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFlip(card)}
            disabled={card.matched || saving}
            className={[
              'aspect-square rounded-md shadow-card text-4xl flex items-center justify-center',
              'transition-transform active:scale-[0.96]',
              card.matched ? 'bg-sage-light' : card.flipped ? 'bg-amber/20' : 'bg-teal text-teal'
            ].join(' ')}
          >
            {(card.flipped || card.matched) ? card.icon : ''}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="ghost" onClick={() => navigate('/home')}>End session</Button>
      </div>
    </PageShell>
  );
}
