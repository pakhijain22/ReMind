import { createContext, useContext, useEffect, useState } from 'react';

// Holds the logged-in patient's session (id, name, preferredLanguage) so any
// page can read "who is playing right now" without re-fetching it constantly.
// Persisted to localStorage only (not sensitive data) so a page refresh or
// a PWA relaunch doesn't force the patient to log in again.

const PatientContext = createContext(null);
const STORAGE_KEY = 'remind.patientSession';

export function PatientProvider({ children }) {
  const [patient, setPatientState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [textSize, setTextSizeState] = useState(() => {
    return localStorage.getItem('remind.textSize') || 'a';
  });

  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('remind.theme') || 'light';
  });

  const [accent, setAccentState] = useState(() => {
    return localStorage.getItem('remind.accent') || 'teal';
  });

  useEffect(() => {
    if (patient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patient));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [patient]);

  useEffect(() => {
    localStorage.setItem('remind.textSize', textSize);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('remind.theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('remind.accent', accent);
  }, [accent]);

  function setPatient(nextPatient) {
    setPatientState(nextPatient);
  }

  function logout() {
    setPatientState(null);
  }

  function setTextSize(size) {
    setTextSizeState(size);
  }

  function setTheme(nextTheme) {
    setThemeState(nextTheme);
  }

  function setAccent(nextAccent) {
    setAccentState(nextAccent);
  }

  return (
    <PatientContext.Provider value={{ patient, setPatient, logout, textSize, setTextSize, theme, setTheme, accent, setAccent }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error('usePatient must be used inside a PatientProvider');
  return ctx;
}
