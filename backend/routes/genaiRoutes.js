const express = require('express')
const router = express.Router()
const expenseController = require('../controllers/genAiController')


router.post('/',expenseController.addExpense)

router.get('/summary',expenseController.getMonthlySummary)

module.exports = router