import { getNextLevel } from './difficultyEngine.js';

const cases = [
  { level: 1, results: ["correct", "correct", "correct"], expected: 2 },
  { level: 3, results: ["correct", "correct", "correct"], expected: 3 }, // cap check
  { level: 2, results: ["wrong", "wrong", "wrong"], expected: 1 },
  { level: 1, results: ["wrong", "wrong", "wrong"], expected: 1 },       // floor check
  { level: 2, results: ["correct", "wrong", "correct"], expected: 2 },  // mixed, no change
  { level: 2, results: ["correct", "correct"], expected: 2 },           // not enough data yet
];

cases.forEach(({ level, results, expected }, i) => {
  const actual = getNextLevel(level, results);
  const pass = actual === expected ? "✅ PASS" : "❌ FAIL";
  console.log(`Test ${i + 1}: ${pass} — expected ${expected}, got ${actual}`);
});