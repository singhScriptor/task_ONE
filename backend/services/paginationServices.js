const { user: User } = require('../models/index');

exports.updateRowsPerPage = async (userId, rowsPerPage) => {
    try {
        await User.update(
            { rowsPerPage: parseInt(rowsPerPage) },
            { where: { id: userId } }
        );
        return true;
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
};

exports.getRowsPerPage = async (userId) => {
    try {
        const foundUser = await User.findByPk(userId, {
            attributes: ['rowsPerPage']
        });
        return foundUser ? foundUser.rowsPerPage : 10;
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
};