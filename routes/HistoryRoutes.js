const express = require('express');
const router = express.Router();
const { historyByUserId, watchVideo } = require('../controllers/HistoryController');
const { authenticate } = require('../middleware/middleware')

// PROTECTED ROUTES
router.get('/', authenticate, historyByUserId);
router.post('/watched', authenticate, watchVideo);

module.exports = router;