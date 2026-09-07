import React from 'react'
import { useNavigate } from 'react-router-dom'
import Tile from '../../components/Tile.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { mockGames } from '../../mock/patient.js'

const routeByGame = {
  'pattern-match': '/patient/game',
  'memory-recall': '/patient/game/memory-recall',
  'word-find': '/patient/game/word-find',
}

export default function GamesHub() {
  const navigate = useNavigate()

  return (
    <div className="patient-screen min-h-screen bg-offwhite dark:bg-bg-dark transition-colors duration-300 p-6 flex flex-col gap-6">
      <PageHeader
        title="Choose a Game"
        backTo="/patient/home"
        voiceText="Choose a game. Pattern Match, Memory Recall, or Word Find."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockGames.map((g) => (
          <Tile
            key={g.id}
            icon={g.icon}
            label={g.label}
            accent={g.accent}
            onClick={() => navigate(routeByGame[g.id])}
          />
        ))}
      </div>
    </div>
  )
}
