const express = require('express');
const router = express.Router();
const { register, verify, login, logout } = require('../controllers/UserController');
const { authenticate } = require('../middleware/middleware')

// PUBLIC ROUTES
router.post('/register', register);
router.get('/verify', verify);
router.post('/login', login);

// PROTECTED ROUTES
router.post('/logout', authenticate, logout);

module.exports = router;