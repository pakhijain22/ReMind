import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import PageShell from '../../components/PageShell';
import Card from '../../components/Card';
import Button from '../../components/Button';
import CaregiverPatientGate from '../../components/CaregiverPatientGate';
import { useCaregiverPatient } from '../../context/CaregiverContext';
import { getDashboardSummary, getScoreHistory, getReminiscenceHistory } from '../../api/client';

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (typeof target !== 'number') return;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

function SummaryCard({ label, value, suffix = '' }) {
  const animated = useCountUp(typeof value === 'number' ? value : 0);
  return (
    <Card className="text-center">
      <p className="text-3xl font-display font-semibold text-teal">{typeof value === 'number' ? animated : value}{suffix}</p>
      <p className="text-sm text-charcoal/60 mt-1">{label}</p>
    </Card>
  );
}

function DashboardContent() {
  const { caregiverPatient, clearCaregiverPatient } = useCaregiverPatient();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [scores, setScores] = useState([]);
  const [sessions, setSessions] = useState(null);

  useEffect(() => {
    if (!caregiverPatient) return;
    getDashboardSummary(caregiverPatient.id).then(setSummary).catch(() => setSummary(null));
    getScoreHistory(caregiverPatient.id)
      .then((data) => setScores([...data].reverse()))
      .catch(() => setScores([]));
  }, [caregiverPatient]);

  async function openSessions() {
    try {
      const data = await getReminiscenceHistory(caregiverPatient.id);
      setSessions(data);
    } catch {
      setSessions([]);
    }
  }

  return (
    <PageShell maxWidth="max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-teal font-semibold">Caregiver Dashboard</h1>
          <p className="text-base text-charcoal/60 mt-1">Viewing {caregiverPatient.name}</p>
        </div>
        <button className="text-sm text-charcoal/50 underline" onClick={clearCaregiverPatient}>Switch patient</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <SummaryCard label="Reminders done today" value={summary ? `${summary.remindersCompletedToday}/${summary.remindersTotalToday}` : '—'} />
        <SummaryCard label="Latest score" value={summary?.latestScore ?? '—'} />
        <SummaryCard label="Current difficulty" value={summary?.currentDifficultyLevel ?? '—'} />
        <SummaryCard label="Memories saved" value={summary?.totalMemoriesSaved ?? '—'} />
      </div>

      <Card className="mt-6">
        <p className="text-lg font-semibold text-charcoal mb-3">Recent memory-recall performance</p>
        {scores.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={scores}>
              <XAxis dataKey="completedAt" tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip labelFormatter={(v) => new Date(v).toLocaleString()} />
              <Line type="monotone" dataKey="score" stroke="#0F5257" strokeWidth={2} dot={{ r: 3 }} isAnimationActive />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-base text-charcoal/60">No game sessions recorded yet.</p>
        )}
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Button variant="outline" onClick={() => navigate('/caregiver/reminders')}>Manage Reminders</Button>
        <Button variant="outline" onClick={() => navigate('/caregiver/analytics')}>View Analytics</Button>
        <Button variant="outline" onClick={openSessions}>Reminiscence Sessions</Button>
        <Button variant="outline" onClick={() => navigate('/caregiver/settings')}>Settings</Button>
      </div>

      {sessions && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xl font-semibold text-charcoal">Reminiscence Sessions</p>
              <button className="text-charcoal/50" onClick={() => setSessions(null)}>✕</button>
            </div>
            {sessions.length === 0 && <p className="text-charcoal/60">No sessions saved yet.</p>}
            {sessions.map((s) => (
              <div key={s.id} className="border-b border-charcoal/10 py-3">
                <p className="text-sm text-charcoal/50">{new Date(s.createdAt).toLocaleDateString()}</p>
                <ul className="mt-1 list-disc list-inside text-charcoal">
                  {s.questions.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            ))}
          </Card>
        </div>
      )}
    </PageShell>
  );
}

export default function CaregiverDashboard() {
  return (
    <CaregiverPatientGate>
      <DashboardContent />
    </CaregiverPatientGate>
  );
}
