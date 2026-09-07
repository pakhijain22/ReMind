import React, { useState } from 'react'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { mockReminders as initialReminders, reminderIcons } from '../../mock/reminders.js'

export default function Reminders() {
  const [reminders, setReminders] = useState(initialReminders)

  const markDone = (id) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, done: true } : r)))
    // Placeholder: this action should be queued in IndexedDB if offline,
    // then synced to the backend when connectivity returns.
  }

  const screenText = `Today's reminders: ${reminders
    .map((r) => `${r.title} at ${r.time}, ${r.done ? 'done' : 'pending'}`)
    .join('. ')}`

  return (
    <div className="patient-screen min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-5">
      <PageHeader title="Today's Reminders" backTo="/patient/home" voiceText={screenText} />

      <div className="flex flex-col gap-4">
        {reminders.map((r) => (
          <Card
            key={r.id}
            className={`flex items-center justify-between gap-4 rounded-3xl bg-white dark:bg-surface-dark ${r.done ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{reminderIcons[r.type]}</span>
              <div>
                <p className="text-sm text-charcoal dark:text-text-dark/70">{r.time}</p>
                <p className="text-lg font-bold text-teal dark:text-teal-dark">{r.title}</p>
              </div>
            </div>
            {!r.done ? (
              <Button variant="secondary" onClick={() => markDone(r.id)}>Done</Button>
            ) : (
              <span className="text-sage dark:text-sage-dark font-bold">✓ Done</span>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
