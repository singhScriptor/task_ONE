const express = require('express');
const router = express.Router();
const forgotController = require('../controllers/forgotControllers');

// Handles POST /password/forgotpassword
router.post('/forgotpassword', forgotController.forgotPassword);

router.get('/resetpassword/:id',forgotController.resetPassword);

router.post('/updatepassword/:id',forgotController.updatePassword)

module.exports = router;