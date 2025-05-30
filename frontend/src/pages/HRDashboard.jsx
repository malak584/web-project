import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faUsers,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';

import EmployeeList from '../components/hr/EmployeeList';
import EvaluateCandidates from '../components/hr/EvaluateCandidates';
import './HRDashboard.css';

const HRDashboard = () => {
  const [activeSection, setActiveSection] = useState('employees');

  const sections = [
    { id: 'employees', title: 'Employee Management', icon: faUsers },
    { id: 'candidates', title: 'Candidate Evaluation', icon: faClipboardList }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'employees':
        return (
          <div className="section-content">
            <EmployeeList />
          </div>
        );
      case 'candidates':
        return <EvaluateCandidates />;
      default:
        return null;
    }
  };

  return (
    <div className="hr-dashboard">
      <header className="dashboard-header">
        <h1>HR Dashboard</h1>
        <div className="user-info">
          <span>Welcome, HR Manager</span>
        </div>
      </header>

      <div className="dashboard-container">
        <nav className="sidebar">
          {sections.map(section => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <FontAwesomeIcon icon={section.icon} className="nav-icon" />
              <span>{section.title}</span>
            </button>
          ))}
        </nav>

        <main className="main-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;
