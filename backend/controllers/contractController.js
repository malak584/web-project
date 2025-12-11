const Contract = require('../models/Contract');
const User = require('../models/User'); // <--- CHANGED from 'Employee' to 'User'

exports.createContract = async (req, res) => {
  try {
    const { employeeEmail, startDate, endDate, salary, position, status } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: employeeEmail });
    if (!user) return res.status(404).json({ message: "Employee not found with that email" });

    const newContract = new Contract({
      employeeId: user._id,
      startDate,
      endDate,
      salary,
      position,
      status
    });

    await newContract.save();
    
    // Update user's profile with new salary/position
    user.salary = salary;
    user.position = position;
    await user.save();

    res.status(201).json(newContract);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().populate('employeeId', 'firstName lastName email');
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};