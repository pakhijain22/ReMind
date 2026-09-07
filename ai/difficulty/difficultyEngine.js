export function getNextLevel(currentLevel, lastThreeResults) {
  // currentLevel: integer 1 (easiest) to 3 (hardest)
  // lastThreeResults: array like ["correct", "correct", "correct"]

  if (lastThreeResults.length < 3) {
    return currentLevel; // not enough data yet, don't change anything
  }

  const allCorrect = lastThreeResults.every((r) => r === "correct");
  const allWrong = lastThreeResults.every((r) => r === "wrong");

  if (allCorrect) return Math.min(currentLevel + 1, 3); // never exceed 3
  if (allWrong) return Math.max(currentLevel - 1, 1);   // never go below 1

  return currentLevel; // mixed results, no change
}