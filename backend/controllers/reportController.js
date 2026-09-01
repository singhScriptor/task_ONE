const reportService = require('../services/reportServices');

exports.getReportDataJson = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reportType = req.query.reportType || 'daily';
        const selectedDate = req.query.date; // Grab the date from query string

        // Pass selectedDate to the service
        const reportSummaryData = await reportService.getFilteredExpenses(userId, reportType, selectedDate);
        res.status(200).json(reportSummaryData);
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
};

exports.downloadReport = async (req, res, next) => {
    try {

        //for debugging
        // console.log("DEBUG req.user inside downloadReport:", req.user);

        //check user is premium or not
        if (!req.user || !req.user.isPremium) {
            return res.status(401).json({ message: 'Unauthorized - Premium membership required' });
        }

        const userId = req.user.id;
        const reportType = req.query.reportType || 'daily';
        const selectedDate = req.query.date; // Grab the date from query string

        const reportSummaryData = await reportService.getFilteredExpenses(userId, reportType, selectedDate);

        let csvContent = 'Period,Income,Expense,Savings\n';
        reportSummaryData.rows.forEach(row => {
            csvContent += `${row.period},${row.income},${row.expense},${row.saving}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=expense_report_${reportType}.csv`);
        res.status(200).send(csvContent);
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }
};