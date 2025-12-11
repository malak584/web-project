const express = require('express');
const router = express.Router();
const { auth, isManager } = require('../middleware/auth');
const leaveController = require('../controllers/leaveController');

// User Routes
router.post('/submit', auth, leaveController.submitLeaveRequest);
router.get('/balance', auth, leaveController.getMyLeaveBalance);
router.get('/history', auth, leaveController.getMyLeaveRequests);

// Manager Routes
router.get('/pending', auth, isManager, leaveController.getAllPendingRequests);
router.put('/:requestId/status', auth, isManager, leaveController.updateLeaveStatus);

module.exports = router; // <--- This was likely missing!