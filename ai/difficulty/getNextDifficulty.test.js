import { getNextDifficulty } from './getNextDifficulty.js';

const cases = [
  { patientId: "p1", gameType: "pattern-match", currentDifficultyLevel: 1,
    sessionStats: { correctMatches: 6, incorrectAttempts: 0, timeTakenSeconds: 48, currentStreak: 3 } },
  { patientId: "p1", gameType: "word-find", currentDifficultyLevel: 2,
    sessionStats: { correctMatches: 2, incorrectAttempts: 3, timeTakenSeconds: 60, currentStreak: 0 } },
  { patientId: "p1", gameType: "memory-recall", currentDifficultyLevel: 2,
    sessionStats: { correctMatches: 4, incorrectAttempts: 1, timeTakenSeconds: 40, currentStreak: 1 } },
];

cases.forEach((input, i) => {
  console.log(`Test ${i + 1}:`, getNextDifficulty(input));
});