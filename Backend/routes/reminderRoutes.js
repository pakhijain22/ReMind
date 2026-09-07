const express = require('express');
const router = express.Router();
const { requireFields } = require('../middleware/validate');
const { updateReminderStatus, getPatientReminders, getReminderLogs } = require('../controllers/reminderController');

router.patch('/reminders/:id/status', requireFields(['status']), updateReminderStatus);
router.get('/patients/:id/reminders', getPatientReminders);
router.get('/patients/:id/reminder-logs', getReminderLogs);

module.exports = router;
