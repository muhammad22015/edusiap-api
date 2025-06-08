const express = require('express');
const router = express.Router();
const { playlistVideosById, playlistVideoPositionUp, playlistVideoPositionDown } = require('../controllers/PlaylistVideosController');

router.get('/', playlistVideosById);
router.put('/position-up', playlistVideoPositionUp);
router.put('/position-down', playlistVideoPositionDown);

module.exports = router;