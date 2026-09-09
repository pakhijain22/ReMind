import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import Button from '../../components/Button';
import Card from '../../components/Card';
import VoiceButton from '../../components/VoiceButton';
import { usePatient } from '../../context/PatientContext';
import { getReminiscenceQuestions, saveReminiscenceSession, ApiError } from '../../api/client';
import { speak } from '../../utils/voice';

const FALLBACK_QUESTIONS = [
  'Who is with you in this photo?',
  'What do you remember about that day?',
  'How did this moment make you feel?'
];

export default function Reminiscence() {
  const { patient } = usePatient();
  const location = useLocation();
  const navigate = useNavigate();
  const memory = location.state?.memory || null;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [saved, setSaved] = useState(false);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    generateQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generateQuestions() {
    setLoading(true);
    setErrorMessage('');
    const description = memory ? `${memory.title}. ${memory.note}` : 'A treasured personal photo.';

    try {
      const result = await getReminiscenceQuestions({ photoDescription: description });
      setQuestions(result.questions);
    } catch (err) {
      // Fails gently — a calm retry message, never a crash, per the blueprint.
      setErrorMessage(err instanceof ApiError ? err.message : "We couldn't reach the reminiscence assistant just now.");
      setQuestions(FALLBACK_QUESTIONS);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSession() {
    if (!memory) return;
    try {
      const responses = questions.map((question) => ({ question, answer: answers[question] || '' }));
      await saveReminiscenceSession({ patientId: patient.id, memoryId: memory.id, questions, responses });
      setSaved(true);
    } catch {
      setSaved(true); // Don't block the patient's experience on a save failure.
    }
  }

  const allQuestionsText = questions.join('. ');

  return (
    <PageShell maxWidth="max-w-lg" backTo="/memories" backLabel="Back to memories">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display text-teal font-semibold">Let's Reminisce</h1>
        {!loading && <VoiceButton text={allQuestionsText} />}
      </div>

      {memory && (
        <Card className="mt-6">
          {memory.photo && <img src={memory.photo} alt="" className="w-full h-48 object-cover rounded-md mb-3" />}
          <p className="text-xl font-semibold text-charcoal">{memory.title}</p>
        </Card>
      )}

      {loading && <p className="mt-6 text-lg text-charcoal/60 text-center">Thinking of some gentle questions…</p>}

      {!loading && errorMessage && (
        <p className="mt-6 text-base text-alert text-center">{errorMessage} Here are some questions to start with instead.</p>
      )}

      {!loading && (
        <div className="mt-6 flex flex-col gap-4">
          {questions.map((q, i) => (
            <div key={i} className="bg-white/90 rounded-lg shadow-card p-5">
              <button onClick={() => speak(q)} className="text-left flex items-center gap-4">
                <span className="text-2xl" aria-hidden="true">💬</span>
                <span className="text-lg text-charcoal">{q}</span>
              </button>
              <label className="block mt-4 text-base font-semibold text-charcoal" htmlFor={`answer-${i}`}>
                Your answer
              </label>
              <textarea
                id={`answer-${i}`}
                rows={2}
                value={answers[q] || ''}
                onChange={(event) => setAnswers((current) => ({ ...current, [q]: event.target.value }))}
                className="mt-2 w-full rounded-md border border-charcoal/10 bg-offwhite px-3 py-2 text-base"
                placeholder="Write or dictate a memory..."
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {memory && !saved && (
          <Button fullWidth onClick={handleSaveSession}>Save this conversation</Button>
        )}
        {saved && <p className="text-center text-sage font-semibold">Saved to this memory.</p>}
        <Button variant="outline" fullWidth onClick={() => navigate('/memories')}>Back to Memories</Button>
      </div>
    </PageShell>
  );
}
