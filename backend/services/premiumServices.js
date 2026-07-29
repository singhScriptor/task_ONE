const { user, expense } = require('../models/index');
const { Sequelize } = require('sequelize');

const calculateLeaderboard = async () => {
  return await user.findAll({
    attributes: [
      'id',
      'name',
      [
        /* we use COALESCE to handle null values
           if SUM is null it will return 0
           used literal because raw SQL expression
           is cleaner and more optimized */
        Sequelize.literal('COALESCE(SUM(expenses.price), 0)'),
        'total_expenses'
      ]
    ],
    include: [{
      model: expense,
      as: 'expenses',
      attributes: []
    }],
    group: ['users.id'], // grouping by id
    /*sequelize.literal let you inject raw sql expression
    directly into query
    */
    order: [[Sequelize.literal('total_expenses'), 'DESC']],
    raw: true
  });
};

module.exports = { calculateLeaderboard };
