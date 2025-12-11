const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['Employee', 'Department', 'Interview', 'Candidate'] },
  format: { type: String, required: true, enum: ['PDF', 'Excel'] },
  filters: {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // <--- FIX: Must reference 'User'
    department: String,
    startDate: Date,
    endDate: Date,
    status: String
  },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);