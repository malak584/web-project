const mongoose = require('mongoose');

// Assuming you have an Employee model
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // This now refers to the Employee model
    required: true,
  }],
});

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
