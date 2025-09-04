import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

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
          <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/admin/manage-users">Manage Users</NavLink></li>
          <li><NavLink to="/admin/manage-roles">Manage Roles</NavLink></li>
          <li><NavLink to="/admin/manage-courses">Manage Courses</NavLink></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <h1>Welcome, Admin</h1>
        <p>Here’s an overview of the platform's current status.</p>

        <div className="dashboard-tiles">
          <div className="tile-card">
            <h3>Total Students</h3>
            <p>126</p>
          </div>
          <div className="tile-card">
            <h3>Total Instructors</h3>
            <p>14</p>
          </div>
          <div className="tile-card">
            <h3>Active Courses</h3>
            <p>8</p>
          </div>
          <div className="tile-card">
            <h3>Pending Approvals</h3>
            <p>3</p>
          </div>
        </div>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <button className="action-btn">Add New User</button>
          <button className="action-btn">Add New Course</button>
          <button className="action-btn">Import Users (CSV)</button>
        </section>

        <section className="recent-activity">
          <h2>Recent Platform Activity</h2>
          <ul>
            <li>Added course "AI Fundamentals" by admin@unilytics</li>
            <li>Assigned 30 students to IPM</li>
            <li>Removed instructor from CTCS</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        &copy; 2025 Unilytics. All rights reserved.
      </footer>
    </div>
  );
}

export default AdminDashboard;
