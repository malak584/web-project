import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheck, faTimes, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import api from '../../config/axios';
import './CandidateList.css';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [evaluationData, setEvaluationData] = useState({});

  useEffect(() => {
    fetchCandidates();
  }, []);
  
  const fetchCandidates = async () => {
    try {
      const response = await api.get('/');
      setCandidates(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError(error.response?.data?.message || 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = (candidateId) => {
    setExpandedCandidate(expandedCandidate === candidateId ? null : candidateId);
  };

  const handleScoreChange = (candidateId, category, value) => {
    setEvaluationData(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        scores: {
          ...(prev[candidateId]?.scores || {}),
          [category]: value
        }
      }
    }));
  };

  const handleNotesChange = (candidateId, notes) => {
    setEvaluationData(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        notes
      }
    }));
  };

  const handleSubmitEvaluation = async (candidateId) => {
    console.log("candidateId", candidateId);
    console.log("Données envoyées", evaluationData);
    try {
      const { scores, notes } = evaluationData[candidateId] || {};
      
      if (!scores || !notes) {
        setError('Please provide both scores and notes');
        return;
      }

      await api.patch(`/candidates/${candidateId}/evaluation`, {
        scores,
        notes
      });

      // Refresh candidates list
      await fetchCandidates();
      setExpandedCandidate(null);
      setError('');
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      setError(error.response?.data?.message || 'Failed to submit evaluation');
    }
  };

  const renderScoreInput = (candidateId, category, label) => {
    const score = evaluationData[candidateId]?.scores?.[category] || 0;
    return (
      <div className="score-input">
        <label>{label}</label>
        <div className="stars">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
            <button
              key={star}
              type="button"
              className={`star-button ${score >= star ? 'active' : ''}`}
              onClick={() => handleScoreChange(candidateId, category, star)}
            >
              <FontAwesomeIcon icon={faStar} />
            </button>
          ))}
          <span className="score-value">{score}/10</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading candidates...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="candidate-list">
      <h2>Candidates</h2>
      {candidates.map(candidate => (
        <div key={candidate._id} className="candidate-card">
          <div className="candidate-header" onClick={() => handleExpand(candidate._id)}>
            <div className="candidate-info">
              <span className="candidate-name">
                {candidate.firstName} {candidate.lastName}
              </span>
              <span className="candidate-position">{candidate.position}</span>
              {candidate.evaluation && (
                <span className="evaluated-tag">
                  <FontAwesomeIcon icon={faCheck} /> Evaluated
                </span>
              )}
            </div>
            <FontAwesomeIcon 
              icon={expandedCandidate === candidate._id ? faChevronUp : faChevronDown} 
              className="expand-icon"
            />
          </div>

          {expandedCandidate === candidate._id && (
            <div className="evaluation-form">
              {renderScoreInput(candidate._id, 'technical', 'Technical Skills')}
              {renderScoreInput(candidate._id, 'communication', 'Communication Skills')}
              {renderScoreInput(candidate._id, 'experience', 'Relevant Experience')}
              {renderScoreInput(candidate._id, 'cultureFit', 'Cultural Fit')}

              <div className="form-group">
                <label>Evaluation Notes</label>
                <textarea
                  value={evaluationData[candidate._id]?.notes || ''}
                  onChange={(e) => handleNotesChange(candidate._id, e.target.value)}
                  placeholder="Enter your evaluation notes here..."
                  rows="4"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button
                  className="cancel-button"
                  onClick={() => {
                    setExpandedCandidate(null);
                    setEvaluationData(prev => {
                      const newData = { ...prev };
                      delete newData[candidate._id];
                      return newData;
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
                <button
                  className="submit-button"
                  onClick={() => handleSubmitEvaluation(candidate._id)}
                >
                  Submit Evaluation
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CandidateList; 