# ReMind 

React + Vite + Tailwind PWA scaffold for SIH26003. All 10 pages are built and
fully styled with the "Warm Trust" colour palette, wired together with
routing, and running on mock data.

## How to run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## How to build for production (and test PWA behaviour)

```bash
npm run build
npm run preview
```

`npm run preview` serves the production build, which is required to properly
test install prompts and offline behaviour (the dev server does not register
the service worker the same way).

## Folder structure

```
src/
  components/       Button, Card, Tile, VoiceButton — shared, reused everywhere
  pages/
    patient/        Landing, PatientHome, Game, Reminders, MemoryVault, Reminiscence
    caregiver/      CaregiverDashboard, Analytics, ReminderManagement, Settings
  mock/             Fake data for reminders, memories, scores, patient profile
  App.jsx           All routing lives here
  main.jsx          App entry point
vite.config.js      PWA plugin config (manifest + service worker caching rules)
tailwind.config.js  CogniCare colour tokens (teal, amber, offwhite, charcoal, sage, etc.)
public/icons/       Placeholder app icons (192x192, 512x512) — replace with final design
```

## What's already working

- All 10 pages, fully styled, navigable end to end
- Shared component library (Button/Card/Tile/VoiceButton)
- Voice narration on every patient screen (Web Speech API)
- Working mini version of the pattern-matching game (mock adaptive difficulty)
- Reminders screen with mark-as-done
- Memory Vault gallery → Reminiscence screen (with offline-detection fallback message)
- Caregiver dashboard + analytics charts (Recharts) + predictive adherence insight card
- Reminder management (add/edit/delete placeholders, notification permission request)
- Settings screen with a live Offline & Sync panel (install status, notification
  status, last sync, manual Sync Now button)
- PWA manifest + service worker auto-generated via `vite-plugin-pwa`
  (cache-first for app shell, network-first for `/api/*` calls)
- Custom "Install CogniCare" banner on the Landing screen using `beforeinstallprompt`

## What still needs to be wired up (next steps)

1. **Real API calls** — replace everything in `src/mock/` with actual fetch
   calls to the backend, starting with login → game → score, per the plan.
2. **AI-1's difficulty module** — in `src/pages/patient/Game.jsx`, the
   `generateRound()` function is a placeholder. Replace its difficulty logic
   with a real call to AI-1's endpoint/module.
3. **AI-2's reminiscence endpoint** — in `src/pages/patient/Reminiscence.jsx`,
   `mockQuestions` should be replaced by a real call to AI-2's LLM endpoint.
4. **IndexedDB offline queue** — Reminders "mark done" and Memory Vault
   "Add a Memory" actions should be queued locally (e.g. using the `idb`
   library) when offline, then flushed on reconnect. Hook this into the
   Settings screen's "Sync Now" button.
5. **Real app icons** — swap the placeholder icons in `public/icons/` for a
   final designed icon (192x192 and 512x512 PNG).
6. **iOS install instructions** — iOS Safari doesn't support
   `beforeinstallprompt`; add a manual "Add to Home Screen" instructions modal
   for iOS users (detect via user agent).
7. **Lighthouse PWA audit** — run this on the production build before demo
   day and fix anything flagged (installability, service worker, offline reload).

## Colour palette reference

| Role | Hex |
|---|---|
| Primary (Teal) | `#0F5257` |
| Secondary (Amber) | `#E8A33D` |
| Background | `#FAF8F3` |
| Text | `#1B2E2E` |
| Success | `#3E7C59` |
| Alert (gentle) | `#D98E3E` |
| Error (rare) | `#B23A48` |
