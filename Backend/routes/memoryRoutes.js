const express = require('express');
const router = express.Router();
const { requireFields } = require('../middleware/validate');
const { createMemory, getPatientMemories, deleteMemory } = require('../controllers/memoryController');

router.post('/memories', requireFields(['patientId', 'title', 'note']), createMemory);
router.get('/patients/:id/memories', getPatientMemories);
router.delete('/memories/:id', deleteMemory);

module.exports = router;
