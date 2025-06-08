const express = require('express');
const router = express.Router();
const { quizbyId } = require('../controllers/QuizController');

router.get('/:video_id', quizbyId);

module.exports = router;