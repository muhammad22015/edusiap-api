const express = require('express');
const router = express.Router();
const { userProfileByUserId, updateUserProfileByUserId } = require('../controllers/UserProfileController');
const { authenticate } = require('../middleware/middleware')

// PROTECTED ROUTES
router.get('/', authenticate, userProfileByUserId);
router.put('/update', authenticate, updateUserProfileByUserId);

module.exports = router;