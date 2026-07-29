// premiumController.js
const { calculateLeaderboard } = require('../services/premiumServices');

// Leaderboard Controller
const getLeaderboard = async (req, res, next) => {
  try {
    // req.user is populated by authenticate middleware
    if (!req.user || !req.user.isPremium) {
      return res.status(403).json({ message: "Access denied. Premium access required." });
    }

    const leaderboard = await calculateLeaderboard();
    return res.status(200).json(leaderboard);
  } catch (err) {
    console.error('LEADERBOARD ERROR:', err.message);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

// Premium Status Controller
const getStatus = async (req, res, next) => {
  try {
    return res.status(200).json({ isPremiumUser: Boolean(req.user?.isPremium) });
  } catch (err) {
    console.error('STATUS ERROR:', err.message);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

module.exports = { getLeaderboard, getStatus };
