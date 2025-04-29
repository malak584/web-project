import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faUsers, faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './ScheduleInterviewForm.css';

const ScheduleInterviewForm = ({ candidate, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'Technical',
    interviewers: []
  });
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterviewers();
  }, []);

  const fetchInterviewers = async () => {
    try {
      const response = await axios.get('/api/users/interviewers');
      setInterviewers(response.data);
    } catch (error) {
      console.error('Error fetching interviewers:', error);
      setError('Failed to fetch interviewers');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterviewerSelect = (interviewerId) => {
    setFormData(prev => ({
      ...prev,
      interviewers: prev.interviewers.includes(interviewerId)
        ? prev.interviewers.filter(id => id !== interviewerId)
        : [...prev.interviewers, interviewerId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`/api/candidates/${candidate._id}/schedule-interview`, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error scheduling interview:', error);
      setError(error.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-interview-form">
      <h2>Schedule Interview</h2>
      <p className="candidate-info">
        {candidate.firstName} {candidate.lastName} - {candidate.position}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faCalendar} /> Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faClock} /> Time
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Interview Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="Technical">Technical</option>
            <option value="HR">HR</option>
            <option value="Managerial">Managerial</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faUsers} /> Interviewers
          </label>
          <div className="interviewers-list">
            {interviewers.map(interviewer => (
              <div key={interviewer._id} className="interviewer-item">
                <input
                  type="checkbox"
                  id={`interviewer-${interviewer._id}`}
                  checked={formData.interviewers.includes(interviewer._id)}
                  onChange={() => handleInterviewerSelect(interviewer._id)}
                />
                <label htmlFor={`interviewer-${interviewer._id}`}>
                  {interviewer.name} ({interviewer.position})
                </label>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading || formData.interviewers.length === 0}
          >
            {loading ? 'Scheduling...' : 'Schedule Interview'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleInterviewForm; 