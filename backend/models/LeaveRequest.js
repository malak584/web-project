const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'pending' }, // status can be 'pending', 'approved', 'rejected'
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
