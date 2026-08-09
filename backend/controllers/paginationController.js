const paginationService = require('../services/paginationServices');

exports.getRowsPerPage = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const rowsPerPage = await paginationService.getRowsPerPage(userId);

        res.status(200).json({ rowsPerPage });
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
};

exports.updateRowsPerPage = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { rowsPerPage } = req.body;

        if (!rowsPerPage) {
            return res.status(400).json({
                message: "rowsPerPage is required"
            });
        }

        await paginationService.updateRowsPerPage(userId, rowsPerPage);

        res.status(200).json({
            message: "Rows per page successfully updated"
        });
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
};