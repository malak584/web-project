// routes/contracts.js
const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');  // Assuming you have a Contract model

// Fetch all contracts
router.get('/', async (req, res) => {
  try {
    const contracts = await Contract.find().populate('employeeId');  // Fetch contracts and populate employeeId
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contracts', error });
  }
});

// Update a contract
router.put('/:id', async (req, res) => {
  try {
    const updatedContract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedContract);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contract', error });
  }
});

// Export the router
module.exports = router;
