import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faCheckCircle, 
  faTimesCircle, 
  faClockRotateLeft, 
  faCalendarCheck,
  faComment
} from '@fortawesome/free-solid-svg-icons';
import './LeaveApproval.css';

const LeaveApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/leave/pending');
      setRequests(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching pending leave requests:", error);
      setError("Failed to load pending requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      setProcessingId(requestId);
      
      const managerId = localStorage.getItem('userId');
      
      await axios.put(`http://localhost:5000/api/leave/${requestId}/status`, {
        status: status,
        managerId: managerId,
        managerComment: commentText
      });
      
      // Refresh the list of pending requests
      fetchPendingRequests();
      
      // Reset comment text and expanded request
      setCommentText('');
      setExpandedId(null);
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      setError(`Failed to ${status} request. Please try again.`);
    } finally {
      setProcessingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    if (expandedId === id) {
      setCommentText('');
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

  if (loading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Loading pending leave requests...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const LeaveTypeLabels = {
    annual: "Annual Leave",
    sick: "Sick Leave",
    personal: "Personal Leave",
    bereavement: "Bereavement Leave",
    unpaid: "Unpaid Leave"
  };

  return (
    <div className="leave-approval-container">
      <div className="card-header">
        <FontAwesomeIcon icon={faCalendarCheck} className="header-icon" />
        <h2>Pending Leave Requests</h2>
      </div>
      
      <div className="card-content">
        {requests.length === 0 ? (
          <div className="empty-state">
            <p>No pending leave requests to review.</p>
          </div>
        ) : (
          <ul className="requests-list">
            {requests.map((request) => {
              const duration = calculateDuration(request.startDate, request.endDate);
              const isExpanded = expandedId === request._id;
              const isProcessing = processingId === request._id;
              
              return (
                <li 
                  key={request._id} 
                  className={`request-item ${isExpanded ? 'expanded' : ''}`}
                >
                  <div className="request-header" onClick={() => toggleExpand(request._id)}>
                    <div className="request-status">
                      <FontAwesomeIcon icon={faClockRotateLeft} className="status-icon pending" />
                      <span className="status-badge pending">Pending</span>
                    </div>
                    <div className="request-type">
                      {LeaveTypeLabels[request.leaveType] || request.leaveType}
                    </div>
                  </div>
                  
                  <div className="request-info" onClick={() => toggleExpand(request._id)}>
                    <div className="request-employee">
                      <strong>Employee:</strong> {request.employeeData?.firstName} {request.employeeData?.lastName}
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
                  </div>
                  
                  {isExpanded && (
                    <div className="request-details">
                      <div className="request-reason">
                        <h4>Reason:</h4>
                        <p>{request.reason}</p>
                      </div>
                      
                      <div className="manager-comment-input">
                        <h4>
                          <FontAwesomeIcon icon={faComment} /> Your Comment:
                        </h4>
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment (optional)"
                          rows="2"
                          className="comment-textarea"
                        />
                      </div>
                      
                      <div className="request-actions">
                        <button
                          onClick={() => handleRequestAction(request._id, "approved")}
                          className="approve-button"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faCheckCircle} /> Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleRequestAction(request._id, "rejected")}
                          className="reject-button"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faTimesCircle} /> Reject
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="request-meta">
                        <p>Submitted on {formatDate(request.createdAt)}</p>
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

export default LeaveApproval;
