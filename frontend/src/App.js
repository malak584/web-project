import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
//import Apply from "./components/Apply";

function App() {
  //const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={ <Dashboard /> } />
        {/* <Route path="/apply" element={isAuthenticated ? <Apply /> : <Navigate to="/signin" />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
