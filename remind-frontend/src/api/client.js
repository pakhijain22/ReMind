// src/api/client.js
//
// Every function here maps to one endpoint in CogniCare_API_Contract.md.
// Field names, casing, and shapes follow that document exactly — do not
// rename anything here without updating the contract doc first and telling
// your backend teammate.
//
// Base URL comes from an environment variable so nobody ever hardcodes a
// URL into the code. Set VITE_API_BASE_URL in your .env file (see .env.example).

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// The three AI routes live in the same backend process, mounted at /ai
// (see "Architecture note: AI routes" in the contract doc). We derive the
// /ai base from the same host so you only ever configure one URL.
const AI_BASE_URL = BASE_URL.replace(/\/api\/?$/, '/api/ai');

class ApiError extends Error {
  constructor(message, status, field) {
    super(message);
    this.status = status;
    this.field = field;
  }
}

async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
  } catch (networkErr) {
    // No network at all — let callers fall back to offline behaviour.
    throw new ApiError('You appear to be offline.', 0, null);
  }

  let body;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok || !body || body.success === false) {
    const message = body?.error?.message || `Request failed (${res.status})`;
    const field = body?.error?.field || null;
    throw new ApiError(message, res.status, field);
  }

  return body.data;
}

function get(path) {
  return request(`${BASE_URL}${path}`, { method: 'GET' });
}
function post(path, payload) {
  return request(`${BASE_URL}${path}`, { method: 'POST', body: JSON.stringify(payload) });
}
function patch(path, payload) {
  return request(`${BASE_URL}${path}`, { method: 'PATCH', body: JSON.stringify(payload) });
}
function del(path) {
  return request(`${BASE_URL}${path}`, { method: 'DELETE' });
}

// ---- 1. Create Patient ----------------------------------------------------
export function createPatient({ name, loginPin, preferredLanguage }) {
  return post('/patients', { name, loginPin, preferredLanguage });
}

// ---- 2. Patient Login -------------------------------------------------
export function loginPatient(loginPin) {
  return post('/patients/login', { loginPin });
}

// ---- 3. Get Patient Profile ------------------------------------------
export function getPatientProfile(id) {
  return get(`/patients/${id}`);
}

// ---- 4. Submit Game Session + Score ------------------------------------
export function submitGameSession({ patientId, difficultyLevel, moves, score, completedAt, clientRequestId, gameType = 'pattern-match' }) {
  return post('/game-sessions', { patientId, difficultyLevel, moves, score, completedAt, clientRequestId, gameType });
}

// ---- 5. Get Score History ----------------------------------------------
export function getScoreHistory(patientId) {
  return get(`/patients/${patientId}/scores`);
}

// ---- 6. Update Reminder Status ------------------------------------------
export function updateReminderStatus(reminderId, status) {
  return patch(`/reminders/${reminderId}/status`, { status });
}

// ---- 7. Get Patient's Reminders -----------------------------------------
export function getReminders(patientId) {
  return get(`/patients/${patientId}/reminders`);
}

// ---- 8. Caregiver Dashboard Summary --------------------------------------
export function getDashboardSummary(patientId) {
  return get(`/patients/${patientId}/dashboard-summary`);
}

// ---- 9. Sync Offline-Queued Data -----------------------------------------
export function syncOfflineData({ reminderUpdates = [], newMemories = [] }) {
  return post('/sync', { reminderUpdates, newMemories });
}

// ---- 10. Create Memory ---------------------------------------------------
export function createMemory({ patientId, title, note, photo = null }) {
  return post('/memories', { patientId, title, note, photo });
}

// ---- 11. Get Patient's Memories ------------------------------------------
export function getMemories(patientId) {
  return get(`/patients/${patientId}/memories`);
}

// ---- 12. Delete Memory ----------------------------------------------------
export function deleteMemory(memoryId) {
  return del(`/memories/${memoryId}`);
}

// ---- 13. Save Reminiscence Session ----------------------------------------
export function saveReminiscenceSession({ patientId, memoryId, questions, responses }) {
  return post('/reminiscence-sessions', { patientId, memoryId, questions, responses });
}

// ---- 14. Get Reminiscence History -----------------------------------------
export function getReminiscenceHistory(patientId) {
  return get(`/patients/${patientId}/reminiscence-sessions`);
}

// ---- 15. Get Reminder Occurrence Logs --------------------------------------
export function getReminderLogs(patientId) {
  return get(`/patients/${patientId}/reminder-logs`);
}

// ---- ASSUMED — not in the locked contract doc ------------------------------
//
// The contract only documents Section 6 (update status) and Section 7 (list)
// for reminders. It does NOT document create/edit/delete endpoints, even
// though Chapter 05 of the documentation lists "Reminders CRUD" as a backend
// responsibility. The three functions below are my best-guess shapes so the
// Reminder Management screen has something to call — flag this to your
// backend teammate and update CogniCare_API_Contract.md with the real
// shape once confirmed, per the contract doc's own Rule 2 and 3.

export function createReminder({ patientId, type, label, scheduledTime, weekday }) {
  return post('/reminders', { patientId, type, label, scheduledTime, weekday });
}

export function updateReminder(reminderId, { type, label, scheduledTime, weekday }) {
  return patch(`/reminders/${reminderId}`, { type, label, scheduledTime, weekday });
}

export function deleteReminder(reminderId) {
  return del(`/reminders/${reminderId}`);
}

// ---- AI routes (mounted at /ai in the same backend) ------------------------
//
// NOTE: the contract document names these three routes but doesn't pin down
// their exact request/response JSON shape the way it does for the sections
// above. The shapes below are my best assumption based on the AI Pipeline
// Milestone Guide's own function signatures — confirm them against your
// actual `ai/routes/aiRoutes.js` and adjust here (this is the ONLY file that
// needs to change if a shape differs).

// AI-1 — Adaptive difficulty. Mirrors getNextLevel(currentLevel, lastThreeResults).
export function getNextDifficulty({ currentLevel, lastThreeResults }) {
  return request(`${AI_BASE_URL}/next-difficulty`, {
    method: 'POST',
    body: JSON.stringify({ currentLevel, lastThreeResults })
  });
  // Expected response: { nextLevel: 1 | 2 | 3 }
}

// AI-2 — Reminiscence questions from a photo description.
export function getReminiscenceQuestions({ photoDescription }) {
  return request(`${AI_BASE_URL}/reminiscence`, {
    method: 'POST',
    body: JSON.stringify({ photoDescription })
  });
  // Expected response: { questions: ["...", "...", "..."] }
}

// AI-2 — Predictive adherence insight for a patient.
export function getAdherenceInsight(patientId) {
  return request(`${AI_BASE_URL}/adherence-insight?patientId=${encodeURIComponent(patientId)}`, {
    method: 'GET'
  });
  // Expected response: { insights: ["Reminder often missed on Sundays — consider adjusting the time."] }
}

export { ApiError };
