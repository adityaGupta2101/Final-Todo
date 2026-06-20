import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Task from "./Components/Task.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

const App = () => {
  return (
    <div className="app-wrapper">
      {/* Top Navbar */}
      <div className="top-navbar">
        <Link to="/" className="nav-btn">Home</Link>
        <Link to="/login" className="nav-btn">Login</Link>
        <Link to="/register" className="nav-btn">Register</Link>
      </div>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Task />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;