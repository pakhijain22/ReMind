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
    <div className="min-h-screen bg-offwhite p-6 flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/caregiver/dashboard')}>← Back</Button>
        <h1 className="text-2xl font-bold text-teal">Reminder Management</h1>
      </div>

      {notifStatus !== 'granted' && notifStatus !== 'unsupported' && (
        <Card className="bg-alertamber/10 border border-alertamber flex items-center justify-between gap-4">
          <p className="text-sm text-charcoal">Enable notifications so reminders reach the patient's device.</p>
          <Button variant="secondary" onClick={requestPermission}>Enable</Button>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {reminders.map((r) => (
          <Card key={r.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{reminderIcons[r.type]}</span>
              <div>
                <p className="text-sm text-charcoal/60">{r.time}</p>
                <p className="font-bold text-teal">{r.title}</p>
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
