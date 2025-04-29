// routes/contracts.js
const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');  // Ensure the path is correct
const Employee = require('../models/Employee');  // Make sure you import the Employee model as well
router.post('/', async (req, res) => {
  try {
    const { employeeId, contractStartDate, contractEndDate, salary, position, status } = req.body;

    // Log the request body to verify data
    console.log('Received contract data:', req.body);

    const newContract = new Contract({
      employeeId,
      contractStartDate,
      contractEndDate,
      salary,
      position,
      status
    });

    await newContract.save();
    res.status(201).json(newContract);
  } catch (error) {
    console.error('Error creating contract:', error.message);  // Log the specific error
    res.status(500).json({ message: 'Error creating contract', error: error.message });
  }
});

// Fetch all contracts and populate the employee details
router.get('/', async (req, res) => {
  try {
    const contracts = await Contract.find().populate('employeeId');  // Make sure employeeId references Employee
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contracts', error: error.message });
  }
});

// Update a contract
router.put('/:id', async (req, res) => {
  try {
    const updatedContract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedContract);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contract', error: error.message });
  }
});
const {
  createContract,
  getContracts,
  updateContract
} = require('../controllers/contractController');

// Fetch all contracts
router.get('/', getContracts);

// Create a new contract
router.post('/', createContract);

// Update a contract
router.put('/:id', updateContract);

module.exports = router;
