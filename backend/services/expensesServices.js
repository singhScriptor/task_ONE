const expenses = require('../models/expenses');
const { user } = require('../models/index');

// Create expense + increment total_expense
exports.createExpense = async (data, userId) => {
  try {
    const result = await expenses.create({
      price: data.price,
      description: data.description,
      category: data.category,
      userId: userId
    });

    await user.increment('total_expense', { by: data.price, where: { id: userId } });

    return result.toJSON();
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
};
 
// Get all expenses for a user
exports.getAllExpenseById = async (userId) => {
  try {
    const result = await expenses.findAll({ where: { userId } });
    return result.map(e => e.toJSON());
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
};

// Get single expense by id + userId
exports.getAllExpenseByIdAndUserId = async (id, userId) => {
  try {
    return await expenses.findOne({ where: { id, userId } });
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
};

// Delete expense + decrement total_expense
exports.deleteExpenseByIdAndUserId = async (id, userId) => {
  try {
    const result = await expenses.findOne({ where: { id, userId } });
    if (!result) return null;

    await user.decrement('total_expense',
      { by: result.price, where: { id: userId } }
    );
    await result.destroy();

    return true;
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
};

// Update expense + adjust total_expense
exports.updateExpenseByIdAndUserId = async (id, userId, data) => {
  try {
    const exp = await expenses.findOne({ where: { id, userId } });
    if (!exp) return null;

    const oldPrice = exp.price;
    const newPrice = data.price;

    exp.price = newPrice;
    exp.description = data.description;
    exp.category = data.category;
    await exp.save();

    const diff = newPrice - oldPrice;
    if (diff > 0) {
      await user.increment('total_expense', { by: diff, where: { id: userId } });
    } else if (diff < 0) {
      await user.decrement('total_expense', { by: Math.abs(diff), where: { id: userId } });
    }

    return exp.toJSON();
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
};
