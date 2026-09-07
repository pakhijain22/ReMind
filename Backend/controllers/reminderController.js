const Reminder = require('../models/Reminder');
const ReminderLog = require('../models/ReminderLog');
const { success, error } = require('../utils/responseFormat');

// PATCH /reminders/:id/status — Update Reminder Status
async function updateReminderStatus(req, res) {
  const { status } = req.body;
  if (!['pending', 'done', 'missed'].includes(status)) {
    return error(res, '"status" must be one of: pending, done, missed', 400, 'status');
  }
  const reminder = await Reminder.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!reminder) return error(res, 'Reminder not found', 404);

  // Record this occurrence in the log, separately from the reminder's current status above.
  // This is what lets Predictive Adherence count misses across multiple past occurrences —
  // the Reminder record itself only ever holds its current state, not history.
  if (status === 'done' || status === 'missed') {
    await ReminderLog.create({
      patientId: reminder.patientId,
      reminderId: reminder._id,
      type: reminder.type,
      weekday: reminder.weekday,
      status,
    });
  }

  return success(res, {
    id: reminder._id.toString(),
    status: reminder.status,
    updatedAt: new Date().toISOString(),
  });
}

// GET /patients/:id/reminders — Get Patient's Reminders
async function getPatientReminders(req, res) {
  const reminders = await Reminder.find({ patientId: req.params.id });
  return success(res, reminders.map(r => ({
    id: r._id.toString(),
    type: r.type,
    label: r.label,
    scheduledTime: r.scheduledTime,
    weekday: r.weekday,
    status: r.status,
  })));
}

// GET /patients/:id/reminder-logs — Get Reminder Occurrence Logs (for Predictive Adherence)
// Returns the exact shape AI-2's checkAdherence() function expects:
// [{ type, weekday, status }, ...] — one entry per past occurrence, not per reminder slot.
async function getReminderLogs(req, res) {
  const logs = await ReminderLog.find({ patientId: req.params.id }).sort({ occurredAt: -1 });
  return success(res, logs.map(l => ({
    type: l.type,
    weekday: l.weekday,
    status: l.status,
  })));
}

module.exports = { updateReminderStatus, getPatientReminders, getReminderLogs };
