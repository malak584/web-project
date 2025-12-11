const Report = require('../models/Report');
const User = require('../models/User'); // <--- CRITICAL FIX
const Candidate = require('../models/Candidate');

// Generate employee report
exports.generateEmployeeReport = async (req, res) => {
  try {
    const { employeeId, department, startDate, endDate, format } = req.body;
    const query = { role: 'Employee' }; // Only get users who are employees

    if (employeeId) query._id = employeeId;
    if (department) query.department = department;
    
    const employees = await User.find(query).select('-password');

    const report = new Report({
      type: 'Employee',
      format,
      filters: { employeeId, department, startDate, endDate },
      generatedBy: req.user._id,
      status: 'Completed',
      fileUrl: 'placeholder_url'
    });

    await report.save();
    res.status(200).json({ message: 'Report generated', data: employees });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report' });
  }
};

// Generate candidate report
exports.generateCandidateReport = async (req, res) => {
  try {
    const { status, department, startDate, endDate, format } = req.body;
    const query = {};
    if (status) query.status = status;
    
    const candidates = await Candidate.find(query);

    const report = new Report({
      type: 'Candidate',
      format,
      filters: { status, department, startDate, endDate },
      generatedBy: req.user._id,
      status: 'Completed',
      fileUrl: 'placeholder_url'
    });

    await report.save();
    res.status(200).json({ message: 'Report generated', data: candidates });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report' });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('generatedBy', 'firstName email');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};