const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'pending' }, // status can be 'pending', 'approved', 'rejected'
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
const express = require('express');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const router = express.Router();

// Submit Leave Request
router.post("/submit", async (req, res) => {
  try {
    const { employeeId, reason, date } = req.body;

    const newLeaveRequest = new LeaveRequest({
      employeeId,
      reason,
      date,
    });

    await newLeaveRequest.save();
    res.status(201).json({ message: "Leave request submitted successfully", leaveRequest: newLeaveRequest });
  } catch (error) {
    res.status(500).json({ message: "Error submitting leave request", error });
  }
});

module.exports = router;
