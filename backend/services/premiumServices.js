const { user, expense } = require('../models/index');
const { Sequelize } = require('sequelize');

const calculateLeaderboard = async () => {
  return await user.findAll({
    attributes: [
      'id',
      'name',
      [
        Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('expenses.price')), 0),
        'total_expenses'
      ]
    ],
    include: [{
      model: expense,
      as: 'expenses',
      attributes: []
    }],
    group: ['users.id', 'users.name'],
    order: [[Sequelize.literal('total_expenses'), 'DESC']],
    raw: true
  });
};

module.exports = { calculateLeaderboard };