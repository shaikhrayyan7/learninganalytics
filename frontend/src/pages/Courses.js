// src/pages/Courses.js
import React, { useState } from "react";
import "./Courses.css";
import logo from "../assets/unilytics_logo.png";
import { NavLink, useNavigate } from "react-router-dom";

function Courses() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(1);

  const navigate = useNavigate();
  const email = localStorage.getItem("email") || "student@student-dhbw.de";
  const username = email.split("@")[0];

  const courseData = {
    1: [
      { id: "math2", title: "Mathematics 2", description: "Linear Algebra, Statistics" },
      { id: "cn", title: "Computer Networks", description: "OSI Model, Routing, Protocols" }
    ],
    2: [
      { id: "se", title: "Software Engineering", description: "Agile, Scrum, Version Control" }
    ],
    3: []
  };

  const currentSemester = 1;

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    localStorage.setItem("menuOpen", newState);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const filteredCourses = courseData[selectedSemester] || [];

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button className="hamburger" onClick={toggleMenu}>☰</button>
      </header>

      {/* SIDEBAR */}
      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/courses" className="active">Courses</NavLink></li>
          <li><NavLink to="/grades">Grades</NavLink></li>
          <li><NavLink to="/performance">Performance & <br /> Well-being</NavLink></li>
          <li><NavLink to="/recommendations">Personalized Recommendations</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><NavLink to="/privacy">Privacy & Consent</NavLink></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <section className="dashboard-hero">
          <h1>Welcome, {username}</h1>
          <p>Your Enrolled Courses</p>

          {/* Semester Filter */}
          <div className="semester-filter">
            <label>Select Semester: </label>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(Number(e.target.value))}>
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
              <option value={3}>Semester 3</option>
              <option value={3}>Semester 4</option>
            </select>
          </div>
        </section>

        {/* COURSE TILES */}
        <section className="dashboard-tiles">
          {selectedSemester > currentSemester ? (
            <p>No courses available yet for Semester {selectedSemester}.</p>
          ) : filteredCourses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="tile-card"
                onClick={() => handleCourseClick(course.id)}
                style={{ cursor: "pointer" }}
              >
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            ))
          )}
        </section>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button className="yes-button" onClick={() => {
                localStorage.clear();
                navigate("/");
              }}>Yes</button>
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

export default Courses;
