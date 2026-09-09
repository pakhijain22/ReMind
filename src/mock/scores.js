// Weekly chart data — a display-only aggregation for the caregiver charts.
export const mockWeeklyScores = [
  { day: 'Mon', score: 62 },
  { day: 'Tue', score: 68 },
  { day: 'Wed', score: 59 },
  { day: 'Thu', score: 74 },
  { day: 'Fri', score: 71 },
  { day: 'Sat', score: 80 },
  { day: 'Sun', score: 77 },
]

export const mockAdherenceInsight = {
  headline: 'Medication adherence is strong this week',
  detail: '92% of scheduled medicine reminders were marked done on time. Evening doses are occasionally missed — consider an extra reminder at 4:30 PM.',
  trend: 'up',
  riskFlag: false,
  missedPattern: {
    type: 'medicine',
    timeOfDay: '4:00 PM',
    missedCount: 2,
  },
}

export const mockSummary = {
  remindersCompletedToday: 2,
  remindersTotalToday: 5,
  latestScore: 78,
  currentDifficultyLevel: 2,
  totalMemoriesSaved: 3,
  currentStreak: 5,
}
