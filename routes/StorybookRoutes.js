const express = require('express');
const router = express.Router();
const { allData, bookbyId } = require('../controllers/StorybookController');

router.get('/', allData);
router.get('/read', bookbyId);

module.exports = router;