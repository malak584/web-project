const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth, isManager } = require('../middleware/auth');

// Get all reports (manager only)
router.get('/', auth, isManager, reportController.getAllReports);

// Get a single report by ID
router.get('/:id', auth, isManager, reportController.getReportById);

// Generate a new employee report (if needed)
router.post('/employee', auth, isManager, reportController.generateEmployeeReport);

// Generate a new candidate report (if needed)
router.post('/candidate', auth, isManager, reportController.generateCandidateReport);

module.exports = router;