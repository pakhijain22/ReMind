// src/utils/offlineQueue.js
//
// Real offline queueing using IndexedDB (via the tiny `idb` helper library),
// per Chapter 03.2 of the blueprint: actions taken with no signal (marking a
// reminder done, adding a memory) get queued here, then flushed to the real
// backend's /sync endpoint once connectivity returns.

import { openDB } from 'idb';
import { syncOfflineData } from '../api/client';

const DB_NAME = 'remind-offline-db';
const DB_VERSION = 1;
const REMINDER_STORE = 'queuedReminderUpdates';
const MEMORY_STORE = 'queuedMemories';

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(REMINDER_STORE)) {
        db.createObjectStore(REMINDER_STORE, { keyPath: 'clientRequestId' });
      }
      if (!db.objectStoreNames.contains(MEMORY_STORE)) {
        db.createObjectStore(MEMORY_STORE, { keyPath: 'clientRequestId' });
      }
    }
  });
}

function makeClientRequestId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function queueReminderUpdate(reminderId, status) {
  const db = await getDb();
  const entry = { reminderId, status, clientRequestId: makeClientRequestId() };
  await db.add(REMINDER_STORE, entry);
  return entry;
}

export async function queueNewMemory({ patientId, title, note, photo = null }) {
  const db = await getDb();
  const entry = { patientId, title, note, photo, clientRequestId: makeClientRequestId() };
  await db.add(MEMORY_STORE, entry);
  return entry;
}

export async function getQueuedCounts() {
  const db = await getDb();
  const reminderUpdates = await db.getAll(REMINDER_STORE);
  const newMemories = await db.getAll(MEMORY_STORE);
  return { reminderUpdates: reminderUpdates.length, newMemories: newMemories.length };
}

// Sends everything queued to /sync, then clears local entries that synced
// successfully. Safe to call repeatedly — an empty queue is a no-op.
export async function flushOfflineQueue() {
  const db = await getDb();
  const reminderUpdates = await db.getAll(REMINDER_STORE);
  const newMemories = await db.getAll(MEMORY_STORE);

  if (reminderUpdates.length === 0 && newMemories.length === 0) {
    return { reminderUpdatesSynced: 0, memoriesSynced: 0 };
  }

  const result = await syncOfflineData({ reminderUpdates, newMemories });

  const tx1 = db.transaction(REMINDER_STORE, 'readwrite');
  await Promise.all(reminderUpdates.map((r) => tx1.store.delete(r.clientRequestId)));
  await tx1.done;

  const tx2 = db.transaction(MEMORY_STORE, 'readwrite');
  await Promise.all(newMemories.map((m) => tx2.store.delete(m.clientRequestId)));
  await tx2.done;

  return result;
}
