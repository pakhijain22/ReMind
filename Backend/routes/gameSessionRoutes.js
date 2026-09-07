const express = require('express');
const router = express.Router();
const { requireFields } = require('../middleware/validate');
const { submitGameSession, getScoreHistory } = require('../controllers/gameSessionController');

router.post('/game-sessions', requireFields(['patientId', 'difficultyLevel', 'moves', 'score', 'completedAt', 'clientRequestId']), submitGameSession);
router.get('/patients/:id/scores', getScoreHistory);

module.exports = router;
