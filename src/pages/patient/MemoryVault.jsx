import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { mockMemories } from '../../mock/memories.js'

export default function MemoryVault() {
  const navigate = useNavigate()
  const [memories] = useState(mockMemories)

  return (
    <div className="patient-screen min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-5">
      <PageHeader
        title="Memory Vault"
        backTo="/patient/home"
        voiceText="Your memory vault. Tap a memory to talk about it."
      />

      <div className="flex justify-end -mt-2">
        <Button variant="secondary" icon="+" onClick={() => alert('Add a Memory — hook up file picker here')}>
          Add
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {memories.map((m) => (
          <Card
            key={m.id}
            onClick={() => navigate('/patient/reminiscence', { state: { memory: m } })}
            className="rounded-3xl bg-white dark:bg-surface-dark hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <img
              src={m.photoUrl}
              alt={m.note}
              className="w-full h-40 object-cover rounded-xl mb-3"
            />
            <p className="text-charcoal dark:text-text-dark">{m.note}</p>
            <p className="text-sm text-charcoal/60 dark:text-text-dark/60 mt-1">{m.date}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
