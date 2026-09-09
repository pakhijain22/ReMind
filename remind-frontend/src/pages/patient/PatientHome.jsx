import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import Tile from '../../components/Tile';
import VoiceButton from '../../components/VoiceButton';
import { usePatient } from '../../context/PatientContext';
import { getReminders } from '../../api/client';

function timeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function PatientHome() {
  const { patient, logout, theme } = usePatient();
  const navigate = useNavigate();
  const [dueReminder, setDueReminder] = useState(null);

  useEffect(() => {
    if (!patient) return;
    getReminders(patient.id)
      .then((reminders) => {
        const pending = reminders.find((r) => r.status === 'pending');
        setDueReminder(pending || null);
      })
      .catch(() => setDueReminder(null));
  }, [patient]);

  const greeting = `${timeOfDayGreeting()}, ${patient?.name || ''}`;
  const narration = dueReminder
    ? `${greeting}. You have a ${dueReminder.type} reminder coming up.`
    : `${greeting}. What would you like to do today?`;

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-teal font-semibold">{greeting}</h1>
          <p className={`text-lg mt-1 ${theme === 'light' ? 'text-charcoal/75 font-medium' : 'text-charcoal/60'}`}>What would you like to do today?</p>
        </div>
        <VoiceButton text={narration} />
      </div>

      {dueReminder && (
        <button
          onClick={() => navigate('/reminders')}
          className="mt-6 w-full text-left bg-alert-light rounded-lg p-5 flex items-center gap-4 shadow-card active:scale-[0.98] transition-transform"
        >
          <span className="text-3xl" aria-hidden="true">⏰</span>
          <span className="text-lg text-charcoal">
            You have a <strong className="capitalize">{dueReminder.type}</strong> reminder — "{dueReminder.label}" at {dueReminder.scheduledTime}
          </span>
        </button>
      )}

      <div className="mt-8 flex flex-col gap-4">
        <Tile
          icon="🧩"
          label="Play the Memory Game"
          sublabel="A gentle pattern game that adjusts to you"
          accent="teal"
          onClick={() => navigate('/game')}
        />
        <Tile
          icon="⏰"
          label="Today's Reminders"
          sublabel="Medicine, water, meals, and appointments"
          accent="amber"
          onClick={() => navigate('/reminders')}
        />
        <Tile
          icon="📷"
          label="Your Memories"
          sublabel="Photos and stories you've saved"
          accent="sage"
          onClick={() => navigate('/memories')}
        />
        <Tile
          icon="⚙️"
          label="Settings"
          sublabel="Change theme, text size, and accent color"
          accent="teal"
          onClick={() => navigate('/settings')}
        />
      </div>

      <button
        onClick={() => { logout(); navigate('/'); }}
        className={`mt-10 mx-auto block rounded-md border-2 px-4 py-2 text-base font-semibold shadow-card ${theme === 'light' ? 'border-[#7a5b43] bg-[#eadcc7] text-charcoal' : 'border-[#8ed0bd] bg-[#183939] text-[#f5ead8]'}`}
      >
        Switch profile
      </button>
    </PageShell>
  );
}
