import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../components/PageShell';
import Button from '../../components/Button';
import Card from '../../components/Card';
import VoiceButton from '../../components/VoiceButton';
import { usePatient } from '../../context/PatientContext';
import { getMemories, createMemory, deleteMemory } from '../../api/client';
import { queueNewMemory } from '../../utils/offlineQueue';
import { speak } from '../../utils/voice';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function MemoryVault() {
  const { patient, theme } = usePatient();
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', note: '', photoFile: null, photoPreview: null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!patient) return;
    load();
  }, [patient]);

  async function load() {
    setLoading(true);
    try {
      const data = await getMemories(patient.id);
      setMemories(data);
    } catch {
      setMemories([]);
    } finally {
      setLoading(false);
    }
  }

  async function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setForm((f) => ({ ...f, photoFile: file, photoPreview: base64 }));
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = { patientId: patient.id, title: form.title, note: form.note, photo: form.photoPreview || null };

    try {
      if (navigator.onLine) {
        const saved = await createMemory(payload);
        setMemories((m) => [saved, ...m]);
      } else {
        await queueNewMemory(payload);
        setMemories((m) => [{ id: `local-${Date.now()}`, ...payload, createdAt: new Date().toISOString() }, ...m]);
      }
      speak('Memory saved.');
      setForm({ title: '', note: '', photoFile: null, photoPreview: null });
      setShowForm(false);
    } catch {
      await queueNewMemory(payload);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setMemories((m) => m.filter((mem) => mem.id !== id));
    setSelected(null);
    try {
      await deleteMemory(id);
    } catch {
      // Fails gently; the memory stays removed locally.
    }
  }

  return (
    <PageShell backTo="/home" backLabel="Back to menu">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display text-teal font-semibold">Your Memories</h1>
        <VoiceButton text="This is your memory vault. Tap a memory to see it, or add a new one." />
      </div>

      <Button className="mt-10" fullWidth icon="➕" onClick={() => setShowForm(true)}>
        Add a Memory
      </Button>

      {loading && <p className="mt-6 text-lg text-charcoal/60">Loading your memories…</p>}

      <div className="mt-6 grid grid-cols-2 gap-4">
        {memories.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelected(m)}
            className={`text-left rounded-lg shadow-card overflow-hidden active:scale-[0.98] transition-transform ${theme === 'dark' ? 'bg-[#183939] border border-[#8ed0bd] text-[#f5ead8]' : 'bg-[#eadcc7] border border-[#7a5b43]'}`}
          >
            {m.photo ? (
              <img src={m.photo} alt="" className="w-full h-28 object-cover" />
            ) : (
              <div className="w-full h-28 bg-sage-light flex items-center justify-center text-3xl">📝</div>
            )}
            <div className="p-3">
              <p className="text-base font-semibold text-charcoal truncate">{m.title}</p>
            </div>
          </button>
        ))}
      </div>

      {!loading && memories.length === 0 && (
        <p className="mt-6 text-lg text-charcoal/60 text-center">No memories saved yet — add your first one above.</p>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-charcoal/40 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <h2 className="text-xl font-semibold text-charcoal">Add a Memory</h2>
            <label className="block mt-4 text-base font-medium text-charcoal/70">Title</label>
            <input
              className="w-full mt-1 rounded-sm border border-charcoal/10 px-4 py-3 text-lg"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="E.g. Tea with grandchildren"
            />
            <label className="block mt-4 text-base font-medium text-charcoal/70">Note</label>
            <textarea
              className="w-full mt-1 rounded-sm border border-charcoal/10 px-4 py-3 text-lg"
              rows={3}
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="A short note about this memory"
            />
            <label className="block mt-4 text-base font-medium text-charcoal/70">Photo (optional)</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="mt-1 text-base" />
            {form.photoPreview && <img src={form.photoPreview} alt="" className="mt-3 w-full h-32 object-cover rounded-md" />}

            <div className="flex gap-3 mt-6">
              <Button variant="outline" fullWidth onClick={() => setShowForm(false)}>Cancel</Button>
              <Button fullWidth disabled={saving || !form.title.trim()} onClick={handleSave}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-charcoal/60 flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full">
            {selected.photo && <img src={selected.photo} alt="" className="w-full h-56 object-cover rounded-md mb-4" />}
            <h2 className="text-2xl font-semibold text-charcoal">{selected.title}</h2>
            <p className="mt-2 text-lg text-charcoal/70">{selected.note}</p>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" fullWidth onClick={() => setSelected(null)}>Close</Button>
              <Button
                fullWidth
                icon="💬"
                onClick={() => navigate(`/reminiscence/${selected.id}`, { state: { memory: selected } })}
              >
                Talk about this
              </Button>
            </div>
            <button
              className="mt-4 text-sm text-rose underline block mx-auto"
              onClick={() => handleDelete(selected.id)}
            >
              Delete this memory
            </button>
          </Card>
        </div>
      )}
    </PageShell>
  );
}
