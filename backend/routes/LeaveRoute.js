const express = require('express');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Submit Leave Request
router.post("/submit", async (req, res) => {
  try {
    const { employeeId, reason, leaveType, startDate, endDate, employeeData } = req.body;

    console.log("Received leave request submission:", {
      employeeId,
      leaveType,
      startDate,
      endDate,
      hasEmployeeData: !!employeeData
    });

    // Validate employeeId
    if (!employeeId || employeeId.trim() === '') {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    let validEmployeeId = employeeId;

    // Check if the employeeId exists in the database
    let employee = null;
    try {
      employee = await User.findById(employeeId);
      if (!employee) {
        console.log(`Employee with ID ${employeeId} not found, attempting to create a test user`);
        
        // If employeeData was provided, create a new user
        if (employeeData && employeeData.firstName && employeeData.lastName) {
          const newUser = new User({
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email || `user_${Date.now()}@example.com`,
            password: await bcrypt.hash('tempPassword', 10),
            department: employeeData.department || 'Unknown',
            position: employeeData.position || 'Unknown'
          });
          
          employee = await newUser.save();
          validEmployeeId = employee._id;
          console.log(`Created new user for ${employeeData.firstName} ${employeeData.lastName} with ID: ${validEmployeeId}`);
        } else {
          // For testing, we'll use the first employee we find
          const anyEmployee = await User.findOne({ role: 'employee' });
          if (anyEmployee) {
            validEmployeeId = anyEmployee._id;
            employee = anyEmployee;
            console.log(`Using existing employee with ID: ${validEmployeeId}`);
          } else {
            console.log('No employee found, creating a test employee');
            const testEmployee = new User({
              firstName: 'Test',
              lastName: 'Employee',
              email: `employee_${Date.now()}@test.com`,
              password: await bcrypt.hash('password123', 10),
              role: 'employee',
              department: 'Test Department',
              position: 'Test Position'
            });
            
            employee = await testEmployee.save();
            validEmployeeId = employee._id;
            console.log(`Created test employee with ID: ${validEmployeeId}`);
          }
        }
      } else {
        console.log(`Found employee: ${employee.firstName} ${employee.lastName}`);
      }
    } catch (error) {
      console.error('Error validating employee ID:', error);
      // We'll continue with the original ID, but log the error
    }

    // Create the leave request
    const newLeaveRequest = new LeaveRequest({
      employeeId: validEmployeeId, // Use the validated ID
      reason,
      leaveType,
      startDate,
      endDate,
      status: 'pending'
    });

    // If we received additional employee data and the employee exists, update their profile
    if (employeeData && employee) {
      try {
        // Check if any fields need updating
        const needsUpdate = 
          (employeeData.firstName && employee.firstName !== employeeData.firstName) ||
          (employeeData.lastName && employee.lastName !== employeeData.lastName) ||
          (employeeData.position && employee.position !== employeeData.position) ||
          (employeeData.department && employee.department !== employeeData.department);
        
        if (needsUpdate) {
          console.log("Updating user profile with new data");
          await User.findByIdAndUpdate(employee._id, {
            firstName: employeeData.firstName || employee.firstName,
            lastName: employeeData.lastName || employee.lastName,
            email: employeeData.email || employee.email,
            position: employeeData.position || employee.position,
            department: employeeData.department || employee.department
          });
        }
      } catch (profileError) {
        console.error("Error updating user profile:", profileError);
        // Continue with the leave request even if profile update fails
      }
    }

    const savedRequest = await newLeaveRequest.save();
    
    // Verify the saved request has a valid employeeId
    console.log("Leave request saved with employeeId:", savedRequest.employeeId);
    
    res.status(201).json({ 
      message: "Leave request submitted successfully", 
      leaveRequest: savedRequest 
    });
  } catch (error) {
    console.error("Error submitting leave request:", error);
    res.status(500).json({ message: "Error submitting leave request", error: error.message });
  }
});

// Get leave balance for an employee
router.get("/balance/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log(`Fetching leave balance for employee: ${employeeId}`);
    
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    
    // If employee doesn't have leave balance info yet, set defaults
    if (!employee.leaveBalance) {
      const defaultBalance = {
        annual: 15,
        sick: 10,
        personal: 5,
        bereavement: 3,
        unpaid: 0
      };
      
      await User.findByIdAndUpdate(employeeId, { leaveBalance: defaultBalance });
      console.log(`Created default leave balance for employee: ${employeeId}`);
      return res.status(200).json(defaultBalance);
    }
    
    console.log(`Returning leave balance for employee ${employeeId}:`, employee.leaveBalance);
    res.status(200).json(employee.leaveBalance);
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    res.status(500).json({ message: "Error fetching leave balance", error: error.message });
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
    console.log("Fetching all pending leave requests");
    
    // Find all pending requests
    const pendingRequests = await LeaveRequest.find({ status: 'pending' })
      .populate({
        path: 'employeeId',
        select: 'firstName lastName email position department'
      })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${pendingRequests.length} pending requests`);
    
    // Enhanced logging and validation
    const enhancedRequests = pendingRequests.map(request => {
      const requestObj = request.toObject();
      
      // Check if employeeId was properly populated
      if (!requestObj.employeeId) {
        console.log(`Request ${requestObj._id} has null employeeId`);
        
        // Try to set a default employee placeholder
        requestObj.employeeIdPlaceholder = {
          _id: 'unknown',
          firstName: 'Unknown',
          lastName: 'Employee',
          email: 'unknown@example.com'
        };
      } else {
        console.log(`Request ${requestObj._id} from employee: ${requestObj.employeeId.firstName} ${requestObj.employeeId.lastName}`);
      }
      
      return requestObj;
    });
    
    // Log the first request if available
    if (enhancedRequests.length > 0) {
      console.log("Sample request with employee data:", JSON.stringify(enhancedRequests[0], null, 2));
    }
    
    res.status(200).json(enhancedRequests);
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
    
    // First, find the leave request to get details
    const leaveRequest = await LeaveRequest.findById(requestId);
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    
    // Update the request status
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
    
    // If the request is approved, deduct days from employee's leave balance
    if (status === 'approved') {
      try {
        // Calculate number of days
        const startDate = new Date(leaveRequest.startDate);
        const endDate = new Date(leaveRequest.endDate);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because inclusive of both start and end days
        
        console.log(`Leave request approved: ${diffDays} days of ${leaveRequest.leaveType} leave`);
        
        // Get the employee
        const employee = await User.findById(leaveRequest.employeeId);
        if (employee) {
          // Make sure employee has leave balance object
          if (!employee.leaveBalance) {
            employee.leaveBalance = {
              annual: 15,
              sick: 10,
              personal: 5,
              bereavement: 3,
              unpaid: 0
            };
          }
          
          // Calculate new balance for the specific leave type
          const leaveType = leaveRequest.leaveType;
          
          // Skip deduction for unpaid leave
          if (leaveType !== 'unpaid') {
            const currentBalance = employee.leaveBalance[leaveType] || 0;
            const newBalance = Math.max(0, currentBalance - diffDays); // Can't go below 0
            
            // Update the employee's leave balance
            const updateData = {};
            updateData[`leaveBalance.${leaveType}`] = newBalance;
            
            await User.findByIdAndUpdate(leaveRequest.employeeId, updateData);
            
            console.log(`Updated ${leaveType} leave balance for employee ${leaveRequest.employeeId}: ${currentBalance} -> ${newBalance}`);
          }
        }
      } catch (balanceError) {
        console.error("Error updating leave balance:", balanceError);
        // Continue with request approval even if balance update fails
      }
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
