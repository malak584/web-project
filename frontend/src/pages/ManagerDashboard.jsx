import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faCalendarCheck, 
  faCheckCircle, 
  faTimesCircle,
  faBell,
  faAngleDown,
  faAngleUp,
  faSpinner,
  faCheckSquare,
  faTimesSquare,
  faComments
} from '@fortawesome/free-solid-svg-icons';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
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
      
      // Set mock manager ID for testing
      const managerId = localStorage.getItem('userId') || '507f1f77bcf86cd799439011';
      localStorage.setItem('userId', managerId);
      
      const response = await axios.get('http://localhost:5000/api/leave/pending/all');
      
      if (response.data) {
        console.log("Pending requests data:", response.data);
        setPendingRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
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
    // Reset comment text when collapsing
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

  if (loading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading leave requests...</p>
      </div>
    );
  }

  const leaveTypeLabels = {
    'annual': 'Annual Leave',
    'sick': 'Sick Leave',
    'personal': 'Personal Leave',
    'bereavement': 'Bereavement Leave',
    'unpaid': 'Unpaid Leave'
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="manager-dashboard">
      <header className="dashboard-header">
        <h1>
          <FontAwesomeIcon icon={faCalendarCheck} /> Leave Request Approvals
        </h1>
        <div className="user-info">
          <FontAwesomeIcon icon={faUserCircle} />
          <span>Manager</span>
        </div>
      </header>

      <main className="dashboard-content">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchPendingRequests}>Try Again</button>
          </div>
        )}

        <div className="requests-container">
          <h2>Pending Requests</h2>
          
          {pendingRequests.length === 0 ? (
            <div className="no-requests">
              <p>No pending leave requests to approve.</p>
            </div>
          ) : (
            <ul className="request-list">
              {pendingRequests.map(request => {
                const isExpanded = expandedId === request._id;
                const duration = calculateDuration(request.startDate, request.endDate);
                
                return (
                  <li 
                    key={request._id} 
                    className={`request-item ${isExpanded ? 'expanded' : ''}`}
                  >
                    <div 
                      className="request-header"
                      onClick={() => toggleExpand(request._id)}
                    >
                      <div className="request-employee">
                        <FontAwesomeIcon icon={faUserCircle} />
                        {request.employeeId ? (
                          <span>
                            {request.employeeId.firstName && request.employeeId.lastName ? 
                              `${request.employeeId.firstName} ${request.employeeId.lastName}` : 
                              (request.employeeId.email || `Employee ID: ${request.employeeId._id || request.employeeId}`)}
                          </span>
                        ) : request.employeeIdPlaceholder ? (
                          <span>
                            {`${request.employeeIdPlaceholder.firstName} ${request.employeeIdPlaceholder.lastName}`}
                            <small style={{ marginLeft: '5px', opacity: 0.7 }}>(Placeholder)</small>
                          </span>
                        ) : (
                          <span>Unknown Employee</span>
                        )}
                      </div>
                      <div className="request-type">
                        {leaveTypeLabels[request.leaveType] || request.leaveType}
                      </div>
                      <div className="request-dates">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                        <span className="request-duration">
                          ({duration} {duration === 1 ? 'day' : 'days'})
                        </span>
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
                        
                        <div className="comment-section">
                          <h4>
                            <FontAwesomeIcon icon={faComments} /> Your Comment (optional):
                          </h4>
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment about this decision..."
                            rows="3"
                          ></textarea>
                        </div>
                        
                        <div className="action-buttons">
                          <button 
                            className="approve-btn"
                            onClick={() => handleRequestAction(request._id, 'approved')}
                            disabled={processingId === request._id}
                          >
                            {processingId === request._id ? (
                              <FontAwesomeIcon icon={faSpinner} spin />
                            ) : (
                              <FontAwesomeIcon icon={faCheckCircle} />
                            )}
                            Approve
                          </button>
                          <button 
                            className="reject-btn"
                            onClick={() => handleRequestAction(request._id, 'rejected')}
                            disabled={processingId === request._id}
                          >
                            {processingId === request._id ? (
                              <FontAwesomeIcon icon={faSpinner} spin />
                            ) : (
                              <FontAwesomeIcon icon={faTimesCircle} />
                            )}
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;