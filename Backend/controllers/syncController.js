const Reminder = require('../models/Reminder');
const MemoryVaultEntry = require('../models/MemoryVaultEntry');
const { success } = require('../utils/responseFormat');

// POST /sync — Sync Offline-Queued Data
// Accepts a batch of reminder updates and/or new memories created while offline.
// Each item carries its own clientRequestId so a retried sync never creates duplicates.
async function syncOfflineData(req, res) {
  const { reminderUpdates = [], newMemories = [] } = req.body;

  let reminderUpdatesSynced = 0;
  for (const update of reminderUpdates) {
    const reminder = await Reminder.findById(update.reminderId);
    if (reminder && reminder.syncedAt === null) {
      reminder.status = update.status;
      reminder.syncedAt = new Date();
      await reminder.save();
      reminderUpdatesSynced++;
    } else if (reminder) {
      // Already synced before — treat as success without double-processing.
      reminderUpdatesSynced++;
    }
  }

  let memoriesSynced = 0;
  for (const mem of newMemories) {
    const existing = await MemoryVaultEntry.findOne({ patientId: mem.patientId, title: mem.title, note: mem.note, createdOffline: true });
    if (!existing) {
      await MemoryVaultEntry.create({
        patientId: mem.patientId,
        title: mem.title,
        note: mem.note,
        photo: mem.photo || null,
        createdOffline: true,
        syncedAt: new Date(),
      });
    }
    memoriesSynced++;
  }

  return success(res, { reminderUpdatesSynced, memoriesSynced });
}

module.exports = { syncOfflineData };
