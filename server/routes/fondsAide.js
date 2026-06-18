const express = require('express');
const router = express.Router();
const { getFondsAide } = require('../controllers/fondsAideController');

router.get('/', getFondsAide);

module.exports = router;
