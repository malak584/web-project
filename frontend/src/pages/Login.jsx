import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/Landing.css';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (user) {
      // Store user data and role
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      
      // Navigate based on role
      switch(user.role) {
        case 'manager':
          navigate("/manager");
          break;
        case 'hr':
          navigate("/hr");
          break;
        case 'employee':
          navigate("/employee");
          break;
        default:
          navigate("/");
      }
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="login-form">
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

            <button type="submit" className="btn btn-primary login-button">
              Sign In
            </button>
          </form>
          
          <p className="login-footer">
            Don't have an account? <Link to="/signup" className="login-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
