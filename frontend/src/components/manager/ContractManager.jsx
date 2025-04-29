import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './ContractManager.css';

const ContractManager = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newContract, setNewContract] = useState({
    employeeEmail: '',  // Use employeeEmail instead of employeeId
    contractStartDate: '',
    contractEndDate: '',
    salary: '',
    position: '',
    status: ''
  });

  useEffect(() => {
    
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('http://localhost:5000/api/contracts/');
      
      setContracts(response.data);
      
      setError(null);
    } catch (err) {
      setError('Error fetching contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContract({
      ...newContract,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/contracts/add', newContract, {
        headers: { 'Content-Type': 'application/json' }
      });
      setContracts([...contracts, response.data]);
      setNewContract({
        employeeEmail: '',  // Reset to empty
        contractStartDate: '',
        contractEndDate: '',
        salary: '',
        position: '',
        status: ''
      });
    } catch (err) {
      setError('Error creating contract');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading contracts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchContracts}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="contracts-container">
      <h2>Manage Contracts</h2>
      
      <form onSubmit={handleSubmit} className="contract-form">
        <h3>Create New Contract</h3>
        
        <div className="form-group">
          <label>Employee Email</label>
          <input
            type="email"  // Change input type to email
            name="employeeEmail"  // Use employeeEmail
            value={newContract.employeeEmail}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="contractStartDate"
            value={newContract.contractStartDate}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="contractEndDate"
            value={newContract.contractEndDate}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Salary</label>
          <input
            type="number"
            name="salary"
            value={newContract.salary}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Position</label>
          <input
            type="text"
            name="position"
            value={newContract.position}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={newContract.status}
            onChange={handleInputChange}
            className="form-control"
            required
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Create Contract
        </button>
      </form>

      <div className="contracts-list">
        <h3>Existing Contracts</h3>
        <table className="contracts-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Salary</th>
              <th>Position</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(contract => (
              <tr key={contract._id}>
                <td>{contract.employeeEmail}</td>  {/* Display the employee's email */}
                <td>{new Date(contract.contractStartDate).toLocaleDateString()}</td>
                <td>{new Date(contract.contractEndDate).toLocaleDateString()}</td>
                <td>{contract.salary}</td>
                <td>{contract.position}</td>
                <td>
                  <span className={`contract-status status-${contract.status}`}>
                    {contract.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractManager;
