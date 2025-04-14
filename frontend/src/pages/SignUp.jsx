import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEnvelope, faLock, faUserTag } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/Landing.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    };

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = existingUsers.some(user => user.email === newUser.email);
    
    if (userExists) {
      alert("A user with this email already exists.");
      return;
    }

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Account created successfully!");
    navigate("/login");
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Create Account</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <FontAwesomeIcon icon={faUserPlus} className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="input-group">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="input-group">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="input-group">
              <FontAwesomeIcon icon={faUserTag} className="input-icon" />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Role</option>
                <option value="manager">Manager</option>
                <option value="hr">HR</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary signup-button">
              Create Account
            </button>
          </form>
          
          <p className="signup-footer">
            Already have an account? <Link to="/login" className="signup-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
