const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/paginationController');

// to verify token
const authenticate = require('../middleware/authenticate');

router.get('/rows', authenticate, preferenceController.getRowsPerPage);
router.post('/rows', authenticate, preferenceController.updateRowsPerPage);

module.exports = router;