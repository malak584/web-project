import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faBriefcase, 
  faCalendarAlt, 
  faUserEdit,
  faSignOutAlt,
  faTachometerAlt,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import LeaveRequestForm from '../components/employee/LeaveRequestForm';
import PersonalInfoForm from '../components/employee/PersonalInfoForm';
import MyLeaveRequests from '../components/employee/MyLeaveRequests';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userName, setUserName] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Set mock user ID in localStorage if it doesn't exist
    if (!localStorage.getItem('userId')) {
      // Using a hard-coded ID as a fallback for demo purposes
      const mockUserId = '64f71c1a9358d5c15a535312'; // Example ID
      localStorage.setItem('userId', mockUserId);
      
      // Also set mock user data for display
      localStorage.setItem('userFirstName', 'John');
      localStorage.setItem('userLastName', 'Doe');
    }

    // Get user name from localStorage or API
    const firstName = localStorage.getItem('userFirstName') || 'Employee';
    const lastName = localStorage.getItem('userLastName') || '';
    setUserName(`${firstName} ${lastName}`);

    // Mock notifications
    setNotifications([
      { id: 1, type: 'leave', message: 'Your leave request has been approved', isRead: false },
      { id: 2, type: 'system', message: 'Welcome to the Employee Dashboard', isRead: true }
    ]);

    // Attempt to fetch real user data if we have a userId
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
          if (response.data) {
            setUserData(response.data);
            
            // Update localStorage with real user data if available
            localStorage.setItem('userFirstName', response.data.firstName || 'Employee');
            localStorage.setItem('userLastName', response.data.lastName || '');
            setUserName(`${response.data.firstName || 'Employee'} ${response.data.lastName || ''}`);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If API call fails, we already have fallback data set
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('role');
    
    // Redirect to login page - replace with your actual login path
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'leave-request':
        return <LeaveRequestForm />;
      case 'my-leaves':
        return <MyLeaveRequests />;
      case 'personal-info':
        return <PersonalInfoForm />;
      case 'overview':
      default:
        return (
          <div className="dashboard-overview">
            <div className="welcome-card">
              <div className="welcome-icon">
                <FontAwesomeIcon icon={faUserCircle} size="3x" />
              </div>
              <div className="welcome-text">
                <h2>Welcome back, {userName}!</h2>
                <p>Here's what's happening with your account today.</p>
              </div>
            </div>
            
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <div className="stat-info">
                  <h3>Leave Balance</h3>
                  <p className="stat-value">15 days</p>
                  <p className="stat-label">Annual Leave</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faBriefcase} />
                </div>
                <div className="stat-info">
                  <h3>Position</h3>
                  <p className="stat-value">{userData?.position || 'Software Engineer'}</p>
                  <p className="stat-label">{userData?.department || 'Engineering Department'}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faBell} />
                </div>
                <div className="stat-info">
                  <h3>Notifications</h3>
                  <p className="stat-value">{notifications.filter(n => !n.isRead).length} new</p>
                  <p className="stat-label">{notifications.length} total</p>
                </div>
              </div>
            </div>
            
            <div className="quick-access">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button 
                  className="action-btn"
                  onClick={() => setActiveTab('leave-request')}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Request Leave</span>
                </button>
                <button 
                  className="action-btn"
                  onClick={() => setActiveTab('personal-info')}
                >
                  <FontAwesomeIcon icon={faUserEdit} />
                  <span>Update Profile</span>
                </button>
                <button 
                  className="action-btn"
                  onClick={() => setActiveTab('my-leaves')}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>View Leave Requests</span>
                </button>
              </div>
            </div>
            
            {notifications.length > 0 && (
              <div className="notifications-section">
                <h3>Recent Notifications</h3>
                <ul className="notification-list">
                  {notifications.map(notification => (
                    <li 
                      key={notification.id}
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                    >
                      <div className="notification-icon">
                        <FontAwesomeIcon 
                          icon={notification.type === 'leave' ? faCalendarAlt : faBell} 
                        />
                      </div>
                      <div className="notification-content">
                        <p>{notification.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="employee-dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <FontAwesomeIcon icon={faUserCircle} size="2x" />
          <h2>{userName}</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button 
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={() => setActiveTab('overview')}
              >
                <FontAwesomeIcon icon={faTachometerAlt} />
                <span>Overview</span>
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'leave-request' ? 'active' : ''}
                onClick={() => setActiveTab('leave-request')}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Request Leave</span>
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'my-leaves' ? 'active' : ''}
                onClick={() => setActiveTab('my-leaves')}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>My Leave Requests</span>
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'personal-info' ? 'active' : ''}
                onClick={() => setActiveTab('personal-info')}
              >
                <FontAwesomeIcon icon={faUserEdit} />
                <span>Personal Information</span>
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
        <div className="dashboard-header">
          <h1>
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'leave-request' && 'Request Leave'}
            {activeTab === 'my-leaves' && 'My Leave Requests'}
            {activeTab === 'personal-info' && 'Personal Information'}
          </h1>
          
          <div className="notifications-indicator">
            <FontAwesomeIcon icon={faBell} />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="notification-badge">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </div>
        </div>
        
        <div className="dashboard-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
