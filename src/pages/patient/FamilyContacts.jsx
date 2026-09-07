import React from 'react'
import Card from '../../components/Card.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { mockContacts } from '../../mock/contacts.js'

export default function FamilyContacts() {
  const screenText = `Family and friends. ${mockContacts
    .map((c) => `${c.name}, your ${c.relation}`)
    .join('. ')}`

  return (
    <div className="patient-screen min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-6">
      <PageHeader title="Family & Friends" backTo="/patient/home" voiceText={screenText} />

      <p className="text-lg text-charcoal/70 dark:text-text-dark/70 -mt-2">
        Tap a photo to call.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockContacts.map((c) => (
          <a key={c.id} href={`tel:${c.phone}`} className="block">
            <Card className="flex items-center gap-4 rounded-3xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="text-5xl bg-teal/10 dark:bg-teal-dark/10 rounded-full w-20 h-20 flex items-center justify-center shrink-0">
                {c.emoji}
              </div>
              <div className="flex-1">
                <p className="font-display text-xl font-medium text-teal dark:text-teal-dark">{c.name}</p>
                <p className="text-charcoal/70 dark:text-text-dark/70">{c.relation}</p>
              </div>
              <div className="text-3xl">📞</div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  )
}
