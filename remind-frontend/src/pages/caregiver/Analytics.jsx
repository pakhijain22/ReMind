import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import PageShell from '../../components/PageShell';
import Card from '../../components/Card';
import CaregiverPatientGate from '../../components/CaregiverPatientGate';
import { useCaregiverPatient } from '../../context/CaregiverContext';
import { getScoreHistory, getAdherenceInsight, getReminderLogs } from '../../api/client';

function AnalyticsContent() {
  const { caregiverPatient } = useCaregiverPatient();
  const [scores, setScores] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    if (!caregiverPatient) return;
    getScoreHistory(caregiverPatient.id).then((d) => setScores([...d].reverse())).catch(() => setScores([]));

    getAdherenceInsight(caregiverPatient.id)
      .then((r) => setInsights(r.insights || []))
      .catch(() => {
        // Fall back to computing the same rule client-side from raw logs,
        // so the caregiver still sees something useful if the AI route
        // isn't reachable yet.
        getReminderLogs(caregiverPatient.id)
          .then((logs) => {
            const misses = {};
            logs.filter((l) => l.status === 'missed').forEach((l) => {
              const key = `${l.type}-${l.weekday}`;
              misses[key] = (misses[key] || 0) + 1;
            });
            const derived = Object.entries(misses)
              .filter(([, count]) => count >= 2)
              .map(([key]) => `Reminder often missed on ${key.split('-')[1]} — consider adjusting the time.`);
            setInsights(derived);
          })
          .catch(() => setInsights([]));
      })
      .finally(() => setLoadingInsights(false));
  }, [caregiverPatient]);

  const sessionsByLevel = [1, 2, 3].map((level) => ({
    level: `Level ${level}`,
    count: scores.filter((s) => s.difficultyLevel === level).length
  }));

  return (
    <PageShell maxWidth="max-w-3xl" backTo="/caregiver" backLabel="Back to caregiver home">
      <h1 className="text-2xl font-display text-teal font-semibold">Progress Detail</h1>

      <Card className="mt-6">
        <p className="text-lg font-semibold text-charcoal mb-3">Score trend</p>
        {scores.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={scores}>
              <XAxis dataKey="completedAt" tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip labelFormatter={(v) => new Date(v).toLocaleString()} />
              <Line type="monotone" dataKey="score" stroke="#0F5257" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-base text-charcoal/60">No sessions recorded yet.</p>
        )}
      </Card>

      <Card className="mt-6">
        <p className="text-lg font-semibold text-charcoal mb-3">Sessions completed by difficulty</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sessionsByLevel}>
            <XAxis dataKey="level" fontSize={12} />
            <YAxis fontSize={12} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#E8A33D" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="mt-6 bg-alert-light">
        <p className="text-lg font-semibold text-charcoal mb-2">Predictive Medication Adherence</p>
        {loadingInsights && <p className="text-base text-charcoal/60">Checking reminder history…</p>}
        {!loadingInsights && insights.length === 0 && (
          <p className="text-base text-charcoal/70">No concerning patterns found — adherence looks steady.</p>
        )}
        {!loadingInsights && insights.map((insight, i) => (
          <p key={i} className="text-base text-charcoal mt-1">⚠️ {insight}</p>
        ))}
      </Card>
    </PageShell>
  );
}

export default function Analytics() {
  return (
    <CaregiverPatientGate>
      <AnalyticsContent />
    </CaregiverPatientGate>
  );
}
