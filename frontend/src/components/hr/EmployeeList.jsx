import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faEdit,
  faTrash,
  faSpinner,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import EditEmployeeForm from './EditEmployeeForm';
import AddEmployeeForm from './AddEmployeeForm';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (newEmployee) => {
    try {
      // Ensure all required fields are present and properly formatted
      const employeeData = {
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        email: newEmployee.email,
        position: newEmployee.position,
        department: newEmployee.department,
        startDate: newEmployee.startDate,
        salary: Number(newEmployee.salary),
        phone: newEmployee.phone || '',
        address: newEmployee.address || ''
      };

      console.log('Sending employee data to API:', employeeData);

      const response = await axios.post('http://localhost:5000/api/employees', employeeData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response:', response.data);

      if (response.data && response.data._id) {
        // Update the employees list with the new employee
        setEmployees(prevEmployees => [...prevEmployees, response.data]);
        setShowAddForm(false);
        setError('');
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error adding employee:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      if (err.response) {
        // Handle specific error cases
        switch (err.response.status) {
          case 400:
            setError('Invalid data: ' + (err.response.data.message || 'Please check all fields'));
            break;
          case 409:
            setError('An employee with this email already exists');
            break;
          case 500:
            setError('Server error. Please try again later');
            break;
          default:
            setError(err.response.data.message || 'Failed to add employee');
        }
      } else if (err.request) {
        setError('Could not connect to the server. Please check your connection');
      } else {
        setError('Error: ' + err.message);
      }
    }
  };

  const handleUpdate = async (updatedEmployee) => {
    try {
      console.log('Sending update request with data:', updatedEmployee);
      const response = await axios.put(
        `http://localhost:5000/api/employees/${updatedEmployee._id}`,
        updatedEmployee
      );
      
      console.log('Update response:', response.data);
      
      if (response.data && response.data._id) {
        setEmployees(employees.map(emp => 
          emp._id === updatedEmployee._id ? response.data : emp
        ));
        setEditingEmployee(null);
        setError('');
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Update error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Failed to update employee. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredEmployees = employees
    .filter(employee => {
      const matchesSearch = 
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = 
        !departmentFilter || employee.department === departmentFilter;
      
      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      const aValue = sortBy === 'name' 
        ? `${a.firstName} ${a.lastName}`
        : a[sortBy];
      const bValue = sortBy === 'name'
        ? `${b.firstName} ${b.lastName}`
        : b[sortBy];
      
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  const departments = [...new Set(employees.map(emp => emp.department))];

  return (
    <div className="employee-list">
      <div className="list-header">
        <h2>Employee List</h2>
        
        <div className="controls">
          <button 
            className="add-employee-button"
            onClick={() => setShowAddForm(true)}
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Add Employee
          </button>

          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <span>Loading employees...</span>
        </div>
      ) : showAddForm ? (
        <AddEmployeeForm
          onAdd={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      ) : editingEmployee ? (
        <EditEmployeeForm
          employee={editingEmployee}
          onUpdate={handleUpdate}
          onCancel={() => setEditingEmployee(null)}
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('department')}>
                  Department {sortBy === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('position')}>
                  Position {sortBy === 'position' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')}>
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee._id}>
                  <td>{employee.firstName} {employee.lastName}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>{employee.email}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(employee)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(employee._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList; 