const Reminder = require('../models/Reminder');
const Score = require('../models/Score');
const MemoryVaultEntry = require('../models/MemoryVaultEntry');
const { success } = require('../utils/responseFormat');

// GET /patients/:id/dashboard-summary — Caregiver Dashboard Summary
// Combines a few collections into one response so Frontend makes a single call, not four.
async function getDashboardSummary(req, res) {
  const patientId = req.params.id;

  const allReminders = await Reminder.find({ patientId });
  const remindersCompletedToday = allReminders.filter(r => r.status === 'done').length;
  const remindersTotalToday = allReminders.length;

  const latestScoreDoc = await Score.findOne({ patientId }).sort({ completedAt: -1 });
  const latestScore = latestScoreDoc ? latestScoreDoc.score : null;
  const currentDifficultyLevel = latestScoreDoc ? latestScoreDoc.difficultyLevel : 1;

  const totalMemoriesSaved = await MemoryVaultEntry.countDocuments({ patientId });

  return success(res, {
    remindersCompletedToday,
    remindersTotalToday,
    latestScore,
    currentDifficultyLevel,
    totalMemoriesSaved,
  });
}

module.exports = { getDashboardSummary };
