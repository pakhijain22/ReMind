const express = require('express');
const router = express.Router();
const { getNextDifficulty } = require('../difficulty/getNextDifficulty');
const { getAdherenceInsight } = require('../adherence/getAdherenceInsight');
const { getReminiscenceQuestions } = require('../reminiscence/getReminiscenceQuestions');
const { getReminderLogsForPatient } = require('../../services/reminderLogService');

router.post('/next-difficulty', (req, res) => {
  const result = getNextDifficulty(req.body);
  res.status(200).json({ success: true, data: result });
});

router.get('/adherence-insight', async (req, res) => {
  const reminderLog = await getReminderLogsForPatient(req.query.patientId);
  const result = getAdherenceInsight(reminderLog);
  res.status(200).json({ success: true, data: result });
});

router.post('/reminiscence', async (req, res) => {
  const result = await getReminiscenceQuestions(req.body.photoDescription);
  if (result.success === false) return res.status(500).json(result);
  res.status(200).json({ success: true, data: result });
});

module.exports = router;