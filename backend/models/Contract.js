const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({

  employeeEmail: {  // Adding the employee's email
    type: String,
    required: true
  },
  contractStartDate: { 
    type: Date, 
    required: true 
  },
  contractEndDate: { 
    type: Date, 
    required: true 
  },
  salary: { 
    type: Number, 
    required: true 
  },
  position: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    required: true 
  },
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
