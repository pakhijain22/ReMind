export const mockReminders = [
  { id: 1, time: '08:00 AM', title: 'Take morning medicine', type: 'medicine', done: true },
  { id: 2, time: '09:30 AM', title: 'Drink a glass of water', type: 'hydration', done: true },
  { id: 3, time: '01:00 PM', title: 'Lunch time', type: 'meal', done: false },
  { id: 4, time: '04:00 PM', title: 'Evening medicine', type: 'medicine', done: false },
  { id: 5, time: '06:00 PM', title: "Dr. Sharma's appointment", type: 'appointment', done: false },
]

export const reminderIcons = {
  medicine: '💊',
  hydration: '💧',
  meal: '🍽️',
  appointment: '🩺',
}
