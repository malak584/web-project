import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faFilePdf, 
  faCheck, 
  faTimes,
  faDownload,
  faEye,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import './JobApplications.css';

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const savedApplications = JSON.parse(localStorage.getItem("jobApplications")) || [];
      setApplications(savedApplications);
      setError(null);
    } catch (err) {
      setError('Error loading applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = (id, status) => {
    const updated = applications.map(app =>
      app.id === id ? { ...app, status } : app
    );
    setApplications(updated);
    localStorage.setItem("jobApplications", JSON.stringify(updated));
  };

  const handleViewPdf = (cv) => {
    setSelectedPdf(cv.data);
    const pdfWindow = window.open("");
    pdfWindow.document.write(
      "<iframe width='100%' height='100%' src='" + cv.data + "'></iframe>"
    );
  };

  const handleDownloadPdf = (cv) => {
    const link = document.createElement('a');
    link.href = cv.data;
    link.download = cv.name || 'cv.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchApplications}>Try Again</button>
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === "pending");

  return (
    <div className="applications-container">
      <h2>Job Applications</h2>
      
      {pendingApplications.length === 0 ? (
        <p className="no-applications">No pending applications</p>
      ) : (
        <ul className="application-list">
          {pendingApplications.map((app) => (
            <li key={app.id} className="application-item">
              <div className="info-row">
                <FontAwesomeIcon icon={faUser} />
                <p><strong>Name:</strong> {app.name}</p>
              </div>
              
              <div className="info-row">
                <FontAwesomeIcon icon={faEnvelope} />
                <p><strong>Email:</strong> {app.email}</p>
              </div>
              
              <div className="info-row">
                <FontAwesomeIcon icon={faPhone} />
                <p><strong>Phone:</strong> {app.phone}</p>
              </div>
              
              <div className="info-row">
                <FontAwesomeIcon icon={faFilePdf} />
                <p><strong>CV:</strong></p>
                {app.cv && (
                  <div className="cv-actions">
                    <button
                      onClick={() => handleViewPdf(app.cv)}
                      className="btn view-btn"
                      title="View CV"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(app.cv)}
                      className="btn download-btn"
                      title="Download CV"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      Download
                    </button>
                  </div>
                )}
              </div>
              
              <p><strong>Position:</strong> {app.jobTitle}</p>
              
              <div className="cv-actions">
                <button
                  onClick={() => updateApplicationStatus(app.id, "approved")}
                  className="btn approve-btn"
                >
                  <FontAwesomeIcon icon={faCheck} />
                  Approve
                </button>
                <button
                  onClick={() => updateApplicationStatus(app.id, "rejected")}
                  className="btn reject-btn"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobApplications; 