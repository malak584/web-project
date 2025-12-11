const Attendance = require('../models/Attendance');
const User = require('../models/User'); // <--- CHANGED from 'Employee' to 'User'

// Record attendance
exports.recordAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, checkIn, checkOut, notes } = req.body;

    const attendance = new Attendance({
      employeeId,
      date,
      status,
      checkIn,
      checkOut,
      notes
    });

    await attendance.save();
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get monthly report
exports.getMonthlyAttendanceReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('employeeId', 'firstName lastName department');

    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get specific employee attendance
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const records = await Attendance.find({ employeeId }).sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};