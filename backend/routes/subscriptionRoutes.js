const express = require('express');
const router = express.Router();

// Import controller
const purchaseController = require("../controllers/subscriptionController");

// Import authentication middleware
const authenticate = require('../middleware/authenticate');

// 1. Initiate payment session (MUST BE POST and match frontend URL '/initiate')
router.post('/payment', authenticate, purchaseController.initiatePayment);

// 2. Verify payment status on Cashfree redirect
router.post('/verify/:orderId', authenticate, purchaseController.verifyPayment);

module.exports = router;