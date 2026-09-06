import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { mockWeeklyScores, mockAdherenceInsight } from '../../mock/scores.js'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Analytics() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-offwhite p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/caregiver/dashboard')}>← Back</Button>
        <h1 className="text-2xl font-bold text-teal">Analytics</h1>
      </div>

      <Card>
        <p className="text-lg font-bold text-charcoal mb-2">Score Trend (7 days)</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={mockWeeklyScores}>
            <XAxis dataKey="day" stroke="#1B2E2E" />
            <YAxis stroke="#1B2E2E" />
            <Tooltip />
            <Bar dataKey="score" fill="#0F5257" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Wow Factor #3: Predictive Medication Adherence insight card */}
      <Card className="bg-sage/10 border border-sage">
        <p className="text-sm font-bold text-sage uppercase tracking-wide mb-1">
          Predictive Medication Adherence
        </p>
        <p className="text-lg font-bold text-charcoal">{mockAdherenceInsight.headline}</p>
        <p className="text-charcoal/80 mt-1">{mockAdherenceInsight.detail}</p>
      </Card>
    </div>
  )
}
