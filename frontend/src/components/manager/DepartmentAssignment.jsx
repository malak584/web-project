"use client";

import { useEffect, useState } from "react";

const DepartmentAssignment = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [message, setMessage] = useState("");

  // Only declare the handleAssign function once
  const handleAssign = async () => {
    if (!selectedEmployee || !selectedDepartment) {
      setMessage("Please select both employee and department.");
      return;
    }

    try {
      const res = await fetch("/api/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerId: selectedEmployee,  // Assuming selectedEmployee is the manager's ID
          departmentId: selectedDepartment,
        }),
      });

      const data = await res.json();
      setMessage(data.message);  // Display success or error message
    } catch (error) {
      console.error("Error assigning manager:", error);
      setMessage("An error occurred while assigning the manager.");
    }
  };

  useEffect(() => {
    const fetchEmployeesAndDepartments = async () => {
      try {
        const empRes = await fetch("http://localhost:5000/api/employees");
        const empData = await empRes.json();
        setEmployees(empData);
  
        const deptRes = await fetch("http://localhost:5000/api/departments");
        const deptData = await deptRes.json();
        setDepartments(deptData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchEmployeesAndDepartments();
  }, []);
  

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-2">Assign Departments</h2>
      <p className="mb-4">Assign employees to various departments here.</p>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Employee:</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Select Employee --</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName} {/* Display employee's name */}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Department:</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name} {/* Display department name */}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAssign}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Assign
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default DepartmentAssignment;
