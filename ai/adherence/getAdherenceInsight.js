export function getAdherenceInsight(reminderLog) {
  const total = reminderLog.length;
  const doneCount = reminderLog.filter((r) => r.status === "done").length;
  const percentage = total > 0 ? Math.round((doneCount / total) * 100) : 100;

  const misses = {};
  reminderLog
    .filter((r) => r.status === "missed")
    .forEach((r) => {
      const key = `${r.type}|${r.scheduledTime}`;
      misses[key] = (misses[key] || 0) + 1;
    });

  const [worstKey, worstCount] = Object.entries(misses).sort((a, b) => b[1] - a[1])[0] || [null, 0];
  const riskFlag = worstCount >= 2; // matches the contract's own "Rule-based expectation" note

  let missedPattern = null;
  if (worstKey) {
    const [type, timeOfDay] = worstKey.split("|");
    missedPattern = { type, timeOfDay, missedCount: worstCount };
  }

  const headline = riskFlag
    ? "Some reminders need attention"
    : percentage >= 90
    ? "Medication adherence is strong this week"
    : "Adherence is steady";

  const detail = missedPattern
    ? `${percentage}% of scheduled reminders were marked done. ${missedPattern.type} reminders are occasionally missed around ${missedPattern.timeOfDay} — consider adjusting the time.`
    : `${percentage}% of scheduled reminders were marked done this period.`;

  return {
    headline,
    detail,
    trend: "steady", // placeholder — needs dated history, see the note above to Rishika
    riskFlag,
    missedPattern,
  };
}