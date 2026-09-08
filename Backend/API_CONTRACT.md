# ReMind — API Contract (Single Source of Truth)

## Instructions for both AI assistants reading this document

This document is the **exact, locked contract** between the ReMind backend and frontend. Its purpose is to prevent format mismatches (wrong field names, wrong types, unexpected nesting) that cause long, painful debugging sessions when frontend and backend are built by different people at the same time.

**Rules for whichever AI is helping build against this document:**
1. Use the field names, types, and structure below **exactly as written** — do not rename fields, change casing, or restructure nesting "for clarity" or "best practice." Consistency with this document matters more than any individual preference.
2. If you (the AI) genuinely believe a field or structure should change, say so out loud to the person you're helping — do not silently implement something different from this document.
3. If a change is agreed, the person must update this shared file and send the updated version to their teammate **before** either side changes code. Never let backend and frontend code drift from two different versions of this document.
4. All field names are `camelCase`. All dates/timestamps are ISO 8601 strings (e.g. `"2026-09-10T14:30:00.000Z"`). All IDs are strings.
5. Every successful response returns HTTP status `200` (or `201` for creation). Every error response uses the **Standard Error Shape** defined below, regardless of which endpoint failed.

---

## Global Conventions

**Base URL (update once deployed):** `https://<your-backend-url>/api`

**Standard Error Shape** — every endpoint, on failure, returns this shape and an appropriate HTTP status code (400 for bad input, 404 for not found, 500 for server error):
```json
{
  "success": false,
  "error": {
    "message": "A short, human-readable description of what went wrong",
    "field": "fieldName or null if not field-specific"
  }
}
```

**Standard Success Shape** — every endpoint, on success, wraps its actual data like this:
```json
{
  "success": true,
  "data": { }
}
```
(`data` will be an object or array depending on the endpoint — shown per-endpoint below without the wrapper, for readability. Assume every response below sits inside `data`.)

---

## 1. Create Patient
`POST /patients`

**Request body:**
```json
{
  "name": "string",
  "loginPin": "string",
  "preferredLanguage": "string"
}
```
**Response (201):**
```json
{
  "id": "string",
  "name": "string",
  "loginPin": "string",
  "preferredLanguage": "string",
  "createdAt": "ISO date string"
}
```

## 2. Patient Login
`POST /patients/login`

**Request body:**
```json
{
  "loginPin": "string"
}
```
**Response (200):**
```json
{
  "id": "string",
  "name": "string",
  "preferredLanguage": "string"
}
```
**Error case:** invalid PIN → 400, `error.message: "Incorrect PIN"`

## 3. Get Patient Profile
`GET /patients/:id`

**Response (200):**
```json
{
  "id": "string",
  "name": "string",
  "preferredLanguage": "string",
  "createdAt": "ISO date string"
}
```

## 4. Submit Game Session + Score
`POST /game-sessions`

**Request body:**
```json
{
  "patientId": "string",
  "difficultyLevel": 1,
  "moves": 12,
  "score": 78,
  "completedAt": "ISO date string",
  "clientRequestId": "string"
}
```
- `difficultyLevel`: integer, 1 (easiest) to 3 (hardest)
- `clientRequestId`: a random string generated once per submission by the frontend (e.g. a UUID) — used by the backend to prevent duplicate saves if the same request is sent twice after reconnecting from offline.

**Response (201):**
```json
{
  "id": "string",
  "patientId": "string",
  "difficultyLevel": 1,
  "moves": 12,
  "score": 78,
  "completedAt": "ISO date string"
}
```

## 5. Get Score History
`GET /patients/:id/scores`

**Response (200):**
```json
[
  { "id": "string", "score": 78, "difficultyLevel": 1, "completedAt": "ISO date string" }
]
```
(Array sorted newest-first.)

## 6. Update Reminder Status
`PATCH /reminders/:id/status`

**Request body:**
```json
{
  "status": "done"
}
```
- `status` must be exactly one of: `"pending"`, `"done"`, `"missed"` — no other values.

**Response (200):**
```json
{
  "id": "string",
  "status": "done",
  "updatedAt": "ISO date string"
}
```

## 7. Get Patient's Reminders
`GET /patients/:id/reminders`

**Response (200):**
```json
[
  {
    "id": "string",
    "type": "medicine",
    "label": "Morning medicine",
    "scheduledTime": "9:00 AM",
    "weekday": "Monday",
    "status": "pending"
  }
]
```
- `type` is one of: `"medicine"`, `"hydration"`, `"meal"`, `"appointment"`.

## 8. Caregiver Dashboard Summary
`GET /patients/:id/dashboard-summary`

**Response (200):**
```json
{
  "remindersCompletedToday": 2,
  "remindersTotalToday": 4,
  "latestScore": 78,
  "currentDifficultyLevel": 2,
  "totalMemoriesSaved": 5
}
```

## 9. Sync Offline-Queued Data
`POST /sync`

**Request body:**
```json
{
  "reminderUpdates": [
    { "reminderId": "string", "status": "done", "clientRequestId": "string" }
  ],
  "newMemories": [
    { "clientRequestId": "string", "patientId": "string", "title": "string", "note": "string", "photo": "base64 string or null" }
  ]
}
```
**Response (200):**
```json
{
  "reminderUpdatesSynced": 1,
  "memoriesSynced": 1
}
```

## 10. Create Memory
`POST /memories`

**Request body:**
```json
{
  "patientId": "string",
  "title": "string",
  "note": "string",
  "photo": "base64 string or null"
}
```
**Response (201):**
```json
{
  "id": "string",
  "patientId": "string",
  "title": "string",
  "note": "string",
  "photo": "base64 string or null",
  "createdAt": "ISO date string"
}
```

## 11. Get Patient's Memories
`GET /patients/:id/memories`

**Response (200):**
```json
[
  { "id": "string", "title": "string", "note": "string", "photo": "base64 string or null", "createdAt": "ISO date string" }
]
```

## 12. Delete Memory
`DELETE /memories/:id`

**Response (200):**
```json
{ "id": "string", "deleted": true }
```

## 13. Save Reminiscence Session
`POST /reminiscence-sessions`

**Request body:**
```json
{
  "patientId": "string",
  "memoryId": "string",
  "questions": ["string", "string", "string"]
}
```
**Response (201):**
```json
{
  "id": "string",
  "patientId": "string",
  "memoryId": "string",
  "questions": ["string", "string", "string"],
  "createdAt": "ISO date string"
}
```

## 14. Get Reminiscence History
`GET /patients/:id/reminiscence-sessions`

**Response (200):**
```json
[
  { "id": "string", "memoryId": "string", "questions": ["string"], "createdAt": "ISO date string" }
]
```

---

## Checklist before either side writes integration code

- [ ] Both teammates have this exact same file (check the file is byte-for-byte identical, not paraphrased by each AI separately)
- [ ] Any disagreement about a field name/type has been resolved **in this document first**, then both sides update their code
- [ ] Whoever changes this document afterward re-shares it immediately — don't let one person's copy get ahead of the other's
