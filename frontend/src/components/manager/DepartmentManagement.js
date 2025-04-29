"use client";

import { useState, useEffect } from "react";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [message, setMessage] = useState("");

  // Fetch the departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/departments");
        if (!res.ok) throw new Error("Failed to fetch departments");
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        setMessage("Error fetching departments: " + err.message);
      }
    };

    fetchDepartments();
  }, []);

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

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-2">Department Management</h2>
      <p className="mb-4">Manage the departments in your organization here.</p>

      {/* Form to add a new department */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Department Name:</label>
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        onClick={handleAddDepartment}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Department
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}

      {/* List of existing departments */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Existing Departments</h3>
        <ul>
          {departments.map((dept) => (
            <li key={dept.id} className="mb-2">
              {dept.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DepartmentManagement;
