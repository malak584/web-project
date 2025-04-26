const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Get attendance report for a specific month
exports.getMonthlyAttendanceReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('employeeId', 'name department');

    // Calculate attendance statistics
    const totalDays = endDate.getDate();
    const attendanceStats = {};

    attendanceRecords.forEach(record => {
      const employeeId = record.employeeId._id.toString();
      if (!attendanceStats[employeeId]) {
        attendanceStats[employeeId] = {
          name: record.employeeId.name,
          department: record.employeeId.department,
          present: 0,
          absent: 0,
          late: 0,
          halfDay: 0
        };
      }

      attendanceStats[employeeId][record.status]++;
    });

    // Calculate attendance percentage for each employee
    const report = Object.values(attendanceStats).map(stat => ({
      ...stat,
      attendancePercentage: ((stat.present + stat.halfDay * 0.5) / totalDays) * 100
    }));

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance report',
      error: error.message
    });
  }
};

// Record attendance for an employee
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

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording attendance',
      error: error.message
    });
  }
};

// Get attendance for a specific employee
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { employeeId };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 });

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employee attendance',
      error: error.message
    });
  }
}; 