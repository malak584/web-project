import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faCalendarCheck, 
  faAngleDown, 
  faAngleUp, 
  faSpinner,
  faSignOutAlt,
  faTachometerAlt,
  faUsers,
  faFileContract,
  faBuilding,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';

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
  const [activeTab, setActiveTab] = useState('overview');

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'contracts':
        return <ContractManager />;
      case 'departments':
        return <DepartmentManagement />;
      case 'assignments':
        return <DepartmentAssignment />;
      case 'applications':
        return <JobApplications />;
      case 'leaves':
        return <LeaveApproval />;
      case 'overview':
      default:
        return (
          <div className="overview-container">
            <div className="dashboard-header">
              <h2>Dashboard Overview</h2>
              <div className="date-display">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">
                  <FontAwesomeIcon icon={faCalendarCheck} />
                </div>
                <div className="metric-info">
                  <h3>Pending Leave Requests</h3>
                  <p className="metric-value">{pendingRequests.length}</p>
                  <p className="metric-label">Requires your attention</p>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <FontAwesomeIcon icon={faFileContract} />
                </div>
                <div className="metric-info">
                  <h3>Active Contracts</h3>
                  <p className="metric-value">24</p>
                  <p className="metric-label">Current employees</p>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="metric-info">
                  <h3>Department Size</h3>
                  <p className="metric-value">15</p>
                  <p className="metric-label">Team members</p>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <FontAwesomeIcon icon={faClipboardList} />
                </div>
                <div className="metric-info">
                  <h3>Open Positions</h3>
                  <p className="metric-value">3</p>
                  <p className="metric-label">Job openings</p>
                </div>
              </div>
            </div>

            <div className="dashboard-sections">
              <div className="section-card">
                <h3>Recent Leave Requests</h3>
                <div className="requests-list">
                  {pendingRequests.slice(0, 5).map(request => (
                    <div key={request._id} className="request-item">
                      <div className="request-info">
                        <span className="employee-name">{request.employeeName}</span>
                        <span className="request-type">{request.leaveType}</span>
                      </div>
                      <div className="request-dates">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </div>
                      <button 
                        className="action-btn"
                        onClick={() => handleTabChange('leaves')}
                      >
                        Review
                      </button>
                    </div>
                  ))}
                </div>
                {pendingRequests.length > 5 && (
                  <button 
                    className="view-all-btn"
                    onClick={() => handleTabChange('leaves')}
                  >
                    View All Requests
                  </button>
                )}
              </div>

              <div className="section-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => handleTabChange('contracts')}
                  >
                    <FontAwesomeIcon icon={faFileContract} />
                    Manage Contracts
                  </button>
                  <button 
                    className="action-btn primary"
                    onClick={() => handleTabChange('departments')}
                  >
                    <FontAwesomeIcon icon={faBuilding} />
                    Manage Departments
                  </button>
                  <button 
                    className="action-btn primary"
                    onClick={() => handleTabChange('assignments')}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    Assign Employees
                  </button>
                  <button 
                    className="action-btn primary"
                    onClick={() => handleTabChange('applications')}
                  >
                    <FontAwesomeIcon icon={faClipboardList} />
                    Review Applications
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="manager-dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <FontAwesomeIcon icon={faUserCircle} size="2x" />
          <h2>Manager</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button 
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={() => handleTabChange('overview')}
              >
                <FontAwesomeIcon icon={faTachometerAlt} />
                <span>Overview</span>
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'leaves' ? 'active' : ''}
                onClick={() => handleTabChange('leaves')}
              >
                <FontAwesomeIcon icon={faCalendarCheck} />
                <span>Leave Approvals</span>
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'contracts' ? 'active' : ''}
                onClick={() => handleTabChange('contracts')}
              >
                <FontAwesomeIcon icon={faFileContract} />
                <span>Contract Management</span>
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'departments' ? 'active' : ''}
                onClick={() => handleTabChange('departments')}
              >
                <FontAwesomeIcon icon={faBuilding} />
                <span>Department Management</span>
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'assignments' ? 'active' : ''}
                onClick={() => handleTabChange('assignments')}
              >
                <FontAwesomeIcon icon={faUsers} />
                <span>Department Assignment</span>
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'applications' ? 'active' : ''}
                onClick={() => handleTabChange('applications')}
              >
                <FontAwesomeIcon icon={faClipboardList} />
                <span>Job Applications</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ManagerDashboard;
