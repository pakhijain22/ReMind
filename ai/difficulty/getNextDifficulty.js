export function getNextDifficulty({ gameType, currentDifficultyLevel, sessionStats }) {
  const { incorrectAttempts, currentStreak } = sessionStats;

  if (currentStreak >= 3 && incorrectAttempts <= 1) {
    return {
      difficultyLevel: Math.min(currentDifficultyLevel + 1, 3),
      reason: `${currentStreak} correct in a row, low error rate`,
    };
  }

  if (incorrectAttempts >= 3) {
    return {
      difficultyLevel: Math.max(currentDifficultyLevel - 1, 1),
      reason: `${incorrectAttempts} incorrect attempts this session`,
    };
  }

  return {
    difficultyLevel: currentDifficultyLevel,
    reason: "Performance steady, holding difficulty level",
  };
}