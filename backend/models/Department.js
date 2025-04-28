// models/departmentModel.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager', // This refers to the Manager model
    required: true,
  },
});

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
