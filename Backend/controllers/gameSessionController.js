const GameSession = require('../models/GameSession');
const Score = require('../models/Score');
const { success, error } = require('../utils/responseFormat');

// POST /game-sessions — Submit Game Session + Score
async function submitGameSession(req, res) {
  const { patientId, difficultyLevel, moves, score, completedAt, clientRequestId } = req.body;

  // Idempotency guard: if this exact submission was already saved (e.g. an offline
  // device retried the same request), return the existing record instead of duplicating it.
  const existing = await GameSession.findOne({ clientRequestId });
  if (existing) {
    const existingScore = await Score.findOne({ gameSessionId: existing._id });
    return success(res, {
      id: existing._id.toString(),
      patientId: existing.patientId.toString(),
      difficultyLevel: existing.difficultyLevel,
      moves: existing.moves,
      score: existingScore ? existingScore.score : score,
      completedAt: existing.completedAt,
    }, 201);
  }

  const session = await GameSession.create({ patientId, difficultyLevel, moves, completedAt, clientRequestId });
  const scoreDoc = await Score.create({ patientId, gameSessionId: session._id, score, difficultyLevel, completedAt });

  return success(res, {
    id: session._id.toString(),
    patientId: session.patientId.toString(),
    difficultyLevel: session.difficultyLevel,
    moves: session.moves,
    score: scoreDoc.score,
    completedAt: session.completedAt,
  }, 201);
}

// GET /patients/:id/scores — Get Score History
async function getScoreHistory(req, res) {
  const scores = await Score.find({ patientId: req.params.id }).sort({ completedAt: -1 });
  return success(res, scores.map(s => ({
    id: s._id.toString(),
    score: s.score,
    difficultyLevel: s.difficultyLevel,
    completedAt: s.completedAt,
  })));
}

module.exports = { submitGameSession, getScoreHistory };
