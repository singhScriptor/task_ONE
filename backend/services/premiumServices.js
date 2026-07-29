const users = require("../models/users");

exports.calculateLeaderboard = async () => {
  return await users.findAll({
    attributes: ['id', 'name', 'total_expense'],
    order: [['total_expense', 'DESC']],
    raw: true
  });
};

