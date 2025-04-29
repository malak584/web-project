"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './DepartmentManagement.css';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/departments");
      if (!res.ok) throw new Error("Failed to fetch departments");
      const data = await res.json();
      setDepartments(data);
      setError(null);
    } catch (err) {
      setError("Error fetching departments: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new department
  const handleAddDepartment = async () => {
    if (!departmentName) {
      setMessage("Please enter a department name.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: departmentName }),
      });

      if (!res.ok) throw new Error("Failed to add department");

      const data = await res.json();

      if (data.success) {
        setDepartments((prevDepartments) => [
          ...prevDepartments,
          { id: data.id, name: departmentName },
        ]);
        setDepartmentName("");
        setMessage("Department added successfully!");
      } else {
        setMessage("Error adding department.");
      }
    } catch (err) {
      setMessage("Error adding department: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading departments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchDepartments}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="departments-container">
      <h2>Department Management</h2>
      
      <div className="add-department-form">
        <div className="form-group">
          <label>Department Name</label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="form-control"
            placeholder="Enter department name"
          />
        </div>
        <button onClick={handleAddDepartment} className="add-btn">
          Add Department
        </button>
      </div>

      {message && (
        <div className={message.includes("successfully") ? "success-message" : "error-message"}>
          {message}
        </div>
      )}

      <div className="departments-list">
        <h3>Existing Departments</h3>
        {departments.map((dept) => (
          <div key={dept.id} className="department-item">
            <span className="department-name">{dept.name}</span>
            <div className="department-actions">
              <button className="action-btn edit-btn">
                <FontAwesomeIcon icon={faEdit} />
                Edit
              </button>
              <button className="action-btn delete-btn">
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentManagement;
