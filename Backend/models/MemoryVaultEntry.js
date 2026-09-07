const mongoose = require('mongoose');

const memoryVaultEntrySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  title: { type: String, required: true },
  note: { type: String, required: true },
  photo: { type: String, default: null }, // base64 string or URL — kept simple for MVP
  createdOffline: { type: Boolean, default: false },
  syncedAt: { type: Date, default: null },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

module.exports = mongoose.model('MemoryVaultEntry', memoryVaultEntrySchema);
