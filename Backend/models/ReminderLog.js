const mongoose = require('mongoose');

// One document per actual occurrence (not per reminder "slot") — this is what lets
// Predictive Adherence count "missed this Sunday AND last Sunday" instead of only
// ever seeing the current, overwritten status of a single Reminder record.
const reminderLogSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  reminderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reminder', required: true },
  type: { type: String, required: true },      // e.g. "medicine"
  weekday: { type: String, required: true },   // e.g. "Sunday"
  status: { type: String, enum: ['done', 'missed'], required: true },
  occurredAt: { type: Date, default: Date.now },
});

reminderLogSchema.methods.toAdherenceJSON = function () {
  return { type: this.type, weekday: this.weekday, status: this.status };
};

module.exports = mongoose.model('ReminderLog', reminderLogSchema);
