import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Patient-side pages
import Landing from './pages/patient/Landing.jsx'
import PatientHome from './pages/patient/PatientHome.jsx'
import Game from './pages/patient/Game.jsx'
import Reminders from './pages/patient/Reminders.jsx'
import MemoryVault from './pages/patient/MemoryVault.jsx'
import Reminiscence from './pages/patient/Reminiscence.jsx'

// Caregiver-side pages
import CaregiverDashboard from './pages/caregiver/CaregiverDashboard.jsx'
import Analytics from './pages/caregiver/Analytics.jsx'
import ReminderManagement from './pages/caregiver/ReminderManagement.jsx'
import Settings from './pages/caregiver/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Patient side */}
      <Route path="/patient/home" element={<PatientHome />} />
      <Route path="/patient/game" element={<Game />} />
      <Route path="/patient/reminders" element={<Reminders />} />
      <Route path="/patient/vault" element={<MemoryVault />} />
      <Route path="/patient/reminiscence" element={<Reminiscence />} />

      {/* Caregiver side */}
      <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
      <Route path="/caregiver/analytics" element={<Analytics />} />
      <Route path="/caregiver/reminders" element={<ReminderManagement />} />
      <Route path="/caregiver/settings" element={<Settings />} />
    </Routes>
  )
}
