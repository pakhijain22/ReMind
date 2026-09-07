import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { mockWeeklyScores, mockAdherenceInsight } from '../../mock/scores.js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Analytics() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/caregiver/dashboard')}>← Back</Button>
        <h1 className="font-display text-2xl font-medium text-teal dark:text-teal-dark">Analytics</h1>
      </div>

      <Card className="rounded-3xl bg-white dark:bg-surface-dark">
        <p className="font-display text-lg font-medium text-charcoal dark:text-text-dark mb-2">Score Trend (7 days)</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={mockWeeklyScores}>
            <XAxis dataKey="day" stroke="currentColor" className="text-charcoal dark:text-text-dark" />
            <YAxis stroke="currentColor" className="text-charcoal dark:text-text-dark" />
            <Tooltip />
            <Bar dataKey="score" fill="#0F5257" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Wow Factor #3: Predictive Medication Adherence insight card */}
      <Card className="rounded-3xl bg-sage/10 dark:bg-sage-dark/10 border border-sage dark:border-sage-dark">
        <p className="text-sm font-bold text-sage dark:text-sage-dark uppercase tracking-wide mb-1">
          Predictive Medication Adherence
        </p>
        <p className="text-lg font-bold text-charcoal dark:text-text-dark">{mockAdherenceInsight.headline}</p>
        <p className="text-charcoal/80 dark:text-text-dark/80 mt-1">{mockAdherenceInsight.detail}</p>
      </Card>
    </div>
  )
}
