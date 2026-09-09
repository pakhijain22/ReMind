import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import ThemeToggle from '../../components/ThemeToggle.jsx'
import PhotoBackdrop from '../../components/PhotoBackdrop.jsx'
import { mockSummary, mockWeeklyScores } from '../../mock/scores.js'
import { mockPatient } from '../../mock/patient.js'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function CaregiverDashboard() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const features = [
    { icon: '📊', label: 'Analytics', desc: 'Trends & insights', to: '/caregiver/analytics' },
    { icon: '⏰', label: 'Reminder Management', desc: 'Edit daily reminders', to: '/caregiver/reminders' },
    { icon: '📷', label: 'Memory Manager', desc: 'Curate the vault', to: '/caregiver/memories' },
    { icon: '👨‍👩‍👧‍👦', label: 'Care Circle', desc: 'Family & contacts', to: '/caregiver/care-circle' },
    { icon: '🔔', label: 'Alerts & Reports', desc: 'Stay in the loop', to: '/caregiver/alerts' },
  ]

  return (
    <div className="min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-6">
      <PhotoBackdrop src="/images/dashboard-banner.jpg" opacity={0.35} className="rounded-3xl -mx-2 px-2 pt-2">
        <div
          className={`flex items-center justify-between transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          <h1 className="font-display text-2xl md:text-3xl font-medium text-teal dark:text-teal-dark">
            Caregiver Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate('/')}>Switch Role</Button>
          </div>
        </div>
      </PhotoBackdrop>

      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-3xl bg-white dark:bg-surface-dark">
          <p className="text-sm text-charcoal/60 dark:text-text-dark/60">Patient</p>
          <p className="text-xl font-bold text-teal dark:text-teal-dark">{mockPatient.name}</p>
        </Card>
        <Card className="rounded-3xl bg-white dark:bg-surface-dark">
          <p className="text-sm text-charcoal/60 dark:text-text-dark/60">Reminders Today</p>
          <p className="text-xl font-bold text-teal dark:text-teal-dark">
            {mockSummary.remindersCompletedToday}/{mockSummary.remindersTotalToday}
          </p>
        </Card>
        <Card className="rounded-3xl bg-white dark:bg-surface-dark">
          <p className="text-sm text-charcoal/60 dark:text-text-dark/60">Latest Score</p>
          <p className="text-xl font-bold text-sage dark:text-sage-dark">{mockSummary.latestScore}</p>
        </Card>
        <Card className="rounded-3xl bg-white dark:bg-surface-dark">
          <p className="text-sm text-charcoal/60 dark:text-text-dark/60">Memories Saved</p>
          <p className="text-xl font-bold text-teal dark:text-teal-dark">{mockSummary.totalMemoriesSaved}</p>
        </Card>
      </div>

      <Card className="rounded-3xl bg-white dark:bg-surface-dark">
        <p className="font-display text-lg font-medium text-charcoal dark:text-text-dark mb-2">Weekly Progress</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mockWeeklyScores}>
            <XAxis dataKey="day" stroke="currentColor" className="text-charcoal dark:text-text-dark" />
            <YAxis stroke="currentColor" className="text-charcoal dark:text-text-dark" />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#0F5257" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div>
        <h2 className="font-display text-xl font-medium text-charcoal dark:text-text-dark mb-3">
          Manage
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={f.label}
              onClick={() => navigate(f.to)}
              className={`bg-white dark:bg-surface-dark border border-charcoal/10 dark:border-white/10 rounded-3xl p-5 cursor-pointer flex items-center gap-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: mounted ? `${100 + i * 80}ms` : '0ms' }}
            >
              <span className="text-3xl">{f.icon}</span>
              <div>
                <p className="font-bold text-teal dark:text-teal-dark">{f.label}</p>
                <p className="text-sm text-charcoal/60 dark:text-text-dark/60">{f.desc}</p>
              </div>
            </div>
          ))}
          <div
            onClick={() => navigate('/caregiver/settings')}
            className={`bg-white dark:bg-surface-dark border border-charcoal/10 dark:border-white/10 rounded-3xl p-5 cursor-pointer flex items-center gap-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: mounted ? `${100 + features.length * 80}ms` : '0ms' }}
          >
            <span className="text-3xl">⚙️</span>
            <div>
              <p className="font-bold text-teal dark:text-teal-dark">Settings</p>
              <p className="text-sm text-charcoal/60 dark:text-text-dark/60">App & sync preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
