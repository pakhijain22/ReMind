import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import ThemeToggle from '../../components/ThemeToggle.jsx'

export default function PatientSettings() {
  const navigate = useNavigate()
  const [textSize, setTextSize] = useState('normal')
  const [voiceSpeed, setVoiceSpeed] = useState('normal')

  return (
    <div className="patient-screen min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-6">
      <PageHeader title="Settings" backTo="/patient/home" />

      <Card className="rounded-3xl">
        <p className="font-display text-lg font-medium text-charcoal dark:text-text-dark mb-4">
          Display
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-charcoal dark:text-text-dark">Appearance</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-charcoal dark:text-text-dark">Text Size</span>
          <div className="flex gap-2">
            <Button
              variant={textSize === 'normal' ? 'primary' : 'ghost'}
              onClick={() => setTextSize('normal')}
            >
              A
            </Button>
            <Button
              variant={textSize === 'large' ? 'primary' : 'ghost'}
              onClick={() => setTextSize('large')}
            >
              A+
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl">
        <p className="font-display text-lg font-medium text-charcoal dark:text-text-dark mb-4">
          Voice & Language
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-charcoal dark:text-text-dark">Voice Speed</span>
            <div className="flex gap-2">
              <Button
                variant={voiceSpeed === 'slow' ? 'primary' : 'ghost'}
                onClick={() => setVoiceSpeed('slow')}
              >
                Slow
              </Button>
              <Button
                variant={voiceSpeed === 'normal' ? 'primary' : 'ghost'}
                onClick={() => setVoiceSpeed('normal')}
              >
                Normal
              </Button>
            </div>
          </div>
          <select className="border border-charcoal/20 dark:border-white/10 bg-white dark:bg-surface-dark text-charcoal dark:text-text-dark rounded-xl p-3 text-lg">
            <option>English</option>
            <option>Assamese</option>
            <option>Hindi</option>
            <option>Bengali</option>
          </select>
        </div>
      </Card>

      <Button variant="ghost" fullWidth onClick={() => navigate('/')}>
        Switch Role
      </Button>
    </div>
  )
}
