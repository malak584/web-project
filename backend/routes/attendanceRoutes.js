const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { auth, isHR } = require('../middleware/auth');

// Get monthly attendance report
router.get('/report', auth, isHR, attendanceController.getMonthlyAttendanceReport);

// Record attendance
router.post('/', auth, isHR, attendanceController.recordAttendance);

// Get attendance for a specific employee
router.get('/employee/:employeeId', auth, attendanceController.getEmployeeAttendance);

module.exports = router; 