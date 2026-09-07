const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  linkedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  contactInfo: { type: String },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

module.exports = mongoose.model('Caregiver', caregiverSchema);
