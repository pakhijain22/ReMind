const express = require('express');
const router = express.Router();
const { requireFields } = require('../middleware/validate');
const { createPatient, loginPatient, getPatient } = require('../controllers/patientController');

router.post('/patients', requireFields(['name', 'loginPin']), createPatient);
router.post('/patients/login', requireFields(['loginPin']), loginPatient);
router.get('/patients/:id', getPatient);

module.exports = router;
