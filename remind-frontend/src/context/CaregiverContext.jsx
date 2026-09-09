import { createContext, useContext, useEffect, useState } from 'react';

// The API contract has no separate caregiver-auth endpoints — a caregiver
// simply looks up the one patient they care for (MVP is single-patient,
// per the blueprint's Page 8 note, "built to scale to many" later).
// This is kept separate from PatientContext so a caregiver browsing the
// dashboard on a shared device never overwrites the patient's own login.

const CaregiverContext = createContext(null);
const STORAGE_KEY = 'remind.caregiverPatient';

export function CaregiverProvider({ children }) {
  const [caregiverPatient, setCaregiverPatientState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (caregiverPatient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(caregiverPatient));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [caregiverPatient]);

  function setCaregiverPatient(patient) {
    setCaregiverPatientState(patient);
  }

  function clearCaregiverPatient() {
    setCaregiverPatientState(null);
  }

  return (
    <CaregiverContext.Provider value={{ caregiverPatient, setCaregiverPatient, clearCaregiverPatient }}>
      {children}
    </CaregiverContext.Provider>
  );
}

export function useCaregiverPatient() {
  const ctx = useContext(CaregiverContext);
  if (!ctx) throw new Error('useCaregiverPatient must be used inside a CaregiverProvider');
  return ctx;
}
