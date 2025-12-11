const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Get monthly attendance report (no authentication or role-based restriction)
router.get('/report', attendanceController.getMonthlyAttendanceReport);

// Record attendance (no authentication or role-based restriction)
router.post('/', attendanceController.recordAttendance);

// Get attendance for a specific employee (still requires authentication)
router.get('/employee/:employeeId', attendanceController.getEmployeeAttendance);

module.exports = router;
