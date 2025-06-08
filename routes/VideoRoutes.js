const express = require('express');
const router = express.Router();
const { allData } = require('../controllers/VideoController');

router.get('/', allData);

module.exports = router;