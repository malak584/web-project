import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';

const Logo = () => {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <FontAwesomeIcon icon={faBuilding} />
      </div>
    </div>
  );
};

export default Logo; 