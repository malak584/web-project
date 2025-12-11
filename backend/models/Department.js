const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // <--- FIX: Must reference 'User'
    required: true,
  }],
});

module.exports = mongoose.model('Department', departmentSchema);