import { useEffect, useState } from 'react';
import PageShell from '../../components/PageShell';
import Button from '../../components/Button';
import VoiceButton from '../../components/VoiceButton';
import { usePatient } from '../../context/PatientContext';
import { getReminders, updateReminderStatus } from '../../api/client';
import { queueReminderUpdate } from '../../utils/offlineQueue';
import { speak } from '../../utils/voice';

const TYPE_ICON = { medicine: '💊', hydration: '💧', meal: '🍽️', appointment: '📅' };

export default function Reminders() {
  const { patient, theme } = usePatient();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!patient) return;
    load();
  }, [patient]);

  async function load() {
    setLoading(true);
    try {
      const data = await getReminders(patient.id);
      setReminders(data);
    } catch {
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }

  async function markDone(reminder) {
    setUpdatingId(reminder.id);
    setReminders((rs) => rs.map((r) => (r.id === reminder.id ? { ...r, status: 'done' } : r)));
    speak(`${reminder.label} marked as done. Well done.`);

    try {
      if (navigator.onLine) {
        await updateReminderStatus(reminder.id, 'done');
      } else {
        await queueReminderUpdate(reminder.id, 'done');
      }
    } catch {
      await queueReminderUpdate(reminder.id, 'done');
    } finally {
      setUpdatingId(null);
    }
  }

  const narration = reminders.length
    ? `You have ${reminders.filter((r) => r.status === 'pending').length} reminders left today.`
    : 'You have no reminders today.';

  return (
    <PageShell backTo="/home" backLabel="Back to menu">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display text-teal font-semibold">Today's Reminders</h1>
        <VoiceButton text={narration} />
      </div>

      {loading && <p className="mt-6 text-lg text-charcoal/60">Loading your reminders…</p>}

      {!loading && reminders.length === 0 && (
        <p className="mt-6 text-lg text-charcoal/60">Nothing scheduled for today. Enjoy your day!</p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {reminders.map((r) => (
          <div
            key={r.id}
            className={[
              'flex items-center gap-4 rounded-lg shadow-card p-5',
              theme === 'dark'
                ? 'bg-[#183939] border border-[#8ed0bd] text-[#f5ead8]'
                : r.status === 'done' ? 'bg-sage-light border border-sage' : r.status === 'missed' ? 'bg-rose-light border border-rose' : 'bg-[#eadcc7] border border-[#7a5b43]'
            ].join(' ')}
          >
            <span className="text-3xl" aria-hidden="true">{TYPE_ICON[r.type] || '⏰'}</span>
            <div className="flex-1">
              <p className="text-xl font-semibold text-charcoal">{r.label}</p>
              <p className="text-base text-charcoal/60">{r.weekday} · {r.scheduledTime}</p>
            </div>
            {r.status === 'pending' ? (
              <Button size="medium" onClick={() => markDone(r)} disabled={updatingId === r.id}>
                Mark as done
              </Button>
            ) : (
              <span className="text-base font-semibold text-charcoal/60 capitalize">{r.status}</span>
            )}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
