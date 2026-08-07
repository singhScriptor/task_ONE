const express = require('express');
const router = express.Router();

const genAiController = require('../controllers/genAiController');
const authenticate = require('../middleware/authenticate');

// Add expense with AI categorization
router.post('/', authenticate, genAiController.addExpense);

// Get monthly AI summary
router.get('/summary', authenticate, genAiController.getMonthlySummary);

module.exports = router;