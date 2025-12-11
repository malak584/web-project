const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// Submit a new leave request
exports.submitLeaveRequest = async (req, res) => {
  try {
    const { leaveType, reason, startDate, endDate } = req.body;
    const userId = req.user._id; // Taken from auth middleware

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }

    // Create request
    const newRequest = new LeaveRequest({
      employeeId: userId,
      leaveType,
      reason,
      startDate,
      endDate,
      status: 'pending'
    });

    await newRequest.save();
    res.status(201).json({ message: "Leave request submitted", data: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leave balance for the logged-in user
exports.getMyLeaveBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('leaveBalance');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.leaveBalance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get request history for the logged-in user
exports.getMyLeaveRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Manager Functions ---

// Get all pending requests (Manager only)
exports.getAllPendingRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ status: 'pending' })
      .populate('employeeId', 'firstName lastName email department position')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or Reject request
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, managerComment } = req.body; // status should be 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await LeaveRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Update Request
    request.status = status;
    request.managerComment = managerComment;
    request.approvedBy = req.user._id;
    request.approvedAt = Date.now();
    await request.save();

    // If approved, deduct from balance
    if (status === 'approved') {
      const days = Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24)) + 1;
      
      const user = await User.findById(request.employeeId);
      if (user && user.leaveBalance) {
        const type = request.leaveType; // e.g., 'annual', 'sick'
        if (user.leaveBalance[type] !== undefined) {
          // Prevent negative balance (optional choice)
          user.leaveBalance[type] = Math.max(0, user.leaveBalance[type] - days);
          await user.save();
        }
      }
    }

    res.json({ message: `Request ${status} successfully`, data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};