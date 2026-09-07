const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  loginPin: { type: String, required: true },
  preferredLanguage: { type: String, default: 'English' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

module.exports = mongoose.model('Patient', patientSchema);
