const jwt = require('jsonwebtoken');
const { user } = require('../models/index');

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch full user record including isPremium status
        const userData = await user.findByPk(decoded.id);

        if (!userData) {
            return res.status(401).json({ error: 'User no longer exists' });
        }

        req.user = userData;
        next();
    } catch (err) {
        err.statusCode = 401;
        err.message = 'Unauthorised';
        next(err);
    }
};

module.exports = authenticate;