const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  gameSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'GameSession', required: true },
  score: { type: Number, required: true },
  difficultyLevel: { type: Number, required: true },
  completedAt: { type: Date, required: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

module.exports = mongoose.model('Score', scoreSchema);
