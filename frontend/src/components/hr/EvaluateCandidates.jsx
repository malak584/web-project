// EvaluateCandidates.jsx
import React from 'react';
import CandidateList from './CandidateList'; // Make sure the path is correct

const EvaluateCandidates = () => {
  return (
    <div className="evaluate-candidates-page" style={{ padding: '20px' }}>
      <h1>Evaluate Candidates</h1>
      <CandidateList />
    </div>
  );
};

export default EvaluateCandidates;
