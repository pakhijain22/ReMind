import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { mockMemories } from '../../mock/memories.js'
import { mockSummary } from '../../mock/scores.js'

export default function MemoryManager() {
  const navigate = useNavigate()
  const [memories, setMemories] = useState(mockMemories)

  const deleteMemory = (id) => {
    setMemories((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/caregiver/dashboard')}>← Back</Button>
        <h1 className="font-display text-2xl font-medium text-teal dark:text-teal-dark">Memory Manager</h1>
      </div>

      <p className="text-charcoal/70 dark:text-text-dark/70 -mt-2">
        Add or remove photos and moments from {mockSummary.patientName}'s Memory Vault.
      </p>

      <Button
        variant="secondary"
        onClick={() => alert('Add a Memory — hook up file picker + upload here')}
      >
        + Add New Memory
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {memories.map((m) => (
          <Card key={m.id} className="rounded-3xl bg-white dark:bg-surface-dark">
            <img src={m.photoUrl} alt={m.note} className="w-full h-40 object-cover rounded-xl mb-3" />
            <p className="text-charcoal dark:text-text-dark">{m.note}</p>
            <p className="text-sm text-charcoal/60 dark:text-text-dark/60 mt-1 mb-3">{m.date}</p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => alert('Edit memory — hook up form here')}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => deleteMemory(m.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
        {memories.length === 0 && (
          <p className="text-charcoal/60 dark:text-text-dark/60">No memories yet — add the first one above.</p>
        )}
      </div>
    </div>
  )
}
