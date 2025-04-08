import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigation


  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });


      const data = await res.json();
     
      if (res.ok) {
        localStorage.setItem("token", data.token); // Save token for authentication (optional)
        navigate("/dashboard"); // Redirect to Dashboard.js
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred");
    }
  };


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          Required />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};


export default Login;
