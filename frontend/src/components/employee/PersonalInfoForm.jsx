import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faHome,
  faIdCard,
  faSave,
  faSpinner,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import './PersonalInfoForm.css';

const PersonalInfoForm = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        let userId = localStorage.getItem('userId');
        
        if (!userId || userId.length !== 24) {
          // Using a valid format MongoDB ObjectId for demo purposes
          userId = '507f1f77bcf86cd799439011';
          localStorage.setItem('userId', userId);
          console.warn("User ID not found or invalid, using mock ID for demo");
        }
        
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        
        if (response.data) {
          setUserData(response.data || {});
        } else {
          // If no data is returned, set some default values
          setUserData({
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@example.com',
            phone: '',
            address: '',
            emergencyContact: '',
            emergencyPhone: ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Set default user data as fallback
        setUserData({
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com',
          phone: '',
          address: '',
          emergencyContact: '',
          emergencyPhone: ''
        });
        
        setErrors({ general: 'Failed to load user data. Using demo data instead.' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const formatPhoneNumber = (phone) => {
    // Remove any non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Take only the first 8 digits
    const truncated = digitsOnly.slice(0, 8);
    
    return truncated;
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow digits
    const formattedValue = formatPhoneNumber(value);
    
    setUserData({
      ...userData,
      [name]: formattedValue
    });
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!userData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!userData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (userData.phone) {
      if (userData.phone.length !== 8 || !/^\d{8}$/.test(userData.phone)) {
        newErrors.phone = 'Phone number must be exactly 8 digits';
      }
    }
    
    if (userData.emergencyPhone) {
      if (userData.emergencyPhone.length !== 8 || !/^\d{8}$/.test(userData.emergencyPhone)) {
        newErrors.emergencyPhone = 'Emergency phone number must be exactly 8 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      let userId = localStorage.getItem('userId');
      
      if (!userId || userId.length !== 24) {
        // Using a valid format MongoDB ObjectId for demo purposes
        userId = '507f1f77bcf86cd799439011';
        localStorage.setItem('userId', userId);
        console.warn("User ID not found or invalid, using mock ID for demo");
      }
      
      // Create a copy of userData for submission
      const dataToSubmit = { ...userData };
      
      // Format phone numbers for submission (with +216 prefix)
      if (dataToSubmit.phone && dataToSubmit.phone.length === 8) {
        // Store the raw 8 digits for the API, the prefix is handled on display
        // The API might want to know the full international format
        dataToSubmit.phoneFormatted = `+216${dataToSubmit.phone}`;
      }
      
      if (dataToSubmit.emergencyPhone && dataToSubmit.emergencyPhone.length === 8) {
        dataToSubmit.emergencyPhoneFormatted = `+216${dataToSubmit.emergencyPhone}`;
      }
      
      const response = await axios.put(`http://localhost:5000/api/users/${userId}`, dataToSubmit);
      
      if (response.data) {
        setSuccessMessage('Personal information updated successfully!');
        
        // Update localStorage with new user data for dashboard synchronization
        if (userData.firstName) {
          localStorage.setItem('firstName', userData.firstName); 
        }
        if (userData.lastName) {
          localStorage.setItem('lastName', userData.lastName);
        }
        
        // Update the full name in localStorage for the dashboard to use
        if (userData.firstName && userData.lastName) {
          const fullName = `${userData.firstName} ${userData.lastName}`;
          localStorage.setItem('userName', fullName);
          
          // Trigger an event to notify the dashboard of the name change
          const nameChangeEvent = new CustomEvent('userNameChanged', { 
            detail: { 
              fullName,
              firstName: userData.firstName,
              lastName: userData.lastName
            } 
          });
          window.dispatchEvent(nameChangeEvent);
        }
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setErrors({ general: `Server error: ${error.response.data.message || 'Failed to update information'}` });
      } else if (error.request) {
        // The request was made but no response was received
        setErrors({ general: "No response from server. Please check your connection and try again." });
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrors({ general: `Error: ${error.message}` });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="personal-info-card">
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Loading your personal information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="personal-info-card">
      <div className="card-header">
        <FontAwesomeIcon icon={faIdCard} className="header-icon" />
        <h2>Personal Information</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="personal-info-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              <FontAwesomeIcon icon={faUser} /> First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className={`input ${errors.firstName ? 'input-error' : ''}`}
              value={userData.firstName || ''}
              onChange={handleChange}
              disabled={saving}
            />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">
              <FontAwesomeIcon icon={faUser} /> Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className={`input ${errors.lastName ? 'input-error' : ''}`}
              value={userData.lastName || ''}
              onChange={handleChange}
              disabled={saving}
            />
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">
            <FontAwesomeIcon icon={faEnvelope} /> Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`input ${errors.email ? 'input-error' : ''}`}
            value={userData.email || ''}
            onChange={handleChange}
            disabled={saving}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">
            <FontAwesomeIcon icon={faPhone} /> Phone Number
          </label>
          <div className="phone-input-container">
            <span className="phone-prefix">+216</span>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`input phone-input ${errors.phone ? 'input-error' : ''}`}
              value={userData.phone || ''}
              onChange={handlePhoneChange}
              disabled={saving}
              placeholder="Enter 8 digits"
              maxLength={8}
              pattern="[0-9]{8}"
            />
          </div>
          {errors.phone && <span className="error-text">{errors.phone}</span>}
          {!errors.phone && userData.phone && userData.phone.length < 8 && 
            <span className="info-text">Phone number must be exactly 8 digits ({8 - userData.phone.length} more needed)</span>
          }
        </div>
        
        <div className="form-group">
          <label htmlFor="address">
            <FontAwesomeIcon icon={faHome} /> Address
          </label>
          <textarea
            id="address"
            name="address"
            className="input textarea"
            value={userData.address || ''}
            onChange={handleChange}
            disabled={saving}
            rows="2"
          />
        </div>
        
        <h3 className="section-title">Emergency Contact Information</h3>
        
        <div className="form-group">
          <label htmlFor="emergencyContact">
            <FontAwesomeIcon icon={faUser} /> Emergency Contact Name
          </label>
          <input
            type="text"
            id="emergencyContact"
            name="emergencyContact"
            className="input"
            value={userData.emergencyContact || ''}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="emergencyPhone">
            <FontAwesomeIcon icon={faPhone} /> Emergency Contact Phone
          </label>
          <div className="phone-input-container">
            <span className="phone-prefix">+216</span>
            <input
              type="tel"
              id="emergencyPhone"
              name="emergencyPhone"
              className={`input phone-input ${errors.emergencyPhone ? 'input-error' : ''}`}
              value={userData.emergencyPhone || ''}
              onChange={handlePhoneChange}
              disabled={saving}
              placeholder="Enter 8 digits"
              maxLength={8}
              pattern="[0-9]{8}"
            />
          </div>
          {errors.emergencyPhone && <span className="error-text">{errors.emergencyPhone}</span>}
          {!errors.emergencyPhone && userData.emergencyPhone && userData.emergencyPhone.length < 8 && 
            <span className="info-text">Phone number must be exactly 8 digits ({8 - userData.emergencyPhone.length} more needed)</span>
          }
        </div>
        
        {errors.general && <div className="error-message">{errors.general}</div>}
        {successMessage && <div className="success-message"><FontAwesomeIcon icon={faInfoCircle} /> {successMessage}</div>}
        
        <button type="submit" className="save-button" disabled={saving}>
          {saving ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin /> Saving...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PersonalInfoForm;
  