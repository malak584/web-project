import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContractManager = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newContract, setNewContract] = useState({
    employeeId: '',
    contractStartDate: '',
    contractEndDate: '',
    salary: '',
    position: '',
    status: ''
  });

  // Fetch existing contracts on component mount
  const fetchContracts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contracts');
      setContracts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching contracts');
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
      // Send a POST request to create a new contract
      const response = await axios.post('http://localhost:5000/api/contracts', newContract);

      // Add the new contract to the contracts list
      setContracts([...contracts, response.data]);

      // Reset the form
      setNewContract({
        employeeId: '',
        contractStartDate: '',
        contractEndDate: '',
        salary: '',
        position: '',
        status: ''
      });

      alert('Contract created successfully!');
    } catch (err) {
      console.error('Error creating contract', err);
      alert('Error creating contract');
    }
  };

  // Fetch contracts when component mounts
  useEffect(() => {
    fetchContracts();
  }, []);

  if (loading) {
    return <div>Loading contracts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Manage Contracts</h2>
      <p>View and edit employee contracts.</p>

      <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Create a New Contract</h3>

        <div className="mb-2">
          <label className="block">Employee ID</label>
          <input
            type="text"
            name="employeeId"
            value={newContract.employeeId}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
            placeholder="Employee ID"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block">Start Date</label>
          <input
            type="date"
            name="contractStartDate"
            value={newContract.contractStartDate}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block">End Date</label>
          <input
            type="date"
            name="contractEndDate"
            value={newContract.contractEndDate}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block">Salary</label>
          <input
            type="number"
            name="salary"
            value={newContract.salary}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
            placeholder="Salary"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block">Position</label>
          <input
            type="text"
            name="position"
            value={newContract.position}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
            placeholder="Position"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block">Status</label>
          <select
            name="status"
            value={newContract.status}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
          Create Contract
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-4">Existing Contracts</h3>
      {contracts.length === 0 ? (
        <p>No contracts found.</p>
      ) : (
        <table className="min-w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Employee</th>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">End Date</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract._id}>
                <td className="border px-4 py-2">{contract.employeeId}</td>
                <td className="border px-4 py-2">{new Date(contract.contractStartDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(contract.contractEndDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{contract.salary}</td>
                <td className="border px-4 py-2">{contract.position}</td>
                <td className="border px-4 py-2">{contract.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContractManager;
