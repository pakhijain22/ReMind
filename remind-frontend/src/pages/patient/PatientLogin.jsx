import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import Button from '../../components/Button';
import VoiceButton from '../../components/VoiceButton';
import { loginPatient, ApiError } from '../../api/client';
import { usePatient } from '../../context/PatientContext';
import { speak } from '../../utils/voice';

export default function PatientLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setPatient, theme } = usePatient();
  const lightAction = theme === 'light'
    ? 'bg-[#eadcc7] text-charcoal border-2 border-[#7a5b43]'
    : 'bg-[#183939] text-[#f5ead8] border-2 border-[#8ed0bd]';

  useEffect(() => {
    speak('Enter your PIN to start playing.');
  }, []);

  function pressDigit(d) {
    if (pin.length >= 6) return;
    setPin((p) => p + d);
    setError('');
  }

  function backspace() {
    setPin((p) => p.slice(0, -1));
  }

  async function handleSubmit() {
    if (!pin) return;
    setLoading(true);
    setError('');
    try {
      const data = await loginPatient(pin);
      if (!data?.name) {
        throw new ApiError('The server returned an invalid patient profile. Please redeploy the backend and try again.', 502, null);
      }
      setPatient(data);
      speak(`Welcome back, ${data.name}. Ready to play?`);
      navigate('/home');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Let\'s try that again.';
      setError(message);
      speak(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell maxWidth="max-w-md" backTo="/" backLabel="Back to role selection">
      <div className="flex justify-end mb-4">
        <VoiceButton text="Enter your PIN to start playing." />
      </div>

      <h1 className="text-3xl font-display text-teal font-semibold text-center">Welcome back</h1>
      <p className="text-lg text-charcoal/60 text-center mt-2">Enter your PIN to continue</p>

      <div className="mt-8 flex justify-center gap-3" aria-live="polite">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-14 h-16 rounded-md shadow-card flex items-center justify-center text-3xl font-semibold ${lightAction}`}
          >
            {pin[i] ? '•' : ''}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-center text-rose mt-4 text-lg" role="alert">{error}</p>
      )}

      <div className="grid grid-cols-3 gap-3 mt-8">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => pressDigit(d)}
            className={`min-h-[56px] rounded-md shadow-card text-2xl font-semibold active:scale-[0.98] transition-transform ${lightAction}`}
          >
            {d}
          </button>
        ))}
        <button
          onClick={backspace}
          className={`min-h-[56px] rounded-md shadow-card text-xl font-semibold active:scale-[0.98] transition-transform ${lightAction}`}
        >
          ⌫
        </button>
        <button
          onClick={() => pressDigit('0')}
          className={`col-span-2 min-h-[56px] rounded-md shadow-card text-2xl font-semibold active:scale-[0.98] transition-transform ${lightAction}`}
        >
          0
        </button>
      </div>

      <div className="mt-20">
        <Button fullWidth disabled={loading || !pin} onClick={handleSubmit}>
          {loading ? 'Checking…' : 'Start'}
        </Button>
      </div>

      <div className="mt-8 grid gap-3 text-base">
        <button className={`min-h-12 rounded-md px-4 py-3 shadow-card ${lightAction}`} onClick={() => navigate('/create-pin')}>
          Create a PIN
        </button>
        <button
          className={`min-h-12 rounded-md px-4 py-3 shadow-card ${lightAction}`}
          onClick={() => {
            setError('If you forgot your PIN, please ask your caregiver to help you create a new patient profile.');
            speak('Please ask your caregiver to help you create a new patient profile.');
          }}
        >
          Forgot your PIN?
        </button>
      </div>
    </PageShell>
  );
}
