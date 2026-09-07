// Run with: npm run seed
// Populates the database with sample data so the Memory Vault and the
// Predictive Adherence insight look real during the demo instead of empty.
require('dotenv').config();
const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Reminder = require('../models/Reminder');
const MemoryVaultEntry = require('../models/MemoryVaultEntry');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected — seeding sample data...');

  // Clear any previous seed data for a clean re-run
  await Patient.deleteMany({});
  await Reminder.deleteMany({});
  await MemoryVaultEntry.deleteMany({});

  const patient = await Patient.create({
    name: 'Ranjita',
    loginPin: '1234',
    preferredLanguage: 'English',
  });

  await Reminder.insertMany([
    { patientId: patient._id, type: 'medicine', label: 'Morning medicine', scheduledTime: '9:00 AM', weekday: 'Monday', status: 'pending' },
    { patientId: patient._id, type: 'hydration', label: 'Drink water', scheduledTime: '11:00 AM', weekday: 'Monday', status: 'pending' },
    // Two "missed" entries on the same weekday — this is what makes the
    // Predictive Adherence insight actually trigger during the demo.
    { patientId: patient._id, type: 'meal', label: 'Lunch', scheduledTime: '1:00 PM', weekday: 'Sunday', status: 'missed' },
    { patientId: patient._id, type: 'meal', label: 'Lunch', scheduledTime: '1:00 PM', weekday: 'Sunday', status: 'missed' },
    { patientId: patient._id, type: 'appointment', label: 'Doctor appointment', scheduledTime: '4:00 PM', weekday: 'Friday', status: 'pending' },
  ]);

  await MemoryVaultEntry.insertMany([
    { patientId: patient._id, title: 'Bihu dance at the village fair', note: 'The whole family danced together and grandmother taught the little ones the steps.', photo: null },
    { patientId: patient._id, title: 'Tea garden morning walk', note: 'We walked through the tea estate before sunrise and shared a warm cup of tea at the end.', photo: null },
  ]);

  console.log('Seed complete. Sample patient PIN: 1234');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
