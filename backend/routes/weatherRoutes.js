const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const auth = require('../middleware/auth');

router.get('/current', auth.protect, weatherController.getCurrent);
router.get('/forecast', auth.protect, weatherController.getForecast);

module.exports = router;