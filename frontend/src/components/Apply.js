import React, { useState } from "react";

const Apply = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Application submitted successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 relative">
      <div className="absolute top-4 right-4">
        <button className="bg-red-500 text-white py-2 px-4 rounded-md flex items-center">
          Login
        </button>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Apply for a Job</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Upload CV (PDF only)</span>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange} 
              className="block w-full mt-2 border p-2 rounded-md" 
              required
            />
          </label>
          
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
} 

export default Apply;
