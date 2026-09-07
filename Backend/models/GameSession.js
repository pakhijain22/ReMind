const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  difficultyLevel: { type: Number, required: true, min: 1, max: 3 },
  moves: { type: Number, required: true },
  completedAt: { type: Date, required: true },
  // Prevents the same offline-retried submission from being saved twice.
  clientRequestId: { type: String, required: true, unique: true, sparse: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

module.exports = mongoose.model('GameSession', gameSessionSchema);
