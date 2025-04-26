import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

const AttendanceReport = () => {
  const navigate = useNavigate();

  return (
    <div className="attendance-report-section">
      <h2>Attendance Management</h2>
      <div className="attendance-actions">
        <Button
          variant="primary"
          onClick={() => navigate('/attendance-report')}
          className="action-button"
        >
          <FontAwesomeIcon icon={faChartBar} className="me-2" />
          View Monthly Attendance Report
        </Button>
      </div>
    </div>
  );
};

export default AttendanceReport;
  