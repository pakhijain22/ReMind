const mongoose = require('mongoose');

const reminiscenceSessionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  memoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'MemoryVaultEntry', required: true },
  questions: [{ type: String, required: true }],
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

module.exports = mongoose.model('ReminiscenceSession', reminiscenceSessionSchema);
