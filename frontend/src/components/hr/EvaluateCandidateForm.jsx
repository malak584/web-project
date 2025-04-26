import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faComment } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/axios';
import './EvaluateCandidateForm.css';

const EvaluateCandidateForm = ({ candidate, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    scores: {
      technical: 0,
      communication: 0,
      experience: 0,
      cultureFit: 0
    },
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScoreChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [category]: value
      }
    }));
  };

  const handleNotesChange = (e) => {
    setFormData(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.patch(`/candidates/${candidate._id}/evaluation`, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error evaluating candidate:', error);
      setError(error.response?.data?.message || 'Failed to evaluate candidate');
    } finally {
      setLoading(false);
    }
  };

  const renderScoreInput = (category, label) => (
    <div className="score-input">
      <label>{label}</label>
      <div className="stars">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
          <button
            key={score}
            type="button"
            className={`star-button ${formData.scores[category] >= score ? 'active' : ''}`}
            onClick={() => handleScoreChange(category, score)}
          >
            <FontAwesomeIcon icon={faStar} />
          </button>
        ))}
        <span className="score-value">{formData.scores[category]}/10</span>
      </div>
    </div>
  );

  return (
    <div className="evaluate-candidate-form">
      <h2>Evaluate Candidate</h2>
      <p className="candidate-info">
        {candidate.firstName} {candidate.lastName} - {candidate.position}
      </p>

      <form onSubmit={handleSubmit}>
        {renderScoreInput('technical', 'Technical Skills')}
        {renderScoreInput('communication', 'Communication Skills')}
        {renderScoreInput('experience', 'Relevant Experience')}
        {renderScoreInput('cultureFit', 'Cultural Fit')}

        <div className="form-group">
          <label>
            <FontAwesomeIcon icon={faComment} /> Evaluation Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleNotesChange}
            placeholder="Enter your evaluation notes here..."
            rows="4"
          />
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
            disabled={loading}
          >
            {loading ? 'Evaluating...' : 'Submit Evaluation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluateCandidateForm; 