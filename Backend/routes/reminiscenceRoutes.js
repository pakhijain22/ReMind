const express = require('express');
const router = express.Router();
const { requireFields } = require('../middleware/validate');
const { saveReminiscenceSession, getReminiscenceHistory } = require('../controllers/reminiscenceController');

router.post('/reminiscence-sessions', requireFields(['patientId', 'memoryId', 'questions']), saveReminiscenceSession);
router.get('/patients/:id/reminiscence-sessions', getReminiscenceHistory);

module.exports = router;
