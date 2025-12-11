const Department = require('../models/Department');
const User = require('../models/User'); // <--- CRITICAL FIX

exports.getAllDepartments = async (req, res) => {
  try {
    const depts = await Department.find().populate('employees', 'firstName lastName email position');
    res.json(depts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const newDept = new Department(req.body);
    await newDept.save();
    res.status(201).json(newDept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addEmployeeToDepartment = async (req, res) => {
  try {
    const { departmentId, userId } = req.body; // Expect userId from frontend
    
    const department = await Department.findById(departmentId);
    const user = await User.findById(userId);

    if (!department || !user) return res.status(404).json({ message: "Department or User not found" });

    if (!department.employees.includes(userId)) {
      department.employees.push(userId);
      await department.save();
      
      // Update user profile
      user.department = department.name;
      await user.save();
    }

    res.json({ message: "Employee added to department" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};