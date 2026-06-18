const express = require('express');
const router = express.Router();

const leaderboardController = require('../controllers/leaderboardController');

router.get('/global', leaderboardController.globalLeaderboard);

module.exports = router;
