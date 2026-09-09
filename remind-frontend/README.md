# ReMind — Frontend (rebuilt)

A brand-new React + Vite + Tailwind frontend for ReMind, built to match
`CogniCare_API_Contract.md` exactly, so it can talk to your real backend and
AI pipeline instead of the old, disconnected frontend.

Read this whole file before you touch anything else — the "Connect to your
real backend" section is the part that actually makes the app work.

---

## 1. What's different from the old frontend

- Old frontend: built its own separate backend, with its own field names and shapes. That's why nothing connected.
- This frontend: **has no backend of its own.** Every single network call lives in one file, `src/api/client.js`, and every function in that file matches a numbered section of `CogniCare_API_Contract.md`. If your real backend implements that contract, this frontend will work against it with zero code changes beyond setting one URL (see below).

## 2. Install and run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

To test the production build (needed for real install/offline testing):

```bash
npm run build
npm run preview
```

## 3. Connect to your real backend — the one step that matters

1. Copy `.env.example` to a new file called `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and replace the placeholder with your **actual deployed backend URL** (Render/Railway/whatever you used), keeping `/api` on the end:
   ```
   VITE_API_BASE_URL=https://your-actual-backend.onrender.com/api
   ```
3. Restart the dev server (`Ctrl+C`, then `npm run dev` again) so Vite picks up the new environment variable.

That's it — every page will now call your real backend. You never need to
edit `src/api/client.js` to point at a URL; the URL only ever lives in `.env`.

**Where the AI routes are assumed to live:** the contract doc says AI-1 and
AI-2's routes are mounted at `/ai` in the same backend process as the rest of
the API. `client.js` automatically swaps `/api` for `/ai` in your base URL to
build those requests — so if your backend's `/ai` routes live somewhere else,
that's the one line to change (`AI_BASE_URL` near the top of `client.js`).

## 4. What to double-check with your backend/AI teammates before demo day

Two things in this frontend are **assumptions**, not confirmed contract, because
the documents you gave me didn't pin them down. Both are flagged with comments
in the code (search for "ASSUMED" in `src/api/client.js`), but read this too:

1. **The three `/ai/...` request and response shapes.** The contract document
   names the routes (`/ai/next-difficulty`, `/ai/adherence-insight`,
   `/ai/reminiscence`) but never shows their exact JSON. I built them to match
   the example function signatures in the AI Pipeline Milestone Guide:
   - `POST /ai/next-difficulty` — body `{ currentLevel, lastThreeResults }` → expects back `{ nextLevel }`
   - `POST /ai/reminiscence` — body `{ photoDescription }` → expects back `{ questions: [...] }`
   - `GET /ai/adherence-insight?patientId=...` → expects back `{ insights: [...] }`

   If AI-1/AI-2's actual routes return something differently shaped, you only
   need to change the three matching functions in `src/api/client.js`.

2. **Reminder create/edit/delete.** The contract document only defines
   "Update Reminder Status" (Section 6) and "Get Patient's Reminders"
   (Section 7) — there's no documented endpoint for a caregiver to *create* a
   new reminder or delete one, even though the main documentation lists
   "Reminders CRUD" as a backend responsibility. I added assumed endpoints
   (`POST /reminders`, `PATCH /reminders/:id`, `DELETE /reminders/:id`) so the
   Reminder Management screen has something to call. **Please confirm the real
   shape with your backend teammate and update the contract doc** — this is
   exactly the kind of mismatch the contract doc was written to prevent, so
   it's worth locking down properly rather than guessing twice.

## 5. Folder structure

```
src/
  api/client.js         Every backend + AI call, one function per endpoint
  context/               PatientContext (logged-in patient) and
                          CaregiverContext (which patient a caregiver is viewing)
  utils/
    voice.js              Web Speech API wrapper (used by VoiceButton)
    offlineQueue.js        Real IndexedDB offline queue + sync
  components/            Button, Card, Tile, VoiceButton, NERBackground,
                          PageShell, OfflineBanner, CaregiverPatientGate
  pages/
    patient/              Landing, PatientLogin, PatientHome, Game,
                          Reminders, MemoryVault, Reminiscence
    caregiver/            CaregiverDashboard, Analytics,
                          ReminderManagement, Settings
public/icons/            Placeholder app icons — see section 7 below
vite.config.js           PWA plugin (manifest + service worker + offline caching)
tailwind.config.js       The locked "Warm Trust" colour palette + fonts
```

## 6. Design notes

- Colours, type, spacing all follow the "Warm Trust" system from the
  documentation exactly (Deep Teal `#0F5257`, Amber `#E8A33D`, Off-White
  background, no pure red on patient screens, 56px minimum touch targets,
  icon + text always paired, voice narration on every patient screen).
- The North-East India feel you asked for is in `src/components/NERBackground.jsx`:
  layered hill silhouettes and a thin woven-diamond border pattern, both at
  very low opacity (6–14%), sitting behind every page. No photos, no people,
  no place names — just a quiet visual mood.
- The one signature motion (soft cross-fade + 8px rise on page load) lives in
  `PageShell.jsx` so every page gets it automatically.

## 7. Before your actual demo day

- Replace the placeholder icons in `public/icons/` with a final design —
  the current ones are a simple generated placeholder in the same colours,
  not final artwork.
- Run a Lighthouse PWA audit on the production build (`npm run build && npm run preview`) and fix anything it flags.
- Test the "airplane mode" flow for real: mark a reminder done with wifi off, confirm it queues, then turn wifi back on and tap **Sync Now** in Settings to confirm it flushes.
- Confirm the two assumptions in section 4 with your AI/backend teammates.
