import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faInfoCircle, faSpinner, faPaperPlane, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './LeaveRequestForm.css';

const LeaveRequestForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    reason: '',
    leaveType: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validation, setValidation] = useState({
    reason: true,
    leaveType: true,
    startDate: true,
    endDate: true,
    balanceCheck: true
  });
  const [userData, setUserData] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState({
    annual: 15,
    sick: 10,
    personal: 5,
    bereavement: 3,
    unpaid: 0
  });
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [requestDuration, setRequestDuration] = useState(0);

  useEffect(() => {
    // Check if we have a user ID in local storage
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchUserData(userId);
      fetchLeaveBalance(userId);
    }
  }, []);

  // Calculate duration when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because inclusive of both days
      setRequestDuration(diffDays);
      
      // Validate against balance if leave type is selected
      if (formData.leaveType) {
        validateAgainstBalance(formData.leaveType, diffDays);
      }
    } else {
      setRequestDuration(0);
    }
  }, [formData.startDate, formData.endDate, formData.leaveType, leaveBalance]);

  const fetchUserData = async (userId) => {
    try {
      // This endpoint should return user profile data
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      if (response.data) {
        setUserData(response.data);
        console.log("User data loaded:", response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // We'll continue even if this fails
    }
  };

  const fetchLeaveBalance = async (userId) => {
    try {
      setLoadingBalance(true);
      const response = await axios.get(`http://localhost:5000/api/leave/balance/${userId}`);
      if (response.data) {
        setLeaveBalance(response.data);
        console.log("Leave balance loaded:", response.data);
        
        // Re-validate if necessary
        if (formData.leaveType && requestDuration > 0) {
          validateAgainstBalance(formData.leaveType, requestDuration);
        }
      }
    } catch (error) {
      console.error("Error fetching leave balance:", error);
      // Keep default values
    } finally {
      setLoadingBalance(false);
    }
  };

  const validateAgainstBalance = (leaveType, days) => {
    // Skip validation for unpaid leave
    if (leaveType === 'unpaid') {
      setValidation(prev => ({ ...prev, balanceCheck: true }));
      return true;
    }
    
    const available = leaveBalance[leaveType] || 0;
    const isValid = days <= available;
    
    setValidation(prev => ({ ...prev, balanceCheck: isValid }));
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error when user starts typing
    if (!validation[name]) {
      setValidation({
        ...validation,
        [name]: true
      });
    }

    // Clear any existing error messages
    if (errorMessage) {
      setErrorMessage('');
    }

    // Clear success message when form is changed
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newValidation = {
      reason: !!formData.reason.trim(),
      leaveType: !!formData.leaveType,
      startDate: !!formData.startDate,
      endDate: !!formData.endDate,
      balanceCheck: true // We'll update this if needed
    };
    
    // Check leave balance if type is selected and dates are valid
    if (newValidation.leaveType && newValidation.startDate && newValidation.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // Skip balance check for unpaid leave
      if (formData.leaveType !== 'unpaid') {
        const available = leaveBalance[formData.leaveType] || 0;
        newValidation.balanceCheck = diffDays <= available;
      }
    }
    
    setValidation(newValidation);
    return Object.values(newValidation).every(isValid => isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      
      // Use a valid MongoDB ObjectId format for testing/demo
      let employeeId = localStorage.getItem("userId");

      if (!employeeId || employeeId.length !== 24) {
        // Using a valid format MongoDB ObjectId for demo purposes
        employeeId = '507f1f77bcf86cd799439011';
        localStorage.setItem("userId", employeeId);
        console.warn("User ID not found or invalid, using mock ID for demo");
      }

      // Format dates properly for the API
      const formattedStartDate = new Date(formData.startDate).toISOString();
      const formattedEndDate = new Date(formData.endDate).toISOString();

      // Prepare request data
      const requestData = {
        employeeId,
        reason: formData.reason,
        leaveType: formData.leaveType,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status: "pending"
      };

      // If we have user data, include additional information
      if (userData) {
        console.log("Including user data in request");
        requestData.employeeData = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          position: userData.position,
          department: userData.department
        };
      }

      console.log("Submitting leave request:", requestData);
      const response = await axios.post('http://localhost:5000/api/leave/submit', requestData);

      setSuccessMessage("Leave request submitted successfully!");
      
      // Reset form
      setFormData({
        reason: '',
        leaveType: '',
        startDate: '',
        endDate: '',
      });
      
      // Call the callback to refresh parent data if provided
      if (onSubmitSuccess && typeof onSubmitSuccess === 'function') {
        onSubmitSuccess();
      }
      
    } catch (error) {
      console.error("Error submitting leave request:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setErrorMessage(`Server error: ${error.response.data.message || 'Failed to submit request'}`);
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMessage("No response from server. Please check your connection and try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrorMessage(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-request-card">
      <div className="card-header">
        <FontAwesomeIcon icon={faCalendarAlt} className="header-icon" />
        <h2 className="form-title">Leave Request Form</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="leave-form">
        {errorMessage && (
          <div className="error-alert">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="success-alert">
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>{successMessage}</span>
          </div>
        )}
        
        <div className="form-group">
          <label>Leave Type <span className="required">*</span></label>
          <select
            name="leaveType"
            className={`input ${!validation.leaveType ? 'input-error' : ''}`}
            value={formData.leaveType}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select Leave Type</option>
            <option value="annual">Annual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal Leave</option>
            <option value="bereavement">Bereavement Leave</option>
            <option value="unpaid">Unpaid Leave</option>
          </select>
          {!validation.leaveType && <small className="error-text">Please select a leave type</small>}
          
          {/* Show available balance for selected leave type */}
          {formData.leaveType && formData.leaveType !== 'unpaid' && (
            <div className="balance-info">
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>
                Available balance: {loadingBalance 
                  ? 'Loading...' 
                  : `${leaveBalance[formData.leaveType] || 0} days`}
              </span>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date <span className="required">*</span></label>
            <input
              type="date"
              name="startDate"
              className={`input ${!validation.startDate ? 'input-error' : ''}`}
              value={formData.startDate}
              onChange={handleChange}
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
            {!validation.startDate && <small className="error-text">Start date is required</small>}
          </div>

          <div className="form-group">
            <label>End Date <span className="required">*</span></label>
            <input
              type="date"
              name="endDate"
              className={`input ${!validation.endDate ? 'input-error' : ''}`}
              value={formData.endDate}
              onChange={handleChange}
              disabled={loading}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
            />
            {!validation.endDate && <small className="error-text">End date is required</small>}
          </div>
        </div>
        
        {/* Show request duration */}
        {requestDuration > 0 && (
          <div className="duration-info">
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>Duration: {requestDuration} {requestDuration === 1 ? 'day' : 'days'}</span>
          </div>
        )}
        
        {/* Show insufficient balance warning */}
        {!validation.balanceCheck && (
          <div className="balance-warning">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>
              Insufficient leave balance. You're requesting {requestDuration} days, 
              but only have {leaveBalance[formData.leaveType] || 0} days available.
            </span>
          </div>
        )}

        <div className="form-group">
          <label>Reason <span className="required">*</span></label>
          <textarea
            name="reason"
            placeholder="Please provide details for your leave request"
            className={`input textarea ${!validation.reason ? 'input-error' : ''}`}
            value={formData.reason}
            onChange={handleChange}
            disabled={loading}
            rows="3"
          />
          {!validation.reason && <small className="error-text">Please provide a reason for your leave</small>}
        </div>

        <div className="info-text">
          <FontAwesomeIcon icon={faInfoCircle} /> 
          <span>Your request will be sent to your manager for approval.</span>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin /> Processing...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPaperPlane} /> Submit Request
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
