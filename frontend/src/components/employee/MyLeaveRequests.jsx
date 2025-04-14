import React, { useEffect, useState } from "react";
import axios from "axios";

const MyLeaveRequests = ({ employeeId }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/leaveRequests/${employeeId}`);
        setLeaveRequests(response.data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchRequests();
  }, [employeeId]);

  return (
    <div>
      <h2>My Leave Requests</h2>
      {leaveRequests.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <ul>
          {leaveRequests.map((request) => (
            <li key={request._id}>
              <strong>Reason:</strong> {request.reason}
              <br />
              <strong>Date:</strong> {request.date}
              <br />
              <strong>Status:</strong> {request.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyLeaveRequests;
