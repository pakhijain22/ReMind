const express = require('express');

const router = express.Router();

const ReminderLog = require('../../models/ReminderLog');

const { getNextDifficulty } = require('../difficulty/getNextDifficulty');
const { getAdherenceInsight } = require('../adherence/getAdherenceInsight');
const { getReminiscenceQuestions } = require('../reminiscence/getReminiscenceQuestions');

router.post('/next-difficulty', (req, res) => {
  const result = getNextDifficulty(req.body);
  res.status(200).json({ success: true, data: result });
});

router.get('/adherence-insight', async (req, res) => {
  try {
    const { patientId } = req.query;

    const reminderLogs = await ReminderLog.find({ patientId })
      .sort({ occurredAt: -1 });

    const reminderLog = reminderLogs.map((log) => ({
      type: log.type,
      weekday: log.weekday,
      status: log.status,
    }));

    const result = getAdherenceInsight(reminderLog);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Unable to generate adherence insight',
        field: null,
      },
    });
  }
});

router.post('/reminiscence', async (req, res) => {
  const result = await getReminiscenceQuestions(req.body.photoDescription);

  if (result.success === false) {
    return res.status(500).json(result);
  }

  res.status(200).json({ success: true, data: result });
});

module.exports = router;