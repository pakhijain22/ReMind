import { useState } from 'react';
import PageShell from './PageShell';
import Button from './Button';
import { loginPatient, ApiError } from '../api/client';
import { useCaregiverPatient } from '../context/CaregiverContext';

// Shown once per device until a caregiver has looked up their patient by PIN.
// After that, every caregiver page reads the stored selection and skips this.
export default function CaregiverPatientGate({ children }) {
  const { caregiverPatient, setCaregiverPatient } = useCaregiverPatient();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (caregiverPatient) return children;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!pin) return;
    setLoading(true);
    setError('');
    try {
      const data = await loginPatient(pin);
      setCaregiverPatient(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not find that patient.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell maxWidth="max-w-md" backTo="/" backLabel="Back">
      <div className="mt-16 rounded-lg bg-[#f4ecde]/95 p-7 shadow-card dark:bg-[#183939]">
        <h1 className="text-2xl font-display text-teal font-semibold text-center dark:text-[#f5ead8]">Find your patient</h1>
        <p className="text-base text-charcoal/60 text-center mt-2 dark:text-[#d7e2d8]">Enter their PIN to open the caregiver dashboard</p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <input
          className="w-full rounded-md border border-charcoal/10 px-4 py-3 text-lg text-center tracking-widest bg-white/90 dark:border-[#5b8278] dark:bg-[#102f32] dark:text-[#f5ead8]"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          inputMode="numeric"
          placeholder="Patient PIN"
        />
        {error && <p className="text-rose text-center" role="alert">{error}</p>}
          <Button type="submit" fullWidth disabled={loading || !pin}>{loading ? 'Looking up…' : 'Continue'}</Button>
        </form>
      </div>
    </PageShell>
  );
}
