import React, { useState } from 'react'
import Button from '../../components/Button.jsx'
import Card from '../../components/Card.jsx'
import PageHeader from '../../components/PageHeader.jsx'

// NER cultural pattern icons — swap with real assets later
const PATTERNS = ['🐘', '🦚', '🌺', '🎋', '🏮', '🪶']

function generateRound(difficulty) {
  // difficulty: 1 = 4 tiles, 2 = 6 tiles, 3 = 8 tiles (rule-based placeholder
  // for AI-1's real adaptive difficulty module, which will replace this function)
  const count = difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8
  const pairCount = count / 2
  const chosen = PATTERNS.slice(0, pairCount)
  const tiles = [...chosen, ...chosen]
    .map((icon) => ({ icon, id: Math.random(), matched: false }))
    .sort(() => Math.random() - 0.5)
  return tiles
}

export default function Game() {
  const [difficulty, setDifficulty] = useState(1)
  const [tiles, setTiles] = useState(() => generateRound(1))
  const [flipped, setFlipped] = useState([])
  const [score, setScore] = useState(0)

  const handleTileClick = (tile) => {
    if (tile.matched || flipped.find((f) => f.id === tile.id) || flipped.length === 2) return
    const newFlipped = [...flipped, tile]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped
      if (a.icon === b.icon) {
        setTiles((prev) =>
          prev.map((t) => (t.icon === a.icon ? { ...t, matched: true } : t))
        )
        setScore((s) => s + 10)
        setFlipped([])
        // Placeholder for adaptive difficulty: bump difficulty on a good streak.
        // Will be replaced by a call to AI-1's difficulty module, e.g.:
        // const nextDifficulty = await getNextDifficulty(patientId, sessionStats)
      } else {
        setTimeout(() => setFlipped([]), 800)
      }
    }
  }

  const allMatched = tiles.every((t) => t.matched)

  const nextLevel = () => {
    const next = Math.min(difficulty + 1, 3)
    setDifficulty(next)
    setTiles(generateRound(next))
    setFlipped([])
  }

  return (
    <div className="patient-screen min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-5">
      <PageHeader
        title="Pattern Match"
        backTo="/patient/games"
        voiceText={`Pattern matching game. Your score is ${score}.`}
      />

      <p className="text-lg text-charcoal dark:text-text-dark text-center -mt-2">Score: {score}</p>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto w-full">
        {tiles.map((tile) => {
          const isFlipped = tile.matched || flipped.find((f) => f.id === tile.id)
          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile)}
              className={`aspect-square rounded-2xl text-4xl flex items-center justify-center shadow-md transition-colors ${
                isFlipped ? 'bg-sage/20 dark:bg-sage-dark/20' : 'bg-teal dark:bg-teal-dark'
              }`}
            >
              {isFlipped ? tile.icon : ''}
            </button>
          )
        })}
      </div>

      {allMatched && (
        <Card className="text-center max-w-md mx-auto w-full rounded-3xl bg-white dark:bg-surface-dark">
          <p className="text-xl font-bold text-sage dark:text-sage-dark mb-3">Well done! 🎉</p>
          <Button onClick={nextLevel} fullWidth>Next Level</Button>
        </Card>
      )}
    </div>
  )
}
