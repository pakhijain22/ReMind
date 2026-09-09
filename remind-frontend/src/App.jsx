import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OfflineBanner from './components/OfflineBanner';

import Landing from './pages/patient/Landing';
import PatientLogin from './pages/patient/PatientLogin';
import CreatePatient from './pages/patient/CreatePatient';
import PatientHome from './pages/patient/PatientHome';
import Game from './pages/patient/Game';
import GamesHub from './pages/patient/GamesHub';
import SimonGame from './pages/patient/SimonGame';
import MissingTileGame from './pages/patient/MissingTileGame';
import Reminders from './pages/patient/Reminders';
import MemoryVault from './pages/patient/MemoryVault';
import Reminiscence from './pages/patient/Reminiscence';

import CaregiverDashboard from './pages/caregiver/CaregiverDashboard';
import Analytics from './pages/caregiver/Analytics';
import ReminderManagement from './pages/caregiver/ReminderManagement';
import Settings from './pages/caregiver/Settings';

import { usePatient } from './context/PatientContext';

function RequirePatient({ children }) {
  const { patient } = usePatient();
  if (!patient) return <Navigate to="/login" replace />;
  return children;
}

const TEXT_SIZE_PX = { 'a-minus': '16px', a: '18px', 'a-plus': '21px', 'a-plus-plus': '24px' };

export default function App() {
  const { textSize } = usePatient();

  useEffect(() => {
    document.documentElement.style.fontSize = TEXT_SIZE_PX[textSize] || TEXT_SIZE_PX.a;
  }, [textSize]);

  return (
    <>
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/create-pin" element={<CreatePatient />} />

        <Route path="/home" element={<RequirePatient><PatientHome /></RequirePatient>} />
        <Route path="/game" element={<RequirePatient><GamesHub /></RequirePatient>} />
        <Route path="/game/pattern-match" element={<RequirePatient><Game /></RequirePatient>} />
        <Route path="/game/simon" element={<RequirePatient><SimonGame /></RequirePatient>} />
        <Route path="/game/missing-tile" element={<RequirePatient><MissingTileGame /></RequirePatient>} />
        <Route path="/reminders" element={<RequirePatient><Reminders /></RequirePatient>} />
        <Route path="/memories" element={<RequirePatient><MemoryVault /></RequirePatient>} />
        <Route path="/reminiscence" element={<RequirePatient><Reminiscence /></RequirePatient>} />
        <Route path="/reminiscence/:memoryId" element={<RequirePatient><Reminiscence /></RequirePatient>} />
        <Route path="/settings" element={<RequirePatient><Settings mode="patient" /></RequirePatient>} />

        <Route path="/caregiver" element={<CaregiverDashboard />} />
        <Route path="/caregiver/analytics" element={<Analytics />} />
        <Route path="/caregiver/reminders" element={<ReminderManagement />} />
        <Route path="/caregiver/settings" element={<Settings />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
