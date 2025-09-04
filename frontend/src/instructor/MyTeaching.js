import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../pages/Dashboard.css"; // Reuse global styles
import "./MyTeaching.css"; // Instructor-specific tweaks
import logo from "../assets/unilytics_logo.png";

function MyTeaching() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "drsmith@instructor-dhbw.de";
  const username = email.split("@")[0];

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const instructorCourses = [
    {
      id: "ds",
      title: "International Project Management",
      description: "Global project planning, risk management, and cross-cultural teamwork strategies.",
    },
    {
      id: "ai",
      title: "Current Topics in Computer Science",
      description: "Lectures and seminars covering advanced topics in Computer Science",
    },
    {
      id: "mt",
      title: "Master Thesis",
      description: "Supervising individual research projects with a focus on defining scope, methodology, technical depth, and academic writing.",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </header>

      {/* SIDEBAR NAV */}
      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/instructor/my-teaching" className={({ isActive }) => isActive ? "active" : ""}>My Teaching</NavLink></li>
          <li><NavLink to="/instructor/class-analytics">Class Analytics</NavLink></li>
          <li><NavLink to="/instructor/student-list">Student List</NavLink></li>
          <li><NavLink to="/instructor/recommendations">Send Recommendations</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <section className="dashboard-hero">
          <h1>Welcome, {username}</h1>
          <p>Your Teaching Modules</p>
        </section>

        <section className="dashboard-tiles">
          {instructorCourses.map((course) => (
            <div
              className="tile-card"
              key={course.id}
              onClick={() => navigate(`/instructor/course/${course.id}`)}
              style={{ cursor: "pointer" }}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          ))}
        </section>
      </main>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button className="yes-button" onClick={handleLogout}>Yes</button>
              <button className="no-button" onClick={() => setShowLogoutModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        &copy; 2025 Unilytics. All rights reserved.
      </footer>
    </div>
  );
}

export default MyTeaching;
