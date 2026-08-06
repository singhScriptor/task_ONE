const express = require('express');
const router = express.Router();
const forgotController = require('../controllers/forgotControllers');

// Handles POST /password/forgotpassword
router.post('/forgotpassword', forgotController.forgotPassword);

module.exports = router;