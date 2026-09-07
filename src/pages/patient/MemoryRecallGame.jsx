import React, { useEffect, useState, useCallback } from 'react'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import PageHeader from '../../components/PageHeader.jsx'

const PADS = [
  { id: 0, color: 'bg-teal dark:bg-teal-dark', lit: 'bg-teal/40 dark:bg-teal-dark/40 scale-95' },
  { id: 1, color: 'bg-amber dark:bg-amber-dark', lit: 'bg-amber/40 dark:bg-amber-dark/40 scale-95' },
  { id: 2, color: 'bg-sage dark:bg-sage-dark', lit: 'bg-sage/40 dark:bg-sage-dark/40 scale-95' },
  { id: 3, color: 'bg-rose', lit: 'bg-rose/40 scale-95' },
]

export default function MemoryRecallGame() {
  const [sequence, setSequence] = useState([])
  const [userStep, setUserStep] = useState(0)
  const [activePad, setActivePad] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('Watch the pattern, then repeat it!')

  const startLevel = useCallback((lvl) => {
    const newSeq = Array.from({ length: lvl + 2 }, () => Math.floor(Math.random() * 4))
    setSequence(newSeq)
    setUserStep(0)
    setIsPlaying(true)
    setMessage('Watch closely...')
  }, [])

  useEffect(() => {
    startLevel(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isPlaying || sequence.length === 0) return
    let i = 0
    const playNext = () => {
      if (i >= sequence.length) {
        setActivePad(null)
        setIsPlaying(false)
        setMessage('Your turn — tap the pattern!')
        return
      }
      setActivePad(sequence[i])
      setTimeout(() => {
        setActivePad(null)
        i += 1
        setTimeout(playNext, 300)
      }, 550)
    }
    const t = setTimeout(playNext, 500)
    return () => clearTimeout(t)
  }, [sequence, isPlaying])

  const handlePadTap = (padId) => {
    if (isPlaying) return
    if (padId === sequence[userStep]) {
      const nextStep = userStep + 1
      if (nextStep === sequence.length) {
        setScore((s) => s + level * 10)
        setMessage('Well done! Next round... 🎉')
        const nextLevel = level + 1
        setLevel(nextLevel)
        setTimeout(() => startLevel(nextLevel), 1200)
      } else {
        setUserStep(nextStep)
      }
    } else {
      setMessage("That's okay — let's try again!")
      setTimeout(() => startLevel(Math.max(1, level - 1 === 0 ? 1 : level)), 1200)
      setLevel((l) => Math.max(1, l))
    }
  }

  return (
    <div className="patient-screen min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-5">
      <PageHeader
        title="Memory Recall"
        backTo="/patient/games"
        voiceText={`Memory recall game. ${message} Your score is ${score}.`}
      />

      <div className="text-center -mt-2">
        <p className="text-lg text-charcoal dark:text-text-dark">Score: {score}</p>
        <p className="text-charcoal/70 dark:text-text-dark/70">{message}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto w-full">
        {PADS.map((pad) => (
          <button
            key={pad.id}
            onClick={() => handlePadTap(pad.id)}
            disabled={isPlaying}
            className={`aspect-square rounded-3xl shadow-md transition-all duration-150 ${
              activePad === pad.id ? pad.lit : pad.color
            } ${isPlaying ? 'cursor-default' : 'active:scale-95'}`}
          />
        ))}
      </div>

      <Card className="text-center max-w-xs mx-auto w-full rounded-3xl bg-white dark:bg-surface-dark">
        <p className="text-charcoal dark:text-text-dark">Level {level}</p>
      </Card>

      <Button variant="ghost" onClick={() => startLevel(1)} className="max-w-xs mx-auto w-full">
        Restart
      </Button>
    </div>
  )
}
