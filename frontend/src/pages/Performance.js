// src/pages/Performance.js
import React, { useState } from "react";
import Chart from "react-apexcharts";
import logo from "../assets/unilytics_logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./Performance.css";

function Performance() {
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

  // Weekly Engagement (line chart)
  const engagementData = {
    series: [{
      name: "Engagement",
      data: [70, 85, 78, 90, 95, 88, 80]
    }],
    options: {
      chart: { type: "line", height: 350 },
      xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      tooltip: { shared: true, intersect: false },
      stroke: { curve: "smooth" },
      title: { text: "Weekly Engagement", align: "left" }
    }
  };

  // Course Performance (bar chart)
  const performanceData = {
    series: [{
      name: "Performance",
      data: [65, 72, 80, 75, 85, 90, 95]
    }],
    options: {
      chart: { type: "bar", height: 350 },
      xaxis: { categories: ["Math", "CS", "Physics", "Chemistry", "Biology", "History", "English"] },
      tooltip: { shared: true, intersect: false },
      title: { text: "Course Performance", align: "left" }
    }
  };

  // Well-being (radial bar chart)
  const wellbeingData = {
    series: [80],
    options: {
      chart: { type: "radialBar", height: 350 },
      plotOptions: {
        radialBar: {
          hollow: { size: "70%" },
          dataLabels: {
            name: { show: true },
            value: {
              show: true,
              fontSize: "2rem",
              formatter: val => `${val}%`
            }
          }
        }
      },
      labels: ["Well-being"]
    }
  };

  // Focus and Stress Levels (line chart)
  const focusStressData = {
    series: [
      { name: "Focus Level", data: [70, 80, 65, 90] },
      { name: "Stress Level", data: [40, 50, 60, 55] }
    ],
    options: {
      chart: { id: "focus-stress-line", toolbar: { show: false } },
      xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
      tooltip: { shared: true, intersect: false },
      title: { text: "Focus and Stress Levels", align: "left" },
      stroke: { curve: "smooth" }
    }
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
      </header>

      {/* SIDEBAR NAV */}
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

      {/* MAIN CONTENT */}
      <main className="main-content performance-page" style={{ padding: "2rem" }}>
        <section className="dashboard-hero">
          <h1>Welcome, {username}</h1>
          <h1>Performance and Well-being Overview</h1>
        </section>

        {/* Engagement Line Chart */}
        <section style={{ marginBottom: "3rem" }}>
          <Chart options={engagementData.options} series={engagementData.series} type="line" height={350} />
        </section>

        {/* Course Performance Bar Chart */}
        <section style={{ marginBottom: "3rem" }}>
          <Chart options={performanceData.options} series={performanceData.series} type="bar" height={350} />
        </section>

        {/* Well-being Radial Bar */}
        <section style={{ maxWidth: "300px", margin: "auto", marginBottom: "3rem" }}>
          <Chart options={wellbeingData.options} series={wellbeingData.series} type="radialBar" height={350} />
        </section>

        {/* Focus and Stress Line Chart */}
        <section style={{ marginBottom: "3rem" }}>
          <Chart options={focusStressData.options} series={focusStressData.series} type="line" height={350} />
        </section>
      </main>

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

      {/* FOOTER */}
      <footer className="footer">
        &copy; 2025 Unilytics. All rights reserved.
      </footer>
    </div>
  );
}

export default Performance;
