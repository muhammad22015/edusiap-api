const express = require('express');
const router = express.Router();
const { scoreById, uploadScoreById } = require('../controllers/UserQuizController');
const { authenticate } = require('../middleware/middleware')

// PROTECTED ROUTES
// router.get('/', authenticate, scoreById);
router.get('/:quiz_id', authenticate, scoreById);
router.post('/upload', authenticate, uploadScoreById);

module.exports = router;