import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faFilePdf, faTags } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/Landing.css';

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cv: null,
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'cv') {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({
          ...prev,
          cv: {
            name: file.name,
            type: file.type,
            data: reader.result
          }
        }));
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleTagInput = (e) => {
    setCurrentTag(e.target.value);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && !form.tags.includes(currentTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create new application object
    const newApplication = {
      id: Date.now(),
      ...form,
      jobId,
      status: 'pending',
      jobTitle: getJobTitle(jobId),
      submittedAt: new Date().toISOString()
    };

    console.log('Submitting application:', newApplication); // Debug log

    // Get existing applications from localStorage
    const existingApplications = JSON.parse(localStorage.getItem('jobApplications')) || [];
    
    // Add new application
    existingApplications.push(newApplication);
    
    // Save back to localStorage
    localStorage.setItem('jobApplications', JSON.stringify(existingApplications));
    
    console.log('Applications in storage:', JSON.parse(localStorage.getItem('jobApplications'))); // Debug log
    
    // Show success message and redirect
    alert('Application submitted successfully!');
    navigate('/');
  };

  // Helper function to get job title based on jobId
  const getJobTitle = (id) => {
    const jobs = [
      { id: 1, title: "Senior Software Engineer" },
      { id: 2, title: "HR Manager" },
      { id: 3, title: "Project Manager" }
    ];
    const job = jobs.find(job => job.id === parseInt(id));
    return job ? job.title : "Unknown Position";
  };

  return (
    <div className="application-page">
      <div className="application-container">
        <div className="application-card">
          <h2 className="application-title">Job Application</h2>
          <form onSubmit={handleSubmit} className="application-form">
            <div className="input-group">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="input-group">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="input-group">
              <FontAwesomeIcon icon={faPhone} className="input-icon" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <FontAwesomeIcon icon={faTags} className="input-icon" />
              <div className="tags-container">
                <input
                  type="text"
                  placeholder="Add skills "
                  value={currentTag}
                  onChange={handleTagInput}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                  className="input-field"
                />
                <div className="tags-list">
                  {form.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="tag-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="input-group">
              <FontAwesomeIcon icon={faFilePdf} className="input-icon" />
              <label className="cv-upload-label">
                Upload CV
                <input
                  type="file"
                  name="cv"
                  accept=".pdf"
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </label>
            </div>

            <button type="submit" className="btn btn-primary application-button">
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplication; 