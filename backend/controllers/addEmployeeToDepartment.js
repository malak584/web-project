const Department = require('../models/Department'); // Make sure model path is correct
const Employee = require('../models/EmployeeM'); // Make sure model path is correct

// Controller to add an employee to a department
const addEmployeeToDepartment = async (req, res) => {
  const { departmentId, employeeId } = req.body;

  try {
    // Find the department and employee
    const department = await Department.findById(departmentId);
    const employee = await Employee.findById(employeeId);

    // Check if both exist
    if (!department || !employee) {
      return res.status(404).json({ message: 'Department or Employee not found' });
    }

    // Add employee to the department if not already added
    if (!department.employees.includes(employee._id)) {
      department.employees.push(employee._id);
      await department.save();
    }

    res.status(200).json({ message: 'Employee added to department successfully' });
  } catch (error) {
    console.error('Error in addEmployeeToDepartment:', error);
    res.status(500).json({ message: 'Server error while assigning employee to department' });
  }
};

module.exports = { addEmployeeToDepartment };
