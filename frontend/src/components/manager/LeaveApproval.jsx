import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faCheckCircle, 
  faTimesCircle, 
  faClockRotateLeft, 
  faCalendarCheck,
  faComment,
  faUserCircle,
  faAngleUp,
  faAngleDown
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
      setError(null);
      const response = await axios.get('http://localhost:5000/api/leave/pending/all');
      if (response.data) {
        setRequests(response.data);
      }
    } catch (error) {
      setError('Failed to load pending leave requests. Please try again later.');
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
      fetchPendingRequests();
      setCommentText('');
      setExpandedId(null);
    } catch (error) {
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
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end - start);
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return dayDiff;
  };

  const LeaveTypeLabels = {
    annual: "Annual Leave",
    sick: "Sick Leave",
    personal: "Personal Leave",
    bereavement: "Bereavement Leave",
    unpaid: "Unpaid Leave"
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading leave requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchPendingRequests}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="requests-container">
      <h2>Pending Leave Requests</h2>
      {requests.length === 0 ? (
        <div className="no-requests">
          <p>No pending leave requests to approve.</p>
        </div>
      ) : (
        <ul className="request-list">
          {requests.map(request => {
            const isExpanded = expandedId === request._id;
            const duration = calculateDuration(request.startDate, request.endDate);

            return (
              <li key={request._id} className={`request-item ${isExpanded ? 'expanded' : ''}`}>
                <div className="request-header" onClick={() => toggleExpand(request._id)}>
                  <div className="request-employee">
                    <FontAwesomeIcon icon={faUserCircle} />
                    {request.employeeId ? (
                      <span>{request.employeeId.firstName} {request.employeeId.lastName}</span>
                    ) : (
                      <span>Unknown Employee</span>
                    )}
                  </div>
                  <div className="request-type">
                    {request.leaveType}
                  </div>
                  <div className="request-dates">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                    <span className="request-duration">({duration} {duration === 1 ? 'day' : 'days'})</span>
                  </div>
                  <button className="expand-btn">
                    <FontAwesomeIcon icon={isExpanded ? faAngleUp : faAngleDown} />
                  </button>
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
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleRequestAction(request._id, 'approved')} 
                        disabled={processingId === request._id}
                      >
                        {processingId === request._id ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCheckCircle} /> Approve
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => handleRequestAction(request._id, 'rejected')} 
                        disabled={processingId === request._id}
                      >
                        {processingId === request._id ? (
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
  );
};

export default LeaveApproval;
