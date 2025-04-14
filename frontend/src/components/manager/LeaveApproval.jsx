import React, { useEffect, useState } from 'react';

const LeaveApproval = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
    setRequests(savedRequests);
  }, []);

  const updateRequestStatus = (id, status) => {
    const updated = requests.map(req =>
      req.id === id ? { ...req, status } : req
    );
    setRequests(updated);
    localStorage.setItem("leaveRequests", JSON.stringify(updated));
  };

  const pending = requests.filter(req => req.status === "pending");

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Approve Leave Requests</h2>
      {pending.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <ul className="space-y-3">
          {pending.map((req) => (
            <li key={req.id} className="p-3 border rounded bg-gray-50">
              <p><strong>Name:</strong> {req.employee}</p>
              <p><strong>Email:</strong> {req.email || "Not provided"}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
              <p><strong>Date:</strong> {req.date}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => updateRequestStatus(req.id, "approved")}
                  className="btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateRequestStatus(req.id, "rejected")}
                  className="btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
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

export default LeaveApproval;
