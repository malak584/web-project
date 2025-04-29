import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCalendarCheck, faAngleDown, faAngleUp, faSpinner } from '@fortawesome/free-solid-svg-icons';


import ContractManager from '../components/manager/ContractManager';
import DepartmentAssignment from '../components/manager/DepartmentAssignment';
import JobApplications from '../components/manager/JobApplications';
import LeaveApproval from '../components/manager/LeaveApproval';
import DepartmentManagement from '../components/manager/DepartmentManagement';
import './ManagerDashboard.css'

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
      const response = await axios.get('http://localhost:5000/api/leave/pending/all');
      if (response.data) {
        setPendingRequests(response.data);
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

  if (loading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading leave requests...</p>
      </div>
    );
  }

  return (
    <div className="manager-dashboard">
      <header className="dashboard-header">
        <h1>
          <FontAwesomeIcon icon={faCalendarCheck} /> Manager Dashboard
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
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleRequestAction(request._id, 'approved')} 
                            disabled={processingId === request._id}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRequestAction(request._id, 'rejected')} 
                            disabled={processingId === request._id}
                          >
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

        <ContractManager />
        <DepartmentAssignment />
        <JobApplications />
        <LeaveApproval />
        <DepartmentManagement />
      </main>
    </div>
  );
};

export default ManagerDashboard;
