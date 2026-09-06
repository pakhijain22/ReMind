import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import VoiceButton from '../../components/VoiceButton.jsx'
import { mockMemories } from '../../mock/memories.js'

export default function MemoryVault() {
  const navigate = useNavigate()
  const [memories] = useState(mockMemories)

  return (
    <div className="patient-screen min-h-screen bg-offwhite p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/patient/home')}>← Back</Button>
        <VoiceButton text="Your memory vault. Tap a memory to talk about it." />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-teal">Memory Vault</h1>
        <Button variant="secondary" icon="+" onClick={() => alert('Add a Memory — hook up file picker here')}>
          Add
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {memories.map((m) => (
          <Card
            key={m.id}
            onClick={() => navigate('/patient/reminiscence', { state: { memory: m } })}
          >
            <img
              src={m.photoUrl}
              alt={m.note}
              className="w-full h-40 object-cover rounded-xl mb-3"
            />
            <p className="text-charcoal">{m.note}</p>
            <p className="text-sm text-charcoal/60 mt-1">{m.date}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
