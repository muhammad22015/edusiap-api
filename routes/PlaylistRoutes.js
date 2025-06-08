const express = require('express');
const router = express.Router();
const { allData } = require('../controllers/PlaylistController');

router.get('/', allData);

module.exports = router;