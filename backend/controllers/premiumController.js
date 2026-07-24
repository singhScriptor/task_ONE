const { calculateLeaderboard } = require('../services/leaderboardService');
const { user } = require('../models/index');

// Leaderboard
const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await calculateLeaderboard();
    return res.status(200).json(leaderboard);
  } catch (err) {
    console.error('LEADERBOARD ERROR', err.message);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

// Premium status
const getStatus = async (req, res, next) => {
  try {
    const userData = await user.findByPk(req.user.id);
    return res.json({ isPremiumUser: userData.isPremium === true });
  } catch (err) {
    console.error('STATUS ERROR', err.message);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

module.exports = { getLeaderboard, getStatus };
