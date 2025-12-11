const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // <--- FIX: Must reference 'User'
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  salary: { type: Number, required: true },
  position: { type: String, required: true },
  status: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);