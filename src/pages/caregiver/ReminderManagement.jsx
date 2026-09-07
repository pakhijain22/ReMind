import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { mockReminders as initialReminders, reminderIcons } from '../../mock/reminders.js'

export default function ReminderManagement() {
  const navigate = useNavigate()
  const [reminders, setReminders] = useState(initialReminders)
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setNotifStatus(result)
  }

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/caregiver/dashboard')}>← Back</Button>
        <h1 className="font-display text-2xl font-medium text-teal dark:text-teal-dark">Reminder Management</h1>
      </div>

      {notifStatus !== 'granted' && notifStatus !== 'unsupported' && (
        <Card className="rounded-3xl bg-alertamber/10 dark:bg-amber-dark/10 border border-alertamber dark:border-amber-dark flex items-center justify-between gap-4">
          <p className="text-sm text-charcoal dark:text-text-dark">Enable notifications so reminders reach the patient's device.</p>
          <Button variant="secondary" onClick={requestPermission}>Enable</Button>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {reminders.map((r) => (
          <Card key={r.id} className="rounded-3xl bg-white dark:bg-surface-dark flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{reminderIcons[r.type]}</span>
              <div>
                <p className="text-sm text-charcoal/60 dark:text-text-dark/60">{r.time}</p>
                <p className="font-bold text-teal dark:text-teal-dark">{r.title}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => alert('Edit reminder — hook up form here')}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => deleteReminder(r.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Button
        variant="secondary"
        fullWidth
        onClick={() => alert('Add reminder — hook up form here')}
      >
        + Add Reminder
      </Button>
    </div>
  )
}
