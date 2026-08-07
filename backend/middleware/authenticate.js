const jwt = require('jsonwebtoken');
const { user } = require('../models/index');

const authenticate = async (req, res, next) => {
    try {
        // Read authenticate token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        // Verifying JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database
        const userData = await user.findByPk(decoded.id);

        if (!userData) {
            return res.status(401).json({ error: 'User not found' });
        }

        // user object to request and proceed
        req.user = userData;
        next();
    } catch (err) {
        err.statusCode = 401;
        err.message = 'Unauthorised';
        next(err);
    }
};

module.exports = authenticate;