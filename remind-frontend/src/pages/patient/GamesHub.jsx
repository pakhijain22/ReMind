import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import Tile from '../../components/Tile';
import VoiceButton from '../../components/VoiceButton';

export default function GamesHub() {
  const navigate = useNavigate();
  return (
    <PageShell backTo="/home" backLabel="Back to menu">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-teal font-semibold">Memory Games</h1>
          <p className="text-base text-charcoal/60 mt-1">Choose a gentle game to play.</p>
        </div>
        <VoiceButton text="Choose a memory game to play." />
      </div>
      <div className="mt-8 flex flex-col gap-5">
        <Tile icon="🧩" label="Find the Pairs" sublabel="Match pictures that belong together" accent="teal" onClick={() => navigate('/game/pattern-match')} />
        <Tile icon="🔴" label="Follow the Pattern" sublabel="Watch the lights, then repeat the sequence" accent="amber" onClick={() => navigate('/game/simon')} />
        <Tile icon="🌿" label="Remember the Missing Tile" sublabel="Look carefully, then find what changed" accent="sage" onClick={() => navigate('/game/missing-tile')} />
      </div>
    </PageShell>
  );
}
