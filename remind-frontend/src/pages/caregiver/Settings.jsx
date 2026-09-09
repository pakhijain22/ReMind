import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { usePatient } from '../../context/PatientContext';
import { useCaregiverPatient } from '../../context/CaregiverContext';
import { flushOfflineQueue, getQueuedCounts } from '../../utils/offlineQueue';

const TEXT_SIZES = [
  { key: 'a-minus', label: 'A−' },
  { key: 'a', label: 'A' },
  { key: 'a-plus', label: 'A+' },
  { key: 'a-plus-plus', label: 'A++' }
];

const ACCENTS = [
  { key: 'teal', label: 'Teal', className: 'border-teal bg-teal/10 text-teal' },
  { key: 'amber', label: 'Amber', className: 'border-amber-dark bg-amber/15 text-amber-dark' },
  { key: 'sage', label: 'Sage', className: 'border-sage bg-sage-light text-sage' }
];

export default function Settings({ mode = 'caregiver' }) {
  const { textSize, setTextSize, theme, setTheme, accent, setAccent, patient, logout } = usePatient();
  const { caregiverPatient, clearCaregiverPatient } = useCaregiverPatient();
  const navigate = useNavigate();

  const [isStandalone] = useState(window.matchMedia('(display-mode: standalone)').matches);
  const [notifPermission, setNotifPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [queuedCounts, setQueuedCounts] = useState({ reminderUpdates: 0, newMemories: 0 });
  const [lastSync, setLastSync] = useState(localStorage.getItem('remind.lastSync'));
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    getQueuedCounts().then(setQueuedCounts).catch(() => {});
  }, []);

  async function handleNotifPermission() {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
  }

  async function handleSyncNow() {
    setSyncing(true);
    try {
      await flushOfflineQueue();
      const now = new Date().toISOString();
      localStorage.setItem('remind.lastSync', now);
      setLastSync(now);
      setQueuedCounts(await getQueuedCounts());
    } catch {
      // Stays queued locally — will retry next time Sync Now is tapped, or once back online.
    } finally {
      setSyncing(false);
    }
  }

  return (
    <PageShell maxWidth="max-w-xl" backTo={mode === 'patient' ? '/home' : '/caregiver'} backLabel={mode === 'patient' ? 'Back to patient home' : 'Back to caregiver home'}>
      <h1 className="text-2xl font-display text-teal font-semibold">Settings</h1>

      <Card className="mt-6">
        <p className="text-lg font-semibold text-charcoal mb-3">Text size</p>
        <div className="grid grid-cols-4 gap-3">
          {TEXT_SIZES.map((s) => (
            <button
              key={s.key}
              onClick={() => setTextSize(s.key)}
              className={[
                'flex-1 min-h-[48px] rounded-md shadow-card font-semibold',
                theme === 'light'
                  ? 'bg-[#eadcc7] text-charcoal border-2 border-[#7a5b43] hover:bg-[#f3e8d5]'
                  : 'bg-[#244b49] text-[#f5ead8]'
                  , textSize === s.key && 'ring-2 ring-amber'
              ].join(' ')}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-lg font-semibold text-charcoal mb-3">Accent color</p>
        <div className="grid grid-cols-3 gap-3">
          {ACCENTS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setAccent(option.key)}
              className={`min-h-12 rounded-md border-2 px-3 py-2 font-semibold ${option.className} ${accent === option.key ? 'ring-2 ring-charcoal/40' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mt-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-charcoal">Display theme</p>
            <p className="text-base text-charcoal/70 mt-1">Choose a brighter or darker reading environment.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={theme === 'dark'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={theme === 'light'
              ? 'shrink-0 rounded-md bg-[#eadcc7] px-4 py-3 text-base font-semibold text-charcoal border-2 border-[#7a5b43] shadow-card'
              : 'shrink-0 rounded-md bg-teal px-4 py-3 text-base font-semibold text-offwhite shadow-card'}
          >
            {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-lg font-semibold text-charcoal mb-3">Offline & Sync</p>
        <p className="text-base text-charcoal/70">Install status: {isStandalone ? 'Installed' : 'Not installed'}</p>
        <p className="text-base text-charcoal/70 mt-1">Queued updates: {queuedCounts.reminderUpdates + queuedCounts.newMemories}</p>
        <p className="text-base text-charcoal/70 mt-1">Last sync: {lastSync ? new Date(lastSync).toLocaleString() : 'Never'}</p>
        <div className="mt-5 flex justify-start">
          <Button size="small" onClick={handleSyncNow} disabled={syncing}>{syncing ? 'Syncing…' : 'Sync Now'}</Button>
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-lg font-semibold text-charcoal mb-3">Notifications</p>
        <p className="text-base text-charcoal/70 capitalize">Status: {notifPermission}</p>
        {notifPermission === 'default' && (
          <div className="mt-4 flex justify-start">
            <Button size="small" variant="outline" onClick={handleNotifPermission}>Enable notifications</Button>
          </div>
        )}
      </Card>

      <Card className="mt-4">
        <p className="text-lg font-semibold text-charcoal mb-3">Profiles</p>
        {patient && (
          <div className="flex items-center justify-between">
            <p className="text-base text-charcoal/70">Patient: {patient.name}</p>
            <button className="text-sm text-rose underline" onClick={() => { logout(); navigate('/'); }}>Log out</button>
          </div>
        )}
        {caregiverPatient && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-base text-charcoal/70">Caregiver viewing: {caregiverPatient.name}</p>
            <button className="text-sm text-rose underline" onClick={clearCaregiverPatient}>Switch patient</button>
          </div>
        )}
        {!patient && !caregiverPatient && (
          <p className="text-base text-charcoal/60">No profile is currently active.</p>
        )}
      </Card>
    </PageShell>
  );
}
