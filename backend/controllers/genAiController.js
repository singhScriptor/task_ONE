const genaiService = require('../services/genaiServices');
const Expenses = require('../models/expenses');

exports.addExpense = async (req, res, next) => {
    try {
        const { description, price } = req.body;
        const userId = req.user.id;

        const category = await genaiService.categorizeExpenses(description);

        const expense = await Expenses.create({
            description,
            price,
            category,
            userId
        });

        res.status(201).json({ success: true, data: expense });
    } catch (err) {
        next(err);
    }
};

exports.getMonthlySummary = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const expenses = await Expenses.findAll({
            where: { userId },
            raw: true
        });

        const summary = await genaiService.summarizeExpenses(expenses);
        res.json({ success: true, summary });
    } catch (err) {
        next(err);
    }
};