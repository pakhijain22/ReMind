import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts'
import Tile from '../../components/Tile.jsx'
import Card from '../../components/Card.jsx'
import VoiceButton from '../../components/VoiceButton.jsx'
import ThemeToggle from '../../components/ThemeToggle.jsx'
import { mockPatient } from '../../mock/patient.js'
import { mockReminders, reminderIcons } from '../../mock/reminders.js'
import { mockWeeklyScores, mockSummary } from '../../mock/scores.js'

export default function PatientHome() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const nextReminder = mockReminders.find((r) => !r.done)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const screenText = `${mockPatient.greeting}, ${mockPatient.name}. ${
    nextReminder ? `Your next reminder is ${nextReminder.title} at ${nextReminder.time}.` : 'You have no pending reminders.'
  }`

  const tiles = [
    { icon: '📅', label: 'Reminders', accent: 'teal', to: '/patient/reminders' },
    { icon: '🧩', label: 'Play a Game', accent: 'amber', to: '/patient/games' },
    { icon: '📷', label: 'Memory Vault', accent: 'sage', to: '/patient/vault' },
    { icon: '👨‍👩‍👧', label: 'Family & Friends', accent: 'teal', to: '/patient/family' },
    { icon: '🌤️', label: 'Daily Check-in', accent: 'amber', to: '/patient/checkin' },
  ]

  return (
    <div className="patient-screen min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-6">
      <div
        className={`flex items-start justify-between transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <div>
          <p className="text-lg text-charcoal/70 dark:text-text-dark/70">{mockPatient.greeting},</p>
          <h1 className="font-display text-3xl md:text-4xl font-medium text-teal dark:text-teal-dark">
            {mockPatient.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <VoiceButton text={screenText} />
          <button
            onClick={() => navigate('/patient/settings')}
            aria-label="Settings"
            className="min-h-touch min-w-touch flex items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-charcoal/10 dark:border-white/10 shadow-sm text-2xl active:scale-95 transition-transform"
          >
            ⚙️
          </button>
        </div>
      </div>

      {nextReminder && (
        <Card
          onClick={() => navigate('/patient/reminders')}
          className={`bg-alertamber/10 dark:bg-amber-dark/10 border border-alertamber dark:border-amber-dark flex items-center gap-4 transition-all duration-700 delay-100 rounded-3xl ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-3xl">{reminderIcons[nextReminder.type]}</span>
          <div>
            <p className="text-sm text-charcoal dark:text-text-dark">Next reminder</p>
            <p className="text-xl font-bold text-teal dark:text-teal-dark">{nextReminder.title} — {nextReminder.time}</p>
          </div>
        </Card>
      )}

      <Card
        className={`rounded-3xl bg-white dark:bg-surface-dark transition-all duration-700 delay-150 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="font-display text-lg font-medium text-charcoal dark:text-text-dark">
            You're doing great! 🎉
          </p>
          <span className="text-sm font-bold text-sage dark:text-sage-dark whitespace-nowrap">
            🔥 {mockSummary.currentStreak}-day streak
          </span>
        </div>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={mockWeeklyScores}>
            <XAxis dataKey="day" stroke="currentColor" className="text-charcoal dark:text-text-dark" tick={{ fontSize: 12 }} />
            <Bar dataKey="score" fill="#0F5257" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center text-charcoal/70 dark:text-text-dark/70 mt-1">
          Your activity this week, {mockPatient.name.split(' ').pop()}!
        </p>
      </Card>


      <div>
        <h2 className="font-display text-xl font-medium text-charcoal dark:text-text-dark mb-3">
          What would you like to do?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tiles.map((tile, i) => (
            <div
              key={tile.label}
              className={`transition-all duration-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: mounted ? `${150 + i * 80}ms` : '0ms' }}
            >
              <Tile
                icon={tile.icon}
                label={tile.label}
                accent={tile.accent}
                onClick={() => navigate(tile.to)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
