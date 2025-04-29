const Contract = require('../models/Contract');
const Employee = require('../models/Employee');  // Import the Employee model

// Create a new contract
const createContract = async (req, res) => {
  try {
    const { employeeEmail, contractStartDate, contractEndDate, salary, position, status } = req.body;

    // Check if the employee exists by email
    const employee = await Employee.findOne({ email: employeeEmail });  // Find by email
    if (!employee) {
      return res.status(400).json({ message: 'Employee not found' });
    }

    // Create the new contract if employee exists
    const newContract = new Contract({
      employeeId: employee._id,  // Store the employee's ObjectId
      employeeEmail,  // You can also store the employee's email if you want to include it in the contract
      contractStartDate,
      contractEndDate,
      salary,
      position,
      status
    });

    await newContract.save();
    res.status(201).json(newContract);
  } catch (error) {
    console.error('Error creating contract:', error.message);
    res.status(500).json({ message: 'Error creating contract', error: error.message });
  }
};

// Fetch all contracts
const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().populate('employeeId'); // Populating employeeId with employee details
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contracts', error: error.message });
  }
};

// Update a contract
const updateContract = async (req, res) => {
  try {
    const updatedContract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedContract);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contract', error: error.message });
  }
};

module.exports = {
  createContract,
  getContracts,
  updateContract
};
