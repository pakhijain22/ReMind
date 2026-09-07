import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import PageHeader from '../../components/PageHeader.jsx'

// Mock questions — will be replaced by a call to AI-2's endpoint,
// e.g. POST /api/reminiscence { photoDescription } -> { questions: [...] }
const mockQuestions = [
  'What do you remember most about this day?',
  'Who else was there with you?',
  'How did this moment make you feel?',
]

export default function Reminiscence() {
  const location = useLocation()
  const memory = location.state?.memory
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return (
    <div className="patient-screen min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-5">
      <PageHeader
        title="Let's Remember Together"
        backTo="/patient/vault"
        voiceText="Reminiscence mode. Let's talk about this memory."
      />

      {memory && (
        <img src={memory.photoUrl} alt={memory.note} className="w-full h-52 object-cover rounded-2xl" />
      )}

      {!isOnline ? (
        <Card className="text-center bg-alertamber/10 dark:bg-amber-dark/10 border border-alertamber dark:border-amber-dark rounded-3xl">
          <p className="text-lg text-charcoal dark:text-text-dark">📶 This needs an internet connection.</p>
          <p className="text-sm text-charcoal/70 dark:text-text-dark/70 mt-1">Please reconnect to continue this activity.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {mockQuestions.map((q, i) => (
            <Card key={i} className="flex items-center gap-3 rounded-3xl bg-white dark:bg-surface-dark">
              <span className="text-2xl">💬</span>
              <p className="text-lg text-charcoal dark:text-text-dark">{q}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
