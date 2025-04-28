// controllers/departmentController.js
const mongoose = require('mongoose');
const Department = require('../models/departmentModel');
const Manager = require('../models/managerModel');

// Assign a manager to a department
const assignManagerToDepartment = async (req, res) => {
  const { departmentId, managerId } = req.body;

  try {
    // Find department and manager by their IDs
    const department = await Department.findById(departmentId);
    const manager = await Manager.findById(managerId);

    if (!department || !manager) {
      return res.status(404).send('Department or Manager not found');
    }

    // Assign the manager to the department
    department.manager = manager._id;
    await department.save();  // Save the department with the assigned manager

    res.status(200).send('Manager assigned successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

module.exports = { assignManagerToDepartment };
