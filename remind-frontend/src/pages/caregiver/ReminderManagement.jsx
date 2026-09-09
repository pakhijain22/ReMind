import { useEffect, useState } from 'react';
import PageShell from '../../components/PageShell';
import Card from '../../components/Card';
import Button from '../../components/Button';
import CaregiverPatientGate from '../../components/CaregiverPatientGate';
import { useCaregiverPatient } from '../../context/CaregiverContext';
import { getReminders, createReminder, updateReminder, deleteReminder } from '../../api/client';

const TYPES = ['medicine', 'hydration', 'meal', 'appointment'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const EMPTY_FORM = { type: 'medicine', label: '', scheduledTime: '', weekday: 'Monday' };

function ReminderManagementContent() {
  const { caregiverPatient } = useCaregiverPatient();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!caregiverPatient) return;
    load();
  }, [caregiverPatient]);

  async function load() {
    setLoading(true);
    try {
      const data = await getReminders(caregiverPatient.id);
      setReminders(data);
    } catch {
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(reminder) {
    setEditingId(reminder.id);
    setForm({ type: reminder.type, label: reminder.label, scheduledTime: reminder.scheduledTime, weekday: reminder.weekday });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave() {
    if (!form.label.trim() || !form.scheduledTime.trim()) return;
    setSaving(true);
    setNotice('');
    try {
      if (editingId) {
        await updateReminder(editingId, form);
      } else {
        await createReminder({ patientId: caregiverPatient.id, ...form });
      }
      resetForm();
      await load();
    } catch {
      setNotice("This couldn't be saved to the backend yet — the create/edit reminder endpoint isn't confirmed in the API contract. Check with your backend teammate.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteReminder(id);
      await load();
    } catch {
      setNotice("This couldn't be deleted on the backend yet — the delete-reminder endpoint isn't confirmed in the API contract.");
    }
  }

  return (
    <PageShell maxWidth="max-w-2xl" backTo="/caregiver" backLabel="Back to caregiver home">
      <h1 className="text-2xl font-display text-teal font-semibold">Reminder Management</h1>
      <p className="text-base text-charcoal/60 mt-1">Viewing {caregiverPatient.name}</p>

      <Card className="mt-6">
        <p className="text-lg font-semibold text-charcoal mb-4">{editingId ? 'Edit reminder' : 'Add a reminder'}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1">Type</label>
            <select
              className="w-full rounded-sm border border-charcoal/10 px-3 py-3 text-base"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1">Weekday</label>
            <select
              className="w-full rounded-sm border border-charcoal/10 px-3 py-3 text-base"
              value={form.weekday}
              onChange={(e) => setForm((f) => ({ ...f, weekday: e.target.value }))}
            >
              {WEEKDAYS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1">Label</label>
            <input
              className="w-full rounded-sm border border-charcoal/10 px-3 py-3 text-base"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="E.g. Morning medicine"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-1">Time</label>
            <input
              className="w-full rounded-sm border border-charcoal/10 px-3 py-3 text-base"
              value={form.scheduledTime}
              onChange={(e) => setForm((f) => ({ ...f, scheduledTime: e.target.value }))}
              placeholder="E.g. 9:00 AM"
            />
          </div>
        </div>

        {notice && <p className="mt-4 text-sm text-alert">{notice}</p>}

        <div className="flex gap-3 mt-5">
          {editingId && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
          <Button disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add reminder'}</Button>
        </div>
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        {loading && <p className="text-charcoal/60">Loading reminders…</p>}
        {!loading && reminders.map((r) => (
          <Card key={r.id} className="flex items-center justify-between gap-4" animate={false}>
            <div>
              <p className="text-lg font-semibold text-charcoal capitalize">{r.type} — {r.label}</p>
              <p className="text-sm text-charcoal/60">{r.weekday} · {r.scheduledTime} · <span className="capitalize">{r.status}</span></p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="small" variant="outline" onClick={() => startEdit(r)}>Edit</Button>
              <Button size="small" variant="danger" onClick={() => handleDelete(r.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {!loading && reminders.length === 0 && <p className="text-charcoal/60">No reminders set up yet.</p>}
      </div>
    </PageShell>
  );
}

export default function ReminderManagement() {
  return (
    <CaregiverPatientGate>
      <ReminderManagementContent />
    </CaregiverPatientGate>
  );
}
