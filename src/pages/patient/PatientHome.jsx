import React from 'react'
import { useNavigate } from 'react-router-dom'
import Tile from '../../components/Tile.jsx'
import Card from '../../components/Card.jsx'
import VoiceButton from '../../components/VoiceButton.jsx'
import { mockPatient, mockGames } from '../../mock/patient.js'
import { mockReminders, reminderIcons } from '../../mock/reminders.js'

export default function PatientHome() {
  const navigate = useNavigate()
  const nextReminder = mockReminders.find((r) => !r.done)

  const screenText = `${mockPatient.greeting}, ${mockPatient.name}. ${
    nextReminder ? `Your next reminder is ${nextReminder.title} at ${nextReminder.time}.` : 'You have no pending reminders.'
  }`

  return (
    <div className="patient-screen min-h-screen bg-offwhite p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg text-charcoal">{mockPatient.greeting},</p>
          <h1 className="text-3xl font-bold text-teal">{mockPatient.name}</h1>
        </div>
        <VoiceButton text={screenText} />
      </div>

      {nextReminder && (
        <Card
          onClick={() => navigate('/patient/reminders')}
          className="bg-alertamber/10 border border-alertamber flex items-center gap-4"
        >
          <span className="text-3xl">{reminderIcons[nextReminder.type]}</span>
          <div>
            <p className="text-sm text-charcoal">Next reminder</p>
            <p className="text-xl font-bold text-teal">{nextReminder.title} — {nextReminder.time}</p>
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-bold text-charcoal mb-3">Play a Game</h2>
        <div className="grid grid-cols-1 gap-4">
          {mockGames.map((game) => (
            <Tile
              key={game.id}
              icon={game.icon}
              label={game.label}
              accent={game.accent}
              onClick={() => navigate('/patient/game')}
            />
          ))}
        </div>
      </div>

      <Tile
        icon="📷"
        label="Memory Vault"
        accent="amber"
        onClick={() => navigate('/patient/vault')}
      />
    </div>
  )
}
