// src/pages/Grades.js
import React, { useState } from "react";
import "./Dashboard.css";
import "./Grades.css";
import logo from "../assets/unilytics_logo.png";
import { NavLink, useNavigate } from "react-router-dom";

function Grades() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "student@student-dhbw.de";
  const username = email.split("@")[0];

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    localStorage.setItem("menuOpen", newState);
  };

  return (
    <div className="dashboard-page">
      {/* 🔺 HEADER */}
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button className="hamburger" onClick={toggleMenu}>☰</button>
      </header>

      {/* 📚 SIDEBAR NAVIGATION */}
      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
          <li><NavLink to="/courses" className={({ isActive }) => isActive ? "active" : ""}>Courses</NavLink></li>
          <li><NavLink to="/grades" className={({ isActive }) => isActive ? "active" : ""}>Grades</NavLink></li>
          <li><NavLink to="/performance" className={({ isActive }) => isActive ? "active" : ""}>Performance & <br /> Well-being</NavLink></li>
          <li><NavLink to="/recommendations" className={({ isActive }) => isActive ? "active" : ""}>Personalized Recommendations</NavLink></li>
          <li><NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink></li>
          <li><NavLink to="/privacy" className={({ isActive }) => isActive ? "active" : ""}>Privacy & Consent</NavLink></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      {/* 📊 GRADES SECTION */}
      <div className="main-content">
        <section className="dashboard-hero">
          <h1>Welcome, {username}</h1>
          <p>Your Grades</p>
        </section>

        <section className="grades-table">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mathematics 2</td>
                <td>1.7</td>
                <td>Passed</td>
              </tr>
              <tr>
                <td>Computer Networks</td>
                <td>2.3</td>
                <td>Passed</td>
              </tr>
              <tr>
                <td>Software Engineering</td>
                <td>2.0</td>
                <td>Passed</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button
                className="yes-button"
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
              >
                Yes
              </button>
              <button
                className="no-button"
                onClick={() => setShowLogoutModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔻 FOOTER */}
      <footer className="footer">
        &copy; 2025 Unilytics. All rights reserved.
      </footer>
    </div>
  );
}

export default Grades;
