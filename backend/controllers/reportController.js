const reportService = require('../services/reportServices');

exports.downloadReport = async (req, res, next) => {
    try {
        // req.user.id comes directly from your authentication middleware
        const userId = req.user.id;

        const expenses = await reportService.getUserExpenses(userId);

        let csv = 'ID,Price,Description,Category\n';
        expenses.forEach(exp => {
            csv += `${exp.id},${exp.price},"${exp.description}",${exp.category}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=my-expenses-report.csv');
        res.status(200).send(csv);
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
};