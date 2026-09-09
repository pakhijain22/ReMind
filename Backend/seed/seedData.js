// Run with: npm run seed
// Populates the database with sample data so the Memory Vault and the
// Predictive Adherence insight look real during the demo instead of empty.

require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8']);

const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Reminder = require('../models/Reminder');
const ReminderLog = require('../models/ReminderLog');
const MemoryVaultEntry = require('../models/MemoryVaultEntry');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected — seeding sample data...');
  await Patient.deleteMany({});
  await Reminder.deleteMany({});
  await ReminderLog.deleteMany({});
  await MemoryVaultEntry.deleteMany({});

  const patient = await Patient.create({
    name: 'Ranjita',
    loginPin: '1234',
    preferredLanguage: 'English',
  });

  const reminders = await Reminder.insertMany([
    { patientId: patient._id, type: 'medicine', label: 'Morning medicine', scheduledTime: '9:00 AM', weekday: 'Monday', status: 'pending' },
    { patientId: patient._id, type: 'hydration', label: 'Drink water', scheduledTime: '11:00 AM', weekday: 'Monday', status: 'pending' },
    { patientId: patient._id, type: 'meal', label: 'Lunch', scheduledTime: '1:00 PM', weekday: 'Sunday', status: 'missed' },
    { patientId: patient._id, type: 'meal', label: 'Lunch', scheduledTime: '1:00 PM', weekday: 'Sunday', status: 'missed' },
    { patientId: patient._id, type: 'appointment', label: 'Doctor appointment', scheduledTime: '4:00 PM', weekday: 'Friday', status: 'pending' },
  ]);

  const missedReminders = reminders.filter(r => r.status === 'missed');

  await ReminderLog.insertMany(
    missedReminders.map(r => ({
      patientId: patient._id,
      reminderId: r._id,
      type: r.type,
      weekday: r.weekday,
      status: 'missed',
    }))
  );

  await MemoryVaultEntry.insertMany([
    {
      patientId: patient._id,
      title: 'Bihu dance at the village fair',
      note: 'The whole family danced together and grandmother taught the little ones the steps.',
      photo: null
    },
    {
      patientId: patient._id,
      title: 'Tea garden morning walk',
      note: 'We walked through the tea estate before sunrise and shared a warm cup of tea at the end.',
      photo: null
    },
  ]);

  console.log('Seed complete. Sample patient PIN: 1234');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
