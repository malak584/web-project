const express = require('express');
const router = express.Router();
const { auth, isHR } = require('../middleware/auth');
const contractController = require('../controllers/contractController');

// READ: Get all contracts (HR only)
router.get('/', auth, isHR, contractController.getContracts);

// CREATE: Add a new contract (HR only)
router.post('/', auth, isHR, contractController.createContract);

module.exports = router; // <--- This MUST be 'router'