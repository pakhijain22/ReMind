import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { mockAlerts } from '../../mock/alerts.js'
import { mockAdherenceInsight } from '../../mock/scores.js'

const severityStyles = {
  warning: 'border-alertamber dark:border-amber-dark bg-alertamber/10 dark:bg-amber-dark/10',
  success: 'border-sage dark:border-sage-dark bg-sage/10 dark:bg-sage-dark/10',
  info: 'border-teal/30 dark:border-teal-dark/30 bg-teal/5 dark:bg-teal-dark/5',
}

const severityIcons = {
  warning: '⚠️',
  success: '✅',
  info: 'ℹ️',
}

export default function AlertsReports() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/caregiver/dashboard')}>← Back</Button>
        <h1 className="font-display text-2xl font-medium text-teal dark:text-teal-dark">Alerts & Reports</h1>
      </div>

      <Card className="rounded-3xl bg-sage/10 dark:bg-sage-dark/10 border border-sage dark:border-sage-dark">
        <p className="text-sm font-bold text-sage dark:text-sage-dark uppercase tracking-wide mb-1">
          Weekly Report
        </p>
        <p className="text-lg font-bold text-charcoal dark:text-text-dark">{mockAdherenceInsight.headline}</p>
        <p className="text-charcoal/80 dark:text-text-dark/80 mt-1">{mockAdherenceInsight.detail}</p>
      </Card>

      <div>
        <h2 className="font-display text-lg font-medium text-charcoal dark:text-text-dark mb-3">
          Recent Activity
        </h2>
        <div className="flex flex-col gap-3">
          {mockAlerts.map((a) => (
            <Card key={a.id} className={`rounded-3xl border flex items-start gap-3 ${severityStyles[a.severity]}`}>
              <span className="text-xl">{severityIcons[a.severity]}</span>
              <div>
                <p className="text-charcoal dark:text-text-dark">{a.message}</p>
                <p className="text-sm text-charcoal/50 dark:text-text-dark/50 mt-1">{a.time}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
