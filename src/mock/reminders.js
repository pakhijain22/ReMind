// Field names match Backend API_CONTRACT.md Section 7 (GET /patients/:id/reminders)
// and Section 6 (PATCH /reminders/:id/status) exactly.
export const mockReminders = [
  { id: '1', type: 'medicine', label: 'Take morning medicine', scheduledTime: '8:00 AM', weekday: 'Monday', status: 'done' },
  { id: '2', type: 'hydration', label: 'Drink a glass of water', scheduledTime: '9:30 AM', weekday: 'Monday', status: 'done' },
  { id: '3', type: 'meal', label: 'Lunch time', scheduledTime: '1:00 PM', weekday: 'Monday', status: 'pending' },
  { id: '4', type: 'medicine', label: 'Evening medicine', scheduledTime: '4:00 PM', weekday: 'Monday', status: 'pending' },
  { id: '5', type: 'appointment', label: "Dr. Sharma's appointment", scheduledTime: '6:00 PM', weekday: 'Monday', status: 'pending' },
]

export const reminderIcons = {
  medicine: '💊',
  hydration: '💧',
  meal: '🍽️',
  appointment: '🩺',
}

// Natural-dye-inspired color coding per reminder type — madder (terracotta)
// for medicine, indigo for hydration, turmeric (existing amber) for meals,
// plant green (existing sage) for appointments. Reuses the existing palette
// where it already fits, only adding two new accent colors.
export const reminderColors = {
  medicine: { bg: 'bg-madder/15 dark:bg-madder-dark/15', text: 'text-madder dark:text-madder-dark' },
  hydration: { bg: 'bg-indigo/15 dark:bg-indigo-dark/15', text: 'text-indigo dark:text-indigo-dark' },
  meal: { bg: 'bg-amber/15 dark:bg-amber-dark/15', text: 'text-amber dark:text-amber-dark' },
  appointment: { bg: 'bg-sage/15 dark:bg-sage-dark/15', text: 'text-sage dark:text-sage-dark' },
}
