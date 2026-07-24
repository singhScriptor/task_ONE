const express = require('express')

const router = express.Router()

const expenseControl = require('../controllers/expensesController')

const authenticate = require('../middleware/authenticate')


router .post('/',authenticate,expenseControl.addExpenses)
router.get('/',authenticate,expenseControl.getExpenses)
router.delete('/:id',authenticate,expenseControl.deleteExpenses)

module.exports = router