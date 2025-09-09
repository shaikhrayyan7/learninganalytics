// src/pages/Courses.js
import React, { useState, useEffect } from "react";
import "./Courses.css";
import logo from "../assets/unilytics_logo.png";
import { NavLink, useNavigate } from "react-router-dom";

function Courses() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [courses, setCourses] = useState([]);
  const [maxSemesters, setMaxSemesters] = useState(6); // default fallback
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "student@student-dhbw.de";
  const username = email.split("@")[0];

  // Fetch program details once
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/profile/${email}`);
        const data = await res.json();
        if (data && data.program) {
          // ask backend program collection to get details
          const programRes = await fetch(`http://127.0.0.1:5000/api/program/${data.program}`);
          const programData = await programRes.json();
          if (programData.semesters) {
            setMaxSemesters(programData.semesters);
          }
        }
      } catch (err) {
        console.error("Error fetching program info:", err);
      }
    };
    fetchProgram();
  }, [email]);

  // Fetch courses whenever semester changes
  useEffect(() => {
    fetchCourses(selectedSemester);
  }, [selectedSemester]);

  const fetchCourses = async (semester) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/student/${email}/courses?semester=${semester}`
      );
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    localStorage.setItem("menuOpen", newState);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

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
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
            >
              {[...Array(maxSemesters)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Semester {i + 1}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* COURSE TILES */}
        <section className="dashboard-tiles">
          {courses.length === 0 ? (
            <p>No courses found for Semester {selectedSemester}.</p>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="tile-card"
                onClick={() => handleCourseClick(course.id)}
                style={{ cursor: "pointer" }}
              >
                <h3>{course.title}</h3>
                <p>{course.description || ""}</p>
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
