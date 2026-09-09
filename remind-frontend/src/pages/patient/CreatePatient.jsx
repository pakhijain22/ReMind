import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import Button from '../../components/Button';
import { ApiError, createPatient } from '../../api/client';
import { usePatient } from '../../context/PatientContext';

export default function CreatePatient() {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setPatient } = usePatient();

  async function handleSubmit(event) {
    event.preventDefault();
    if (pin.length !== 4) {
      setError('Your PIN must be 4 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setError('The PINs do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const patient = await createPatient({ name: name.trim(), loginPin: pin, preferredLanguage: 'English' });
      if (!patient?.id || !patient?.name) {
        throw new ApiError('The server returned an invalid patient profile. Please redeploy the backend and try again.', 502, null);
      }
      setPatient(patient);
      navigate('/home');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell maxWidth="max-w-md" backTo="/login" backLabel="Back to login">
      <h1 className="text-3xl font-display text-teal font-semibold text-center mt-6">Create your PIN</h1>
      <p className="text-lg text-charcoal/60 text-center mt-2">Use this PIN whenever you come back to ReMind.</p>

      <form className="mt-8" onSubmit={handleSubmit}>
        <label className="block text-lg font-semibold text-charcoal" htmlFor="patient-name">Your name</label>
        <input
          id="patient-name"
          className="mt-2 w-full rounded-md bg-white/90 shadow-card px-4 py-3 text-lg"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
        />

        <label className="block text-lg font-semibold text-charcoal mt-5" htmlFor="new-pin">4-digit PIN</label>
        <input
          id="new-pin"
          className="mt-2 w-full rounded-md bg-white/90 shadow-card px-4 py-3 text-lg tracking-[0.5em]"
          type="password"
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength="4"
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
          required
          autoComplete="new-password"
        />

        <label className="block text-lg font-semibold text-charcoal mt-5" htmlFor="confirm-pin">Confirm PIN</label>
        <input
          id="confirm-pin"
          className="mt-2 w-full rounded-md bg-white/90 shadow-card px-4 py-3 text-lg tracking-[0.5em]"
          type="password"
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength="4"
          value={confirmPin}
          onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
          required
          autoComplete="new-password"
        />

        {error && <p className="text-center text-rose mt-4 text-lg" role="alert">{error}</p>}
        <Button type="submit" className="mt-8" fullWidth disabled={loading || !name.trim() || pin.length !== 4 || confirmPin.length !== 4}>
          {loading ? 'Creating…' : 'Create PIN'}
        </Button>
      </form>
    </PageShell>
  );
}