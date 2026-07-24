const express = require('express');
const router = express.Router();

const premiumController = require('../controllers/premiumController')

const authenticate = require('../middleware/authenticate');


router.get('/showLeaderboard',authenticate,premiumController.getLeaderboard)

router.get('/status',authenticate,premiumController.getStatus)

module.exports = router