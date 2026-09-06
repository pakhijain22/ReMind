import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { mockSummary, mockWeeklyScores } from '../../mock/scores.js'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function CaregiverDashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-offwhite p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-teal">Caregiver Dashboard</h1>
        <Button variant="ghost" onClick={() => navigate('/')}>Switch Role</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-sm text-charcoal/60">Patient</p>
          <p className="text-xl font-bold text-teal">{mockSummary.patientName}</p>
        </Card>
        <Card>
          <p className="text-sm text-charcoal/60">Games Today</p>
          <p className="text-xl font-bold text-teal">{mockSummary.gamesPlayedToday}</p>
        </Card>
        <Card>
          <p className="text-sm text-charcoal/60">Current Streak</p>
          <p className="text-xl font-bold text-sage">{mockSummary.currentStreak} days</p>
        </Card>
        <Card>
          <p className="text-sm text-charcoal/60">Last Active</p>
          <p className="text-xl font-bold text-teal">{mockSummary.lastActive}</p>
        </Card>
      </div>

      <Card>
        <p className="text-lg font-bold text-charcoal mb-2">Weekly Progress</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mockWeeklyScores}>
            <XAxis dataKey="day" stroke="#1B2E2E" />
            <YAxis stroke="#1B2E2E" />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#0F5257" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        <Button onClick={() => navigate('/caregiver/analytics')} fullWidth>View Analytics</Button>
        <Button variant="secondary" onClick={() => navigate('/caregiver/reminders')} fullWidth>
          Manage Reminders
        </Button>
        <Button variant="ghost" onClick={() => navigate('/caregiver/settings')} fullWidth>
          Settings
        </Button>
      </div>
    </div>
  )
}
