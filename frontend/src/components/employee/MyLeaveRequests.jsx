import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faCheckCircle, 
  faTimesCircle, 
  faClockRotateLeft, 
  faCalendarCheck,
  faComment
} from '@fortawesome/free-solid-svg-icons';
import './MyLeaveRequests.css';

const LeaveTypeLabels = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  personal: "Personal Leave",
  bereavement: "Bereavement Leave",
  unpaid: "Unpaid Leave"
};

const StatusIcon = ({ status }) => {
  switch(status) {
    case 'approved':
      return <FontAwesomeIcon icon={faCheckCircle} className="status-icon approved" />;
    case 'rejected':
      return <FontAwesomeIcon icon={faTimesCircle} className="status-icon rejected" />;
    default:
      return <FontAwesomeIcon icon={faClockRotateLeft} className="status-icon pending" />;
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

const MyLeaveRequests = ({ onStatusChange }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      let employeeId = localStorage.getItem("userId");
      
      if (!employeeId || employeeId.length !== 24) {
        // Using a valid format MongoDB ObjectId for demo purposes
        employeeId = '507f1f77bcf86cd799439011';
        localStorage.setItem("userId", employeeId);
        console.warn("User ID not found or invalid, using mock ID for demo");
      }
      
      const response = await axios.get(`http://localhost:5000/api/leave/${employeeId}`);
      
      if (response.data) {
        setLeaveRequests(response.data);
        setError(null);
        
        // If the status of any request has changed, trigger the callback
        if (onStatusChange && typeof onStatusChange === 'function') {
          const hasApprovedOrRejected = response.data.some(request => 
            request.status === 'approved' || request.status === 'rejected'
          );
          
          if (hasApprovedOrRejected) {
            console.log("Leave requests status changed, refreshing balances");
            onStatusChange();
          }
        }
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${error.response.data.message || 'Failed to load leave requests'}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection and try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [onStatusChange]);

  useEffect(() => {
    fetchRequests();
    
    // Set up periodic refresh every 15 seconds to check for status changes
    const refreshInterval = setInterval(() => {
      fetchRequests();
    }, 15000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [fetchRequests]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Loading your leave requests...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="leave-requests-container">
      <div className="card-header">
        <FontAwesomeIcon icon={faCalendarCheck} className="header-icon" />
        <h2>My Leave Requests</h2>
      </div>
      
      <div className="card-content">
        {leaveRequests.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any leave requests yet.</p>
            <p className="empty-suggestion">Use the Leave Request Form to submit a new request.</p>
          </div>
        ) : (
          <ul className="requests-list">
            {leaveRequests.map((request) => {
              const duration = calculateDuration(request.startDate, request.endDate);
              const isExpanded = expandedId === request._id;
              
              return (
                <li 
                  key={request._id} 
                  className={`request-item ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(request._id)}
                >
                  <div className="request-header">
                    <div className="request-status">
                      <StatusIcon status={request.status} />
                      <span className={`status-badge ${request.status}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <div className="request-type">
                      {LeaveTypeLabels[request.leaveType] || request.leaveType}
                    </div>
                  </div>
                  
                  <div className="request-dates">
                    <div>
                      <span className="date-label">From:</span> {formatDate(request.startDate)}
                    </div>
                    <div>
                      <span className="date-label">To:</span> {formatDate(request.endDate)}
                    </div>
                    <div className="duration">
                      {duration} {duration === 1 ? 'day' : 'days'}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="request-details">
                      <div className="request-reason">
                        <h4>Reason:</h4>
                        <p>{request.reason}</p>
                      </div>
                      
                      {request.managerComment && (
                        <div className="manager-comment">
                          <h4>
                            <FontAwesomeIcon icon={faComment} /> Manager Comments:
                          </h4>
                          <p>{request.managerComment}</p>
                        </div>
                      )}
                      
                      <div className="request-meta">
                        <p>Submitted on {formatDate(request.createdAt)}</p>
                        {request.approvedAt && (
                          <p>
                            {request.status === 'approved' ? 'Approved' : 'Rejected'} on {formatDate(request.approvedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyLeaveRequests;
