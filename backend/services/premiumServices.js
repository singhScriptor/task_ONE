
const { user, expense } = require('../models/index');
const { Sequelize } = require('sequelize');

const calculateLeaderboard = async () => {
  return await user.findAll({
    attributes: [
      'name',
      [Sequelize.literal('COALESCE(SUM(expenses.price), 0)'), 'total_expenses']
    ],
    include: [{
      model: expense,
      as: 'expenses',   // must match association alias
      attributes: []
    }],
    group: ['user.id'],
    order: [[Sequelize.literal('total_expenses'), 'DESC']],
    raw: true
  });
};

module.exports = { calculateLeaderboard };
