const {sequelize} = require('../models')
const expenses = require('../models/expenses');
const { User } = require('../models/index');

// Create expense + increment total_expense
exports.createExpense = async (data, userId) => {
  const t= await sequelize.transaction()
  try {
    const result = await expenses.create({
      price: data.price,
      description: data.description,
      category: data.category,
      userId: userId
    },{transaction:t});

    await User.increment('total_expense',
      { by: data.price,
        where: { id: userId },
        transaction:t
      });

    await t.commit()
    return result.toJSON();
  } catch (err) {
    await t.rollback()
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
  const t = await sequelize.transaction()
  try {
    const result = await expenses.findOne({ where: { id, userId } });
    if (!result) {
      await t.rollback()
      return null;
    }

    await User.decrement('total_expense',
      {
        by: result.price,
        where: { id: userId },
        transaction:t
      }
    );
    await result.destroy({transaction:t})
    await t.commit()
    return true;
  } catch (err) {
    await t.rollback()
    err.statusCode = 500;
    throw err;
  }
};

// Update expense + adjust total_expense
exports.updateExpenseByIdAndUserId = async (id, userId, data) => {
  const t = await sequelize.transaction()
  try {
    const exp = await expenses.findOne({ where: { id, userId } });
    if (!exp){
      await t.rollback()
      return null;
    }

    const oldPrice = exp.price;
    const newPrice = data.price;

    exp.price = newPrice;
    exp.description = data.description;
    exp.category = data.category;
    await exp.save({transaction:t});

    const diff = newPrice - oldPrice;
    if (diff > 0) {
      await User.increment('total_expense', { by: diff, where: { id: userId },transaction:t });
    } else if (diff < 0) {
      await User.decrement('total_expense', { by: Math.abs(diff), where: { id: userId },transaction:t });
    }
    await t.commit()
    return exp.toJSON();
  } catch (err) {
    await t.rollback()
    err.statusCode = 500;
    throw err;
  }
};
