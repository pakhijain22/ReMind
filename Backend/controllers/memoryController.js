const MemoryVaultEntry = require('../models/MemoryVaultEntry');
const { success, error } = require('../utils/responseFormat');

// POST /memories — Create Memory
async function createMemory(req, res) {
  const { patientId, title, note, photo } = req.body;
  const memory = await MemoryVaultEntry.create({ patientId, title, note, photo: photo || null });
  return success(res, {
    id: memory._id.toString(),
    patientId: memory.patientId.toString(),
    title: memory.title,
    note: memory.note,
    photo: memory.photo,
    createdAt: memory.createdAt,
  }, 201);
}

// GET /patients/:id/memories — Get Patient's Memories
async function getPatientMemories(req, res) {
  const memories = await MemoryVaultEntry.find({ patientId: req.params.id }).sort({ createdAt: -1 });
  return success(res, memories.map(m => ({
    id: m._id.toString(),
    title: m.title,
    note: m.note,
    photo: m.photo,
    createdAt: m.createdAt,
  })));
}

// DELETE /memories/:id — Delete Memory
async function deleteMemory(req, res) {
  const memory = await MemoryVaultEntry.findByIdAndDelete(req.params.id);
  if (!memory) return error(res, 'Memory not found', 404);
  return success(res, { id: memory._id.toString(), deleted: true });
}

module.exports = { createMemory, getPatientMemories, deleteMemory };
