const express = require('express');
const router = express.Router();
const { requireFields } = require('../middleware/validate');
const {
	createReminder,
	updateReminder,
	deleteReminder,
	updateReminderStatus,
	getPatientReminders,
	getReminderLogs,
} = require('../controllers/reminderController');

router.post('/reminders', requireFields(['patientId', 'type', 'label', 'scheduledTime', 'weekday']), createReminder);
router.patch('/reminders/:id', requireFields(['type', 'label', 'scheduledTime', 'weekday']), updateReminder);
router.delete('/reminders/:id', deleteReminder);
router.patch('/reminders/:id/status', requireFields(['status']), updateReminderStatus);
router.get('/patients/:id/reminders', getPatientReminders);
router.get('/patients/:id/reminder-logs', getReminderLogs);

module.exports = router;
