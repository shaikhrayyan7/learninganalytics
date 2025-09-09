import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import logo from "../assets/unilytics_logo.png";
import { NavLink, useNavigate } from "react-router-dom";

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(
    localStorage.getItem("menuOpen") === "true"
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    localStorage.setItem("menuOpen", newState);
  };

  const email = localStorage.getItem("email") || "";
  const username = email.split("@")[0];
  const isInstructor = email.endsWith("@instructor-dhbw.de");

  // Fetch student's current semester courses
  useEffect(() => {
    if (!isInstructor) {
      fetch(`http://127.0.0.1:5000/api/student/${email}/courses`)
        .then((res) => res.json())
        .then((data) => setCourses(data))
        .catch((err) => console.error(err));
    }
  }, [email, isInstructor]);

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
          <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>

          {isInstructor ? (
            <>
              <li><NavLink to="/instructor/my-teaching" className={({ isActive }) => isActive ? "active" : ""}>My Teaching</NavLink></li>
              <li><NavLink to="/instructor/class-analytics" className={({ isActive }) => isActive ? "active" : ""}>Class Analytics</NavLink></li>
              <li><NavLink to="/instructor/student-list">Student List</NavLink></li>
              <li><NavLink to="/instructor/recommendations" className={({ isActive }) => isActive ? "active" : ""}>Send Recommendations</NavLink></li>
            </>
          ) : (
            <>
              <li><NavLink to="/courses" className={({ isActive }) => isActive ? "active" : ""}>Courses</NavLink></li>
              <li><NavLink to="/grades" className={({ isActive }) => isActive ? "active" : ""}>Grades</NavLink></li>
              <li><NavLink to="/performance" className={({ isActive }) => isActive ? "active" : ""}>Performance &<br/>Well-being</NavLink></li>
              <li><NavLink to="/recommendations" className={({ isActive }) => isActive ? "active" : ""}>Personalized Recommendations</NavLink></li>
            </>
          )}

          <li><NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink></li>
          {!isInstructor && <li><NavLink to="/privacy" className={({ isActive }) => isActive ? "active" : ""}>Privacy & Consent</NavLink></li>}
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {!isInstructor ? (
          <>
            {/* STUDENT DASHBOARD */}
            <section className="dashboard-hero">
              <h1>Welcome, {username}</h1>
              <p>Your Current Semester Courses</p>
            </section>

            <section className="dashboard-tiles">
              {courses.length > 0 ? courses.map((course) => (
                <div key={course.id} className="tile-card">
                  <h3>{course.title}</h3>
                  <h4>{course.type === "core" ? "Core Module" : `Specialization: ${course.specialization}`}</h4>
                </div>
              )) : <p>Loading courses...</p>}
            </section>
          </>
        ) : (
          <>
            {/* INSTRUCTOR DASHBOARD */}
            <section className="dashboard-hero">
              <h1>Welcome, {username}</h1>
              <p>Instructor Panel: Manage your subjects and view student insights</p>
            </section>

            <section className="dashboard-tiles">
              <div className="tile-card">
                <h3>Class-wide Analytics</h3>
                <p>Engagement, attendance & performance trends</p>
              </div>
              <div className="tile-card">
                <h3>Identify At-Risk Students</h3>
                <p>Low grades, drop in interaction, etc.</p>
              </div>
              <div className="tile-card">
                <h3>Send Academic Recommendations</h3>
                <p>Push study resources & mentor notes</p>
              </div>
            </section>
          </>
        )}
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

export default Dashboard;
