const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  type: { type: String, enum: ['medicine', 'hydration', 'meal', 'appointment'], required: true },
  label: { type: String, required: true },
  scheduledTime: { type: String, required: true }, // e.g. "9:00 AM"
  weekday: { type: String, required: true },        // e.g. "Monday"
  status: { type: String, enum: ['pending', 'done', 'missed'], default: 'pending' },
  // Offline-tracking fields — added now per the schema-first rule, used once offline sync is wired in.
  createdOffline: { type: Boolean, default: false },
  syncedAt: { type: Date, default: null },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

module.exports = mongoose.model('Reminder', reminderSchema);
