import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Dashboard.css";
import "./Privacy.css";
import logo from "../assets/unilytics_logo.png";

function Privacy() {
  const [menuOpen, setMenuOpen] = useState(() => {
    return localStorage.getItem("menuOpen") === "true";
  });

  const email = localStorage.getItem("email") || "student@student-dhbw.de";
  const username = email.split("@")[0];
  const [consent, setConsent] = useState({
    analytics: true,
    research: false,
    notifications: true,
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ✅ Store menuOpen state in localStorage
  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  const handleChange = (e) => {
    setConsent({ ...consent, [e.target.name]: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your preferences have been saved.");
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </header>

      {/* SIDEBAR */}
      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/courses">Courses</NavLink></li>
          <li><NavLink to="/grades">Grades</NavLink></li>
          <li><NavLink to="/performance">Performance & <br /> Well-being</NavLink></li>
          <li><NavLink to="/recommendations">Personalized Recommendations</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><NavLink to="/privacy" className="active">Privacy & Consent</NavLink></li>
          <li>
            <span
              onClick={() => setShowLogoutModal(true)}
              className="nav-logout-link"
              style={{ cursor: "pointer" }}
            >
              Logout
            </span>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className={`main-content ${menuOpen ? "shifted" : ""}`}>
        <div className="privacy-page">
          <h1>Privacy & Consent</h1>
          <p>Manage how your data is collected and used within Unilytics.</p>

          <form onSubmit={handleSubmit}>
            <section className="privacy-section">
              <h2>Analytics Tracking</h2>
              <label>
                <input
                  type="checkbox"
                  name="analytics"
                  checked={consent.analytics}
                  onChange={handleChange}
                />
                Allow analytics tracking to improve app performance.
              </label>
            </section>

            <section className="privacy-section">
              <h2>Research Usage</h2>
              <label>
                <input
                  type="checkbox"
                  name="research"
                  checked={consent.research}
                  onChange={handleChange}
                />
                Allow anonymized data to be used for educational research.
              </label>
            </section>

            <section className="privacy-section">
              <h2>Data Consent</h2>
              <label>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={consent.notifications}
                  onChange={handleChange}
                />
                I consent to the collection and use of my personal and academic data— including analytics, performance metrics, and well-being indicators— for educational and research purposes.
              </label>
            </section>

            <button type="submit" className="save-consent-btn">
              Save Preferences
            </button>
          </form>
        </div>
      </main>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button
                className="yes-button"
                onClick={() => {
                  localStorage.clear(); // clear session info
                  window.location.href = "/"; // redirect to landing page
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

export default Privacy;
