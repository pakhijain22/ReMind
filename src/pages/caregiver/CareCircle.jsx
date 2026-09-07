import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { mockContacts } from '../../mock/contacts.js'

export default function CareCircle() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState(mockContacts)

  const removeContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/caregiver/dashboard')}>← Back</Button>
        <h1 className="font-display text-2xl font-medium text-teal dark:text-teal-dark">Care Circle</h1>
      </div>

      <p className="text-charcoal/70 dark:text-text-dark/70 -mt-2">
        Family, friends, and doctors who show up on the patient's Family &amp; Friends screen.
      </p>

      <div className="flex flex-col gap-3">
        {contacts.map((c) => (
          <Card key={c.id} className="flex items-center justify-between gap-4 rounded-3xl bg-white dark:bg-surface-dark">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.emoji}</span>
              <div>
                <p className="font-bold text-teal dark:text-teal-dark">{c.name}</p>
                <p className="text-sm text-charcoal/60 dark:text-text-dark/60">{c.relation} · {c.phone}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => alert('Edit contact — hook up form here')}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => removeContact(c.id)}>
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Button
        variant="secondary"
        fullWidth
        onClick={() => alert('Add contact — hook up form here')}
      >
        + Add Contact
      </Button>
    </div>
  )
}
