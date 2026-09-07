export function checkAdherence(reminderLog) {
  // reminderLog: array like [{ type: "medicine", weekday: "Sunday", status: "missed" }, ...]
  const misses = {};

  reminderLog
    .filter((r) => r.status === "missed")
    .forEach((r) => {
      const key = `${r.type}|${r.weekday}`;
      misses[key] = (misses[key] || 0) + 1;
    });

  return Object.entries(misses)
    .filter(([, count]) => count >= 2)
    .map(([key]) => {
      const [type, weekday] = key.split("|");
      return `${type} reminder often missed on ${weekday} — consider adjusting the time.`;
    });
}