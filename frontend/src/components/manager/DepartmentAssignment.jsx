"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './DepartmentAssignment.css';

const DepartmentAssignment = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeesAndDepartments();
  }, []);

  const fetchEmployeesAndDepartments = async () => {
    try {
      setLoading(true);
      const [employeesRes, departmentsRes] = await Promise.all([
        fetch('http://localhost:5000/api/employees'),
        fetch('http://localhost:5000/api/departments')
      ]);

      if (!employeesRes.ok || !departmentsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const employeesData = await employeesRes.json();
      const departmentsData = await departmentsRes.json();

      setEmployees(employeesData);
      setDepartments(departmentsData);
      setError(null);
    } catch (err) {
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedEmployee || !selectedDepartment) {
      setMessage('Please select both employee and department.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/add-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          departmentId: selectedDepartment,
        }),
      });

      const data = await res.json();
      setMessage(data.message);
      
      if (res.ok) {
        setSelectedEmployee('');
        setSelectedDepartment('');
      }
    } catch (error) {
      setMessage('An error occurred while assigning the employee.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchEmployeesAndDepartments}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="assignment-container">
      <h2>Assign Departments</h2>
      <p>Assign employees to various departments here.</p>

      <div className="form-group">
        <label>Select Employee:</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="form-control"
        >
          <option value="">-- Select Employee --</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Select Department:</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="form-control"
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleAssign} className="assign-btn">
        Assign
      </button>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success-message' : 'error-message'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default DepartmentAssignment;
