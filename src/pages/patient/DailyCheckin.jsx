import React, { useState } from 'react'
import Card from '../../components/Card.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { moodOptions, mockCheckinHistory } from '../../mock/checkin.js'

export default function DailyCheckin() {
  const [selected, setSelected] = useState(null)

  const moodById = Object.fromEntries(moodOptions.map((m) => [m.id, m]))

  return (
    <div className="patient-screen min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-6">
      <PageHeader
        title="Daily Check-in"
        backTo="/patient/home"
        voiceText="Daily check in. How are you feeling today?"
      />

      <Card className="text-center rounded-3xl">
        <p className="font-display text-xl font-medium text-charcoal dark:text-text-dark mb-5">
          How are you feeling today?
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {moodOptions.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`min-h-touch rounded-2xl p-5 flex flex-col items-center gap-2 transition-all active:scale-95 ${
                selected === m.id
                  ? 'bg-teal dark:bg-teal-dark text-white scale-105 shadow-lg'
                  : 'bg-teal/10 dark:bg-teal-dark/10 text-charcoal dark:text-text-dark hover:-translate-y-1'
              }`}
            >
              <span className="text-4xl">{m.emoji}</span>
              <span className="font-bold">{m.label}</span>
            </button>
          ))}
        </div>
        {selected && (
          <p className="mt-5 text-sage dark:text-sage-dark font-bold animate-[fadeIn_0.5s_ease]">
            Thanks for sharing — that's been noted for today. 🌼
          </p>
        )}
      </Card>

      <Card className="rounded-3xl">
        <p className="font-display text-lg font-medium text-charcoal dark:text-text-dark mb-4">
          This Week
        </p>
        <div className="flex justify-between">
          {mockCheckinHistory.map((entry) => (
            <div key={entry.day} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{moodById[entry.mood]?.emoji}</span>
              <span className="text-xs text-charcoal/60 dark:text-text-dark/60">{entry.day}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
