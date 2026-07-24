const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authenticate = require('../middleware/authenticate'); 

router.post('/add-budget', authenticate, budgetController.addBudget);
router.get('/get-budget', authenticate, budgetController.getBudget);

module.exports = router;