const express = require('express');
const router = express.Router();

const purchaseController = require("../controllers/subscriptionController");
const authenticate = require('../middleware/authenticate');

// Initiate payment session
router.post('/payment', authenticate, purchaseController.initiatePayment);

// Verify payment status
router.post('/verify/:orderId', authenticate, purchaseController.verifyPayment);

module.exports = router;