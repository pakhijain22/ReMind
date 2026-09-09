import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import Button from '../../components/Button';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'as', label: 'অসমীয়া (Assamese) — coming soon', disabled: true },
  { code: 'kha', label: 'Khasi — coming soon', disabled: true }
];

export default function Landing() {
  const navigate = useNavigate();
  const [installEvent, setInstallEvent] = useState(null);
  const [installDismissed, setInstallDismissed] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    function handler(e) {
      e.preventDefault();
      setInstallEvent(e);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  async function handleInstall() {
    if (installEvent) {
      installEvent.prompt();
      await installEvent.userChoice;
      setInstallEvent(null);
    } else if (isIos) {
      setShowIosHelp(true);
    }
  }

  const showInstallBanner = !installDismissed && !isStandalone && (installEvent || isIos);

  return (
    <PageShell maxWidth="max-w-xl">
      <div className="flex flex-col items-center text-center pt-10">
        <h1 className="font-display text-5xl text-teal font-semibold">ReMind</h1>
        <p className="mt-3 text-xl text-charcoal/80 font-medium">A gentle companion for memory and mind</p>
      </div>

      <div className="flex items-center justify-end mt-6">
        <label className="sr-only" htmlFor="lang">Language</label>
        <select
          id="lang"
          className="bg-white/90 rounded-sm px-4 py-2 text-base shadow-card border-0"
          defaultValue="en"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code} disabled={l.disabled}>{l.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-10 flex flex-col gap-5">
        <button
          onClick={() => navigate('/login')}
          className="text-left bg-white/90 rounded-lg shadow-card p-7 min-h-[56px] flex items-center gap-5 transition-transform active:scale-[0.98] hover:shadow-soft"
        >
          <span className="text-4xl" aria-hidden="true">🧑</span>
          <span>
            <p className="text-2xl font-semibold text-charcoal">I am a Patient</p>
            <p className="text-base text-charcoal/60 mt-1">Play, remember, and see today's reminders</p>
          </span>
        </button>

        <button
          onClick={() => navigate('/caregiver')}
          className="text-left bg-white/90 rounded-lg shadow-card p-7 min-h-[56px] flex items-center gap-5 transition-transform active:scale-[0.98] hover:shadow-soft"
        >
          <span className="text-4xl" aria-hidden="true">👨‍👩‍👧</span>
          <span>
            <p className="text-2xl font-semibold text-charcoal">I am a Caregiver / Family Member</p>
            <p className="text-base text-charcoal/60 mt-1">Monitor progress and manage reminders</p>
          </span>
        </button>
      </div>

      {showInstallBanner && (
        <div className="mt-10 bg-teal/5 border border-teal/20 rounded-md p-4 flex items-center justify-between gap-4">
          <p className="text-base text-charcoal/80">Install ReMind on this device for quick, full-screen access.</p>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="small" onClick={handleInstall}>Install</Button>
            <button
              className="text-sm text-charcoal/50 underline"
              onClick={() => setInstallDismissed(true)}
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {showIosHelp && (
        <div className="fixed inset-0 bg-charcoal/40 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-soft p-6 max-w-sm w-full">
            <p className="text-lg font-semibold mb-2">Install ReMind</p>
            <p className="text-base text-charcoal/70">
              Tap the Share icon in Safari, then choose "Add to Home Screen."
            </p>
            <Button className="mt-5" fullWidth onClick={() => setShowIosHelp(false)}>Got it</Button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
