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
  faEye
} from '@fortawesome/free-solid-svg-icons';

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const savedApplications = JSON.parse(localStorage.getItem("jobApplications")) || [];
    console.log('Loading applications:', savedApplications);
    setApplications(savedApplications);
  }, []);

  const updateApplicationStatus = (id, status) => {
    console.log('Updating application status:', { id, status });
    const updated = applications.map(app =>
      app.id === id ? { ...app, status } : app
    );
    setApplications(updated);
    localStorage.setItem("jobApplications", JSON.stringify(updated));
  };

  const handleViewPdf = (cv) => {
    console.log('Viewing PDF:', cv);
    setSelectedPdf(cv.data);
    // Open the PDF in a new window
    const pdfWindow = window.open("");
    pdfWindow.document.write(
      "<iframe width='100%' height='100%' src='" + cv.data + "'></iframe>"
    );
  };

  const handleDownloadPdf = (cv) => {
    console.log('Downloading PDF:', cv);
    const link = document.createElement('a');
    link.href = cv.data;
    link.download = cv.name || 'cv.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingApplications = applications.filter(app => app.status === "pending");
  console.log('Pending applications:', pendingApplications);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
      {pendingApplications.length === 0 ? (
        <p>No pending applications</p>
      ) : (
        <ul className="space-y-3">
          {pendingApplications.map((app) => (
            <li key={app.id} className="p-3 border rounded bg-gray-50">
              <div className="flex items-center space-x-2 mb-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                <p><strong>Name:</strong> {app.name}</p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
                <p><strong>Email:</strong> {app.email}</p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <FontAwesomeIcon icon={faPhone} className="text-gray-500" />
                <p><strong>Phone:</strong> {app.phone}</p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <FontAwesomeIcon icon={faFilePdf} className="text-gray-500" />
                <p><strong>CV:</strong></p>
                {app.cv && (
                  <div className="ml-2 space-x-2">
                    <button
                      onClick={() => handleViewPdf(app.cv)}
                      className="btn bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded inline-flex items-center"
                      title="View CV"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(app.cv)}
                      className="btn bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded inline-flex items-center"
                      title="Download CV"
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-1" />
                      Download
                    </button>
                  </div>
                )}
              </div>
              <p className="mb-2"><strong>Position:</strong> {app.jobTitle}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => updateApplicationStatus(app.id, "approved")}
                  className="btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => updateApplicationStatus(app.id, "rejected")}
                  className="btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
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