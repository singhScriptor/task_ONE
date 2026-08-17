const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/authenticate');

router.get('/reports/download', authenticate, reportController.downloadReport);
router.get('/reports/data', authenticate, reportController.getReportDataJson);

module.exports = router;