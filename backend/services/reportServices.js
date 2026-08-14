// services/reportService.js
const Expense = require('../models/expenses');

exports.getAllExpenses = async (userId) => {
    return await Expense.findAll({
        where: { userId: userId },
        order: [['createdAt', 'DESC']]
    });
};