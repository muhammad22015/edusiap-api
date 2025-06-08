const express = require('express');
const router = express.Router();
const { newAccessToken } = require('../controllers/RefreshTokenController');

router.post('/', newAccessToken);

module.exports = router;