const express = require('express');
const router = express.Router();

const premiumController = require('../controllers/premiumController');
const subscriptionController = require('../controllers/subscriptionController');

const authenticate = require('../middleware/authenticate');

// Payment & Verification Routes
router.post('/payment', authenticate, subscriptionController.initiatePayment);
router.post('/verify/:orderId', authenticate, subscriptionController.verifyPayment);

// Leaderboard & Status Routes
router.get('/showLeaderboard', authenticate, premiumController.getLeaderboard);
router.get('/status', authenticate, premiumController.getStatus);

module.exports = router;
