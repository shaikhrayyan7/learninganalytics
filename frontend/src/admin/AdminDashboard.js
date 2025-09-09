import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalInstructors, setTotalInstructors] = useState(0);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all users
      const resUsers = await fetch("http://127.0.0.1:5000/api/users/");
      const users = await resUsers.json();
      setTotalStudents(users.filter(u => u.role?.toLowerCase() === "student").length);
      setTotalInstructors(users.filter(u => u.role?.toLowerCase() === "instructor").length);

      // Fetch all programs
      const resPrograms = await fetch("http://127.0.0.1:5000/api/programs");
      const programs = await resPrograms.json();
      setTotalPrograms(programs.length); // count of active programs
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const handleLogoutYes = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </header>

      {/* SIDEBAR */}
      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/admin/dashboard" className="active">Dashboard</NavLink></li>
          <li><NavLink to="/admin/manage-users">Manage Users</NavLink></li>
          <li><NavLink to="/admin/manage-programs">Manage Programs</NavLink></li>
          <li><NavLink to="/admin/profile">Profile</NavLink></li>
          <li>
            <span onClick={() => setShowLogoutModal(true)} className="nav-logout-link">Logout</span>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <h1>Welcome, Admin</h1>
        <p>Here’s an overview of the platform's current status.</p>

        <div className="dashboard-tiles">
          <div className="tile-card">
            <h3>Total Students</h3>
            <p>{totalStudents}</p>
          </div>
          <div className="tile-card">
            <h3>Total Instructors</h3>
            <p>{totalInstructors}</p>
          </div>
          <div className="tile-card">
            <h3>Active Programs</h3>
            <p>{totalPrograms}</p>
          </div>
        </div>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <button className="action-btn" onClick={() => navigate("/admin/manage-users")}>Add New User</button>
          <button className="action-btn" onClick={() => navigate("/admin/manage-programs")}>Add New Program</button>
        </section>

      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button className="yes-button" onClick={handleLogoutYes}>Yes</button>
              <button className="no-button" onClick={() => setShowLogoutModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">&copy; 2025 Unilytics. All rights reserved.</footer>
    </div>
  );
}

export default AdminDashboard;
