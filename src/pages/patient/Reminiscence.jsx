import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import VoiceButton from '../../components/VoiceButton.jsx'

// Mock questions — will be replaced by a call to AI-2's endpoint,
// e.g. POST /api/reminiscence { photoDescription } -> { questions: [...] }
const mockQuestions = [
  'What do you remember most about this day?',
  'Who else was there with you?',
  'How did this moment make you feel?',
]

export default function Reminiscence() {
  const navigate = useNavigate()
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
    <div className="patient-screen min-h-screen bg-offwhite p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/patient/vault')}>← Back</Button>
        <VoiceButton text="Reminiscence mode. Let's talk about this memory." />
      </div>

      <h1 className="text-2xl font-bold text-teal">Let's Remember Together</h1>

      {memory && (
        <img src={memory.photoUrl} alt={memory.note} className="w-full h-52 object-cover rounded-2xl" />
      )}

      {!isOnline ? (
        <Card className="text-center bg-alertamber/10 border border-alertamber">
          <p className="text-lg text-charcoal">📶 This needs an internet connection.</p>
          <p className="text-sm text-charcoal/70 mt-1">Please reconnect to continue this activity.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {mockQuestions.map((q, i) => (
            <Card key={i} className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <p className="text-lg text-charcoal">{q}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
