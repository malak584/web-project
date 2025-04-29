const Department = require('../models/Department');
const Employee = require('../models/Employee');

const addEmployeeToDepartment = async (req, res) => {
  try {
    const { departmentId, employeeId } = req.body;

    if (!departmentId || !employeeId) {
      return res.status(400).json({ message: "Department ID and Employee ID are required." });
    }

    const department = await Department.findById(departmentId);
    const employee = await Employee.findById(employeeId);

    if (!department || !employee) {
      return res.status(404).json({ message: "Department or Employee not found." });
    }

    // Check if already assigned
    if (department.employees.includes(employeeId)) {
      return res.status(400).json({ message: "Employee already assigned to this department." });
    }

    department.employees.push(employeeId);
    await department.save();

    res.status(200).json({ message: "Employee successfully added to department." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// VERY IMPORTANT: Export using the same function name
module.exports = { addEmployeeToDepartment };
