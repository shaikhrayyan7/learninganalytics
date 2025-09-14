// src/pages/Grades.js
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import "./Grades.css";
import logo from "../assets/unilytics_logo.png";
import { NavLink, useNavigate } from "react-router-dom";

function Grades() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [grades, setGrades] = useState([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");
  const username = email.split("@")[0];

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    localStorage.setItem("menuOpen", newState);
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/student/${email}/grades`)
      .then(res => res.json())
      .then(data => setGrades(data))
      .catch(err => console.error(err));
  }, [email]);

  // Performance summary
  const totalCredits = grades.reduce((sum, g) => sum + (g.accountedCredits || 0), 0);
  const totalGrades = grades.filter(g => g.grade != null).map(g => g.grade);
  const currentGPA = totalGrades.length > 0
    ? (totalGrades.reduce((a, b) => a + b, 0) / totalGrades.length).toFixed(2)
    : "-";

  // 🔹 Dynamically calculate required credits
  const requiredCredits = grades.reduce((sum, g) => sum + (g.credits || 0), 0);

  // Group grades by semester
  const semesters = [...new Set(grades.map(g => g.semester))].sort((a, b) => a - b);

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
          <li><NavLink to="/survey" className="active">My Surveys</NavLink></li>
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
          <h3>Your Study Result</h3>
        </section>

        {/* Single table with semester grouping */}
        <section className="grades-table">
          <table style={{ width: "95%", minWidth: "1000px" }}>
            <thead>
              <tr>
                <th>Semester</th>
                <th>Course</th>
                <th>Credits</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Accounted Credits</th>
              </tr>
            </thead>
            <tbody>
              {semesters.map(sem => (
                <React.Fragment key={sem}>
                  {/* Semester Header */}
                  <tr className="semester-row">
                    <td colSpan="6"><strong>Semester {sem}</strong></td>
                  </tr>
                  {grades
                    .filter(g => g.semester === sem)
                    .map((course, idx) => (
                      <tr key={idx}>
                        <td></td>
                        <td>{course.title}</td>
                        <td>{course.credits}</td>
                        <td>{course.grade ?? "-"}</td>
                        <td>{course.status ?? "-"}</td>
                        <td>{course.accountedCredits ?? "-"}</td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}

              {/* Performance summary inside table */}
              <tr className="summary-row">
                <td colSpan="2"><strong>Total Accounted Credits:</strong></td>
                <td colSpan="4">{totalCredits}</td>
              </tr>
              <tr className="summary-row">
                <td colSpan="2"><strong>Credits Required for Graduation:</strong></td>
                <td colSpan="4">{requiredCredits}</td>
              </tr>
              <tr className="summary-row">
                <td colSpan="2"><strong>Current GPA:</strong></td>
                <td colSpan="4">{currentGPA}</td>
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
