const Report = require('../models/Report');
const Employee = require('../models/Employee');
const Candidate = require('../models/Candidate');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate employee report
exports.generateEmployeeReport = async (req, res) => {
  try {
    const { employeeId, department, startDate, endDate, format } = req.body;
    const query = {};

    if (employeeId) {
      query._id = employeeId;
    }
    if (department) {
      query.department = department;
    }
    if (startDate && endDate) {
      query.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const employees = await Employee.find(query)
      .select('firstName lastName email phone position department startDate salary')
      .sort({ department: 1, lastName: 1 });

    const report = new Report({
      type: 'Employee',
      format,
      filters: { employeeId, department, startDate, endDate },
      generatedBy: req.user._id,
      status: 'Processing'
    });

    await report.save();

    if (format === 'excel') {
      await generateExcelReport(employees, report);
    } else if (format === 'pdf') {
      await generatePDFReport(employees, report);
    }

    report.status = 'Completed';
    await report.save();

    res.status(200).json({
      message: 'Report generated successfully',
      report
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
};

// Generate candidate report
exports.generateCandidateReport = async (req, res) => {
  try {
    const { status, department, startDate, endDate, format } = req.body;
    const query = {};

    if (status) {
      query.status = status;
    }
    if (department) {
      query.department = department;
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const candidates = await Candidate.find(query)
      .select('firstName lastName email phone position department status evaluation interviews')
      .populate('evaluation.evaluatedBy', 'name')
      .sort({ status: 1, createdAt: -1 });

    const report = new Report({
      type: 'Candidate',
      format,
      filters: { status, department, startDate, endDate },
      generatedBy: req.user._id,
      status: 'Processing'
    });

    await report.save();

    if (format === 'excel') {
      await generateExcelReport(candidates, report);
    } else if (format === 'pdf') {
      await generatePDFReport(candidates, report);
    }

    report.status = 'Completed';
    await report.save();

    res.status(200).json({
      message: 'Report generated successfully',
      report
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
  }
};

// Helper function to generate Excel report
async function generateExcelReport(data, report) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  // Add headers based on report type
  if (report.type === 'Employee') {
    worksheet.columns = [
      { header: 'First Name', key: 'firstName' },
      { header: 'Last Name', key: 'lastName' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'Position', key: 'position' },
      { header: 'Department', key: 'department' },
      { header: 'Start Date', key: 'startDate' },
      { header: 'Salary', key: 'salary' }
    ];
  } else {
    worksheet.columns = [
      { header: 'First Name', key: 'firstName' },
      { header: 'Last Name', key: 'lastName' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'Position', key: 'position' },
      { header: 'Department', key: 'department' },
      { header: 'Status', key: 'status' },
      { header: 'Evaluation Score', key: 'evaluationScore' }
    ];
  }

  // Add data rows
  data.forEach(item => {
    worksheet.addRow(item);
  });

  // Save the file
  const fileName = `${report.type}_Report_${Date.now()}.xlsx`;
  const filePath = path.join(__dirname, '../reports', fileName);
  await workbook.xlsx.writeFile(filePath);

  report.fileUrl = `/reports/${fileName}`;
  await report.save();
}

// Helper function to generate PDF report
async function generatePDFReport(data, report) {
  const fileName = `${report.type}_Report_${Date.now()}.pdf`;
  const filePath = path.join(__dirname, '../reports', fileName);
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  // Add title
  doc.fontSize(20).text(`${report.type} Report`, { align: 'center' });
  doc.moveDown();

  // Add filter information
  doc.fontSize(12).text('Filters:');
  Object.entries(report.filters).forEach(([key, value]) => {
    if (value) {
      doc.text(`${key}: ${value}`);
    }
  });
  doc.moveDown();

  // Add data
  if (report.type === 'Employee') {
    data.forEach(employee => {
      doc.fontSize(12).text(`${employee.firstName} ${employee.lastName}`);
      doc.fontSize(10).text(`Email: ${employee.email}`);
      doc.text(`Position: ${employee.position}`);
      doc.text(`Department: ${employee.department}`);
      doc.text(`Start Date: ${employee.startDate}`);
      doc.text(`Salary: ${employee.salary}`);
      doc.moveDown();
    });
  } else {
    data.forEach(candidate => {
      doc.fontSize(12).text(`${candidate.firstName} ${candidate.lastName}`);
      doc.fontSize(10).text(`Email: ${candidate.email}`);
      doc.text(`Position: ${candidate.position}`);
      doc.text(`Department: ${candidate.department}`);
      doc.text(`Status: ${candidate.status}`);
      if (candidate.evaluation) {
        doc.text(`Evaluation Score: ${candidate.evaluation.scores.total}`);
      }
      doc.moveDown();
    });
  }

  doc.end();

  report.fileUrl = `/reports/${fileName}`;
  await report.save();
}

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('generatedBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
};

// Get a single report
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'name email');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Error fetching report' });
  }
}; 