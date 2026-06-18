const express = require('express');
const router = express.Router();
const { getBanquesAide } = require('../controllers/banquesAideController');

router.get('/', getBanquesAide);

module.exports = router;
