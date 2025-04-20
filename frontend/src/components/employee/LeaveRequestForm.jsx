import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faInfoCircle, faSpinner, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './LeaveRequestForm.css';

const LeaveRequestForm = () => {
  const [formData, setFormData] = useState({
    reason: '',
    date: '',
    leaveType: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    reason: true,
    leaveType: true,
    startDate: true,
    endDate: true
  });

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
  };

  const validateForm = () => {
    const newValidation = {
      reason: !!formData.reason.trim(),
      leaveType: !!formData.leaveType,
      startDate: !!formData.startDate,
      endDate: !!formData.endDate
    };
    
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
      const employeeId = localStorage.getItem("userId");

      if (!employeeId) {
        alert("You must be logged in to submit a leave request");
        return;
      }

      const response = await axios.post('http://localhost:5000/api/leave/submit', {
        employeeId,
        reason: formData.reason,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: "pending"
      });

      alert("Leave request submitted successfully!");
      setFormData({
        reason: '',
        date: '',
        leaveType: '',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request. Please try again.");
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
