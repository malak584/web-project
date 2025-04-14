import React, { useState } from 'react';
import './LeaveRequestForm.css';

const LeaveRequestForm = () => {
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason || !date) {
      alert("Please fill in all fields");
      return;
    }

    const newRequest = {
      id: Date.now(),
      employee: localStorage.getItem("currentUser") || "Anonymous", // Optional
      reason,
      date,
      status: "pending",
    };

    const existingRequests = JSON.parse(localStorage.getItem("leaveRequests")) || [];
    existingRequests.push(newRequest);
    localStorage.setItem("leaveRequests", JSON.stringify(existingRequests));

    alert("Leave request submitted!");
    setReason('');
    setDate('');
  };

  return (
    <div className="leave-request-form">
      <h2 className="form-title">Leave Request Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Reason"
          className="input"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <input
          type="date"
          className="input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit" className="button">Submit</button>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
