import express from 'express';
import { getNextDifficulty } from '../difficulty/getNextDifficulty.js';
import { getAdherenceInsight } from '../adherence/getAdherenceInsight.js';
import { getReminiscenceQuestions } from '../reminiscence/getReminiscenceQuestions.js';

const router = express.Router();

router.post('/next-difficulty', (req, res) => {
  const { gameType, currentDifficultyLevel, sessionStats } = req.body;
  const result = getNextDifficulty({ gameType, currentDifficultyLevel, sessionStats });
  res.status(200).json({ success: true, data: result });
});

router.get('/adherence-insight', async (req, res) => {
  const { patientId } = req.query;
  // TODO: replace this empty array with a real reminder-history lookup
  // once Backend confirms how AI routes should fetch it (see message below)
  const reminderLog = [];
  const result = getAdherenceInsight(reminderLog);
  res.status(200).json({ success: true, data: result });
});

router.post('/reminiscence', async (req, res) => {
  const { photoDescription } = req.body;
  const result = await getReminiscenceQuestions(photoDescription);
  if (result.success === false) return res.status(500).json(result);
  res.status(200).json({ success: true, data: result });
});

export default router;