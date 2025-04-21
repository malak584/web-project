import React, { useState, useEffect, useCallback } from 'react';
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
  const [leaveBalance, setLeaveBalance] = useState({
    annual: 15,
    sick: 10,
    personal: 5,
    bereavement: 3,
    unpaid: 0
  });
  const [loadingBalance, setLoadingBalance] = useState(true);

  // Use callback to allow function to be reused
  const fetchLeaveBalance = useCallback(async (userId) => {
    try {
      setLoadingBalance(true);
      console.log(`Fetching leave balance for user: ${userId}`);
      const response = await axios.get(`http://localhost:5000/api/leave/balance/${userId}`);
      if (response.data) {
        setLeaveBalance(response.data);
        console.log('Leave balance loaded:', response.data);
      }
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      // Keep default values
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  // Add a function to refresh user data and leave balance
  const refreshUserData = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        console.log('Refreshing user data and leave balance...');
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        if (response.data) {
          setUserData(response.data);
          
          // Update localStorage with real user data if available
          localStorage.setItem('userFirstName', response.data.firstName || 'Employee');
          localStorage.setItem('userLastName', response.data.lastName || '');
          setUserName(`${response.data.firstName || 'Employee'} ${response.data.lastName || ''}`);
        }
        
        // Always fetch the latest balance
        await fetchLeaveBalance(userId);
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  }, [fetchLeaveBalance]);

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

    // Load initial data
    refreshUserData();
    
    // Set up a periodic refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      refreshUserData();
    }, 30000);
    
    // Clean up on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [refreshUserData]);

  // Listen for tab changes to refresh data when returning to overview
  useEffect(() => {
    if (activeTab === 'overview') {
      refreshUserData();
    }
  }, [activeTab, refreshUserData]);

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
        return <LeaveRequestForm onSubmitSuccess={refreshUserData} />;
      case 'my-leaves':
        return <MyLeaveRequests onStatusChange={refreshUserData} />;
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
                  <h3>Annual Leave</h3>
                  <p className="stat-value">{loadingBalance ? 'Loading...' : leaveBalance.annual} days</p>
                  <p className="stat-label">Available Balance</p>
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
            
            <div className="leave-balance-section">
              <h3>Leave Balances</h3>
              
              <div className="balance-cards">
                <div className="balance-card annual">
                  <h4>Annual Leave</h4>
                  <p className="balance-days">{loadingBalance ? '...' : leaveBalance.annual}</p>
                  <p className="balance-label">days available</p>
                </div>
                
                <div className="balance-card sick">
                  <h4>Sick Leave</h4>
                  <p className="balance-days">{loadingBalance ? '...' : leaveBalance.sick}</p>
                  <p className="balance-label">days available</p>
                </div>
                
                <div className="balance-card personal">
                  <h4>Personal Leave</h4>
                  <p className="balance-days">{loadingBalance ? '...' : leaveBalance.personal}</p>
                  <p className="balance-label">days available</p>
                </div>
                
                <div className="balance-card bereavement">
                  <h4>Bereavement</h4>
                  <p className="balance-days">{loadingBalance ? '...' : leaveBalance.bereavement}</p>
                  <p className="balance-label">days available</p>
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
