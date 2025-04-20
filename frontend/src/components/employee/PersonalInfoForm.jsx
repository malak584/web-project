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
        
        if (!userId) {
          // Set mock user ID as fallback for demo
          userId = '64f71c1a9358d5c15a535312'; // Example MongoDB id
          localStorage.setItem('userId', userId);
          console.warn("User ID not found, using mock ID for demo");
        }
        
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUserData(response.data || {});
      } catch (error) {
        console.error('Error fetching user data:', error);
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
    
    if (userData.phone && !/^\d{10}$/.test(userData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Enter a valid phone number';
    }
    
    if (userData.emergencyPhone && !/^\d{10}$/.test(userData.emergencyPhone.replace(/[^0-9]/g, ''))) {
      newErrors.emergencyPhone = 'Enter a valid emergency contact number';
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
      
      if (!userId) {
        // Set mock user ID as fallback for demo
        userId = '64f71c1a9358d5c15a535312'; // Example MongoDB id
        localStorage.setItem('userId', userId);
        console.warn("User ID not found, using mock ID for demo");
      }
      
      await axios.put(`http://localhost:5000/api/users/${userId}`, userData);
      
      setSuccessMessage('Personal information updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error updating user data:', error);
      setErrors({ general: 'Failed to update personal information. Please try again.' });
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
          <input
            type="tel"
            id="phone"
            name="phone"
            className={`input ${errors.phone ? 'input-error' : ''}`}
            value={userData.phone || ''}
            onChange={handleChange}
            disabled={saving}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
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
          <input
            type="tel"
            id="emergencyPhone"
            name="emergencyPhone"
            className={`input ${errors.emergencyPhone ? 'input-error' : ''}`}
            value={userData.emergencyPhone || ''}
            onChange={handleChange}
            disabled={saving}
          />
          {errors.emergencyPhone && <span className="error-text">{errors.emergencyPhone}</span>}
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
  