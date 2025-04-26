const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Report type is required'],
    enum: ['Employee', 'Department', 'Interview', 'Candidate']
  },
  format: {
    type: String,
    required: [true, 'Report format is required'],
    enum: ['PDF', 'Excel']
  },
  filters: {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    department: String,
    startDate: Date,
    endDate: Date,
    status: String
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema); 