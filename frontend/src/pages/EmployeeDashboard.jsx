import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faBriefcase, 
  faCalendarAlt, 
  faUserEdit,
  faSignOutAlt,
  faTachometerAlt,
  faBell,
  faCheckCircle,
  faTimesCircle
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
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const notificationPopupRef = useRef(null);
  const [isNameUpdated, setIsNameUpdated] = useState(false);

  // Use callback to allow function to be reused
  const fetchLeaveBalance = useCallback(async (userId) => {
    try {
      setLoadingBalance(true);
      console.log(`Fetching leave balance for user: ${userId}`);
      const response = await axios.get(`http://localhost:5000/api/leave/balance/${userId}`);
      if (response.data) {
        setLeaveBalance(response.data);
        setLastUpdated(new Date());
        console.log('Leave balance loaded:', response.data);
      }
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      // Keep default values
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  // Update the useEffect for initial data loading to load notifications from localStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        // Get stored userName from localStorage first
        let storedUserName = localStorage.getItem('userName');
        
        // If userName exists in localStorage, use it
        if (storedUserName) {
          setUserName(storedUserName);
        } else {
          // Fallback to first and last name if available
          const firstName = localStorage.getItem('firstName');
          const lastName = localStorage.getItem('lastName');
          if (firstName && lastName) {
            const fullName = `${firstName} ${lastName}`;
            setUserName(fullName);
          } else {
            // Default name if no name is found
            setUserName('Employee');
          }
        }
        
        // Get user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.warn('User ID not found in localStorage');
          return;
        }
        
        // Fetch user data from API if needed for additional details
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        
        if (response.data) {
          setUserData(response.data);
          
          // Update name if not already set from localStorage
          if (!storedUserName) {
            const fullName = `${response.data.firstName} ${response.data.lastName}`;
            setUserName(fullName);
            localStorage.setItem('userName', fullName);
          }
        }
        
        // Fetch leave balance
        fetchLeaveBalance(userId);
        
        // Load notifications from localStorage
        const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        setNotifications(storedNotifications);
      } catch (error) {
        console.error('Error fetching user data:', error);
        
        // Fallback to localStorage data if API fails
        const firstName = localStorage.getItem('firstName') || '';
        const lastName = localStorage.getItem('lastName') || '';
        if (firstName || lastName) {
          setUserName(`${firstName} ${lastName}`.trim() || 'Employee');
        }
        
        // Still load notifications even if user data fails
        const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        setNotifications(storedNotifications);
      }
    };
    
    getUserData();
  }, [fetchLeaveBalance]);

  // Set up periodic polling to refresh leave balances
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    // Initial fetch
    fetchLeaveBalance(userId);
    
    // Set up polling interval (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchLeaveBalance(userId);
    }, 30000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchLeaveBalance]);

  // Additional effect to refresh leave balance when returning to the overview tab
  useEffect(() => {
    if (activeTab === 'overview') {
      const userId = localStorage.getItem('userId');
      if (userId) {
        fetchLeaveBalance(userId);
      }
    }
  }, [activeTab, fetchLeaveBalance]);

  // Update the function to store submission date information
  const checkForLeaveStatusChanges = useCallback(async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/leave/${userId}`);
      
      if (!response.data || !Array.isArray(response.data)) return;
      
      // Get stored notifications
      const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      
      // Get IDs of all notifications we've already sent
      const notifiedRequestIds = storedNotifications
        .filter(n => n.type === 'leave_status')
        .map(n => n.leaveRequestId);
      
      // Find recently approved/rejected requests that haven't been notified yet
      const newStatusChanges = response.data.filter(request => 
        (request.status === 'approved' || request.status === 'rejected') && 
        request.approvedAt && 
        !notifiedRequestIds.includes(request._id)
      );
      
      if (newStatusChanges.length > 0) {
        console.log('Found new status changes:', newStatusChanges.length);
        
        // Create new notifications
        const newNotifications = newStatusChanges.map(request => ({
          id: `leave_${request._id}_${Date.now()}`,
          type: 'leave_status',
          leaveRequestId: request._id,
          message: `Your ${request.leaveType} leave request has been ${request.status}${request.managerComment ? ' with comments' : ''}`,
          leaveType: request.leaveType,
          status: request.status,
          date: new Date(request.approvedAt),
          submittedDate: new Date(request.createdAt),
          startDate: new Date(request.startDate),
          endDate: new Date(request.endDate),
          isRead: false
        }));
        
        // Update notifications in state and localStorage
        const updatedNotifications = [...newNotifications, ...storedNotifications];
        setNotifications(updatedNotifications);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        
        // Refresh leave balance since a request was processed
        fetchLeaveBalance(userId);
      }
    } catch (error) {
      console.error("Error checking for leave status changes:", error);
    }
  }, [fetchLeaveBalance]);

  // Add effect for periodically checking notifications
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    // Check for notifications on initial load
    checkForLeaveStatusChanges(userId);
    
    // Set up polling interval (every 30 seconds)
    const intervalId = setInterval(() => {
      checkForLeaveStatusChanges(userId);
    }, 30000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [checkForLeaveStatusChanges]);

  // Update refreshUserData to also check for notifications
  const refreshUserData = useCallback(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchLeaveBalance(userId);
      checkForLeaveStatusChanges(userId);
    }
  }, [fetchLeaveBalance, checkForLeaveStatusChanges]);

  // Add a function to mark notifications as read
  const markNotificationRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Add a function to mark all notifications as read
  const markAllNotificationsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification, 
      isRead: true
    }));
    
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // If switching to overview, refresh the data
    if (tab === 'overview') {
      refreshUserData();
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    // Navigate to login page
    window.location.href = '/login';
  };

  // Use callback to close popup when clicking outside
  const handleClickOutside = useCallback((event) => {
    if (notificationPopupRef.current && !notificationPopupRef.current.contains(event.target)) {
      setShowNotificationPopup(false);
    }
  }, []);

  // Add event listener for clicking outside notification popup
  useEffect(() => {
    if (showNotificationPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationPopup, handleClickOutside]);

  // Modified notification bell handler to toggle popup
  const handleNotificationBellClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowNotificationPopup(!showNotificationPopup);
    
    // If popup is being opened and there are unread notifications, mark them as read
    if (!showNotificationPopup && notifications.some(n => !n.isRead)) {
      markAllNotificationsRead();
    }
  };

  // Get formatted date for display
  const formatNotificationDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Add a handler for notification clicks from the popup
  const handleNotificationPopupClick = (notification) => {
    // Mark the notification as read
    markNotificationRead(notification.id);
    
    // Close the popup
    setShowNotificationPopup(false);
    
    // If it's a leave request notification, navigate to the leave requests tab
    if (notification.type === 'leave_status') {
      handleTabChange('my-leaves');
    }
  };

  // Update the name change handler to include visual feedback
  const handleNameChange = useCallback((event) => {
    if (event.detail && event.detail.fullName) {
      setUserName(event.detail.fullName);
      console.log('User name updated to:', event.detail.fullName);
      
      // Set flag to show animation
      setIsNameUpdated(true);
      
      // Reset flag after animation completes
      setTimeout(() => {
        setIsNameUpdated(false);
      }, 3000);
    }
  }, []);

  // Add an event listener to update the user name when it changes
  useEffect(() => {
    // Add event listener for user name changes
    window.addEventListener('userNameChanged', handleNameChange);
    
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('userNameChanged', handleNameChange);
    };
  }, [handleNameChange]);

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
                <h2 className={isNameUpdated ? 'name-updated' : ''}>Welcome back, {userName}!</h2>
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
              <h3>
                Leave Balances
                {lastUpdated && (
                  <span className="last-updated">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </h3>
              
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
                  onClick={() => handleTabChange('leave-request')}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Request Leave</span>
                </button>
                <button 
                  className="action-btn"
                  onClick={() => handleTabChange('personal-info')}
                >
                  <FontAwesomeIcon icon={faUserEdit} />
                  <span>Update Profile</span>
                </button>
                <button 
                  className="action-btn"
                  onClick={() => handleTabChange('my-leaves')}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>View Leave Requests</span>
                </button>
              </div>
            </div>
            
            {notifications.length > 0 && (
              <div className="notifications-section">
                <h3>
                  Recent Notifications
                  {notifications.some(n => !n.isRead) && (
                    <button 
                      className="mark-all-read-btn"
                      onClick={markAllNotificationsRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </h3>
                <ul className="notification-list">
                  {notifications.map(notification => (
                    <li 
                      key={notification.id}
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                      onClick={() => handleNotificationPopupClick(notification)}
                    >
                      <div className="notification-icon">
                        <FontAwesomeIcon 
                          icon={
                            notification.type === 'leave_status' 
                              ? notification.status === 'approved' 
                                ? faCheckCircle 
                                : faTimesCircle
                              : faBell
                          } 
                          className={notification.status === 'approved' ? 'approved' : notification.status === 'rejected' ? 'rejected' : ''}
                        />
                      </div>
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <span className="notification-time">
                          {new Date(notification.date).toLocaleString()}
                        </span>
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
          <h2 className={isNameUpdated ? 'name-updated' : ''}>{userName}</h2>
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
                className={activeTab === 'leave-request' ? 'active' : ''}
                onClick={() => handleTabChange('leave-request')}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Request Leave</span>
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'my-leaves' ? 'active' : ''}
                onClick={() => handleTabChange('my-leaves')}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>My Leave Requests</span>
              </button>
            </li>
            <li>
              <button 
                className={activeTab === 'personal-info' ? 'active' : ''}
                onClick={() => handleTabChange('personal-info')}
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
          
          <div className="notifications-container">
            <div 
              className={`notifications-indicator ${notifications.filter(n => !n.isRead).length > 0 ? 'has-unread' : ''}`} 
              onClick={handleNotificationBellClick}
            >
              <FontAwesomeIcon icon={faBell} />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </div>
            
            {showNotificationPopup && (
              <div className="notification-popup" ref={notificationPopupRef}>
                <div className="notification-popup-header">
                  <h3>Notifications</h3>
                  {notifications.length > 0 && (
                    <button className="clear-all-btn" onClick={() => {
                      localStorage.setItem('notifications', '[]');
                      setNotifications([]);
                      setShowNotificationPopup(false);
                    }}>
                      Clear All
                    </button>
                  )}
                </div>
                
                <div className="notification-popup-content">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">
                      <FontAwesomeIcon icon={faBell} className="no-notifications-icon" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <ul className="notification-popup-list">
                      {notifications.map(notification => {
                        // Find additional info based on notification type
                        let additionalInfo = null;
                        
                        if (notification.type === 'leave_status') {
                          // Format dates for display
                          const submittedDate = notification.submittedDate ? formatNotificationDate(notification.submittedDate) : 'Unknown';
                          const startDate = notification.startDate ? formatNotificationDate(notification.startDate).split(',')[0] : 'Unknown';
                          const endDate = notification.endDate ? formatNotificationDate(notification.endDate).split(',')[0] : 'Unknown';
                          
                          additionalInfo = (
                            <div className="notification-details">
                              <div className="notification-detail-item">
                                <span className="detail-label">Type:</span>
                                <span className="detail-value">{notification.leaveType.charAt(0).toUpperCase() + notification.leaveType.slice(1)} Leave</span>
                              </div>
                              <div className="notification-detail-item">
                                <span className="detail-label">Status:</span>
                                <span className={`detail-value status-${notification.status}`}>{notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}</span>
                              </div>
                              <div className="notification-detail-item">
                                <span className="detail-label">Period:</span>
                                <span className="detail-value">{startDate} to {endDate}</span>
                              </div>
                              <div className="notification-detail-item">
                                <span className="detail-label">Submitted:</span>
                                <span className="detail-value">{submittedDate}</span>
                              </div>
                              <div className="notification-detail-item">
                                <span className="detail-label">Updated:</span>
                                <span className="detail-value">{formatNotificationDate(notification.date)}</span>
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <li 
                            key={notification.id}
                            className={`notification-popup-item ${!notification.isRead ? 'unread' : ''}`}
                            onClick={() => handleNotificationPopupClick(notification)}
                          >
                            <div className="notification-popup-icon">
                              <FontAwesomeIcon 
                                icon={
                                  notification.type === 'leave_status' 
                                    ? notification.status === 'approved' 
                                      ? faCheckCircle 
                                      : faTimesCircle
                                    : faBell
                                } 
                                className={notification.status === 'approved' ? 'approved' : notification.status === 'rejected' ? 'rejected' : ''}
                              />
                            </div>
                            <div className="notification-popup-content">
                              <p className="notification-popup-message">{notification.message}</p>
                              {additionalInfo}
                              <span className="notification-popup-time">
                                {formatNotificationDate(notification.date)}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
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
