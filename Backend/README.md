# CogniCare Backend

Node.js + Express + MongoDB backend for CogniCare, built to match `API_CONTRACT.md` exactly.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your MongoDB Atlas connection string:
   ```
   cp .env.example .env
   ```
3. Run the server in dev mode (auto-restarts on file changes):
   ```
   npm run dev
   ```
4. You should see `Database connected` and `CogniCare backend running on port 5000` in the terminal.
5. Visit `http://localhost:5000/` in a browser — you should see `{"status":"CogniCare API is running"}`.

## Seed sample data (do this once, for demo-ready data)

```
npm run seed
```

This creates one sample patient (PIN: `1234`), a few reminders (including two "missed" ones on Sunday — this is what triggers the Predictive Adherence insight), and two sample memories for the Memory Vault.

## Project structure

```
backend/
  config/         → database connection
  models/         → Mongoose schemas (Patient, Reminder, MemoryVaultEntry, etc.)
  controllers/    → the actual logic for each endpoint
  routes/         → maps URLs to controller functions
  middleware/     → shared error handling and input validation
  seed/           → sample data script
  server.js       → app entry point
  API_CONTRACT.md → the locked contract this backend was built against — check here first if a response shape looks wrong
```

## Every endpoint built (see API_CONTRACT.md for exact request/response shapes)

- `POST /api/patients` — create patient
- `POST /api/patients/login` — patient login
- `GET /api/patients/:id` — get patient profile
- `POST /api/game-sessions` — submit a completed game round (idempotent via `clientRequestId`)
- `GET /api/patients/:id/scores` — score history
- `PATCH /api/reminders/:id/status` — mark a reminder done/missed
- `GET /api/patients/:id/reminders` — list a patient's reminders
- `GET /api/patients/:id/reminder-logs` — history of past reminder occurrences, for Predictive Adherence
- `GET /api/patients/:id/dashboard-summary` — combined caregiver dashboard data
- `POST /api/sync` — sync offline-queued reminder updates and memories
- `POST /api/memories` — create a memory
- `GET /api/patients/:id/memories` — list a patient's memories
- `DELETE /api/memories/:id` — delete a memory
- `POST /api/reminiscence-sessions` — save a reminiscence Q&A session
- `GET /api/patients/:id/reminiscence-sessions` — reminiscence history

## Notes for whoever picks this up next

- All responses follow the `{ success, data }` / `{ success: false, error }` shape from `API_CONTRACT.md` — don't deviate from this even for a "quick" endpoint.
- If Frontend requests a field/shape change, update `API_CONTRACT.md` first, then the relevant model/controller here — don't let this code and the contract document drift apart.
- `.env` is gitignored on purpose — never commit real database credentials.
