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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to create account');
        return;
      }

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    }
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
                <option value="Manager">Manager</option>
                <option value="HR">HR</option>
                <option value="Employee">Employee</option>
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