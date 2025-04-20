const express = require('express');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const router = express.Router();

// Submit Leave Request
router.post("/submit", async (req, res) => {
  try {
    const { employeeId, reason, leaveType, startDate, endDate } = req.body;

    const newLeaveRequest = new LeaveRequest({
      employeeId,
      reason,
      leaveType,
      startDate,
      endDate,
      status: 'pending'
    });

    await newLeaveRequest.save();
    res.status(201).json({ message: "Leave request submitted successfully", leaveRequest: newLeaveRequest });
  } catch (error) {
    console.error("Error submitting leave request:", error);
    res.status(500).json({ message: "Error submitting leave request", error: error.message });
  }
});

// Get leave requests by employee ID
router.get("/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const leaveRequests = await LeaveRequest.find({ employeeId }).sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ message: "Error fetching leave requests", error: error.message });
  }
});

// Get all pending leave requests (for managers)
router.get("/pending/all", async (req, res) => {
  try {
    const pendingRequests = await LeaveRequest.find({ status: 'pending' })
      .populate('employeeId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Error fetching pending requests", error: error.message });
  }
});

// Approve or reject leave request
router.put("/:requestId/status", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, managerId, managerComment } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      requestId,
      { 
        status,
        managerComment,
        approvedBy: managerId,
        approvedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    
    res.status(200).json({ 
      message: `Leave request ${status}`,
      leaveRequest: updatedRequest
    });
    
  } catch (error) {
    console.error("Error updating leave request status:", error);
    res.status(500).json({ message: "Error updating leave request status", error: error.message });
  }
});

module.exports = router;
