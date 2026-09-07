const express = require('express');
const router = express.Router();
const { syncOfflineData } = require('../controllers/syncController');

router.post('/sync', syncOfflineData);

module.exports = router;
