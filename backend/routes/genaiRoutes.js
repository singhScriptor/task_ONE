const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/genAiController');
const authenticate = require('../middleware/authenticate');


router.post('/', authenticate, expenseController.addExpense);


router.get('/summary', authenticate, expenseController.getMonthlySummary);

module.exports = router;