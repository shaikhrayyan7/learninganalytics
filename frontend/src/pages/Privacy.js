import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Dashboard.css";
import "./Privacy.css";
import logo from "../assets/unilytics_logo.png";

function Privacy() {
  const [menuOpen, setMenuOpen] = useState(() => localStorage.getItem("menuOpen") === "true");
  const email = localStorage.getItem("email");
  const [consent, setConsent] = useState({
    analytics: true,
    research: false,
    consent: true,
  });
  const [editable, setEditable] = useState(false);
  const [tempConsent, setTempConsent] = useState(consent);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);

    // Fetch backend privacy
    fetch(`http://127.0.0.1:5000/api/student/${email}/privacy`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = {};
          data.forEach((item) => {
            mapped[item.type] = item.value;
          });
          setConsent(mapped);
          setTempConsent(mapped);
        }
      })
      .catch((err) => console.error("Error fetching privacy:", err));
  }, [menuOpen, email]);

  const handleChange = (e) => {
    setTempConsent({ ...tempConsent, [e.target.name]: e.target.checked });
  };

  const handleManage = () => {
    setTempConsent(consent);
    setEditable(true);
  };

  const handleCancel = () => setEditable(false);

  const handleSave = () => {
    setConsent(tempConsent);
    setEditable(false);

    const payload = Object.entries(tempConsent).map(([type, value]) => ({ type, value }));

    fetch(`http://127.0.0.1:5000/api/student/${email}/privacy`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => console.error("Error saving privacy:", err));
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
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/courses">Courses</NavLink></li>
          <li><NavLink to="/grades">Grades</NavLink></li>
          <li><NavLink to="/survey" className="active">My Surveys</NavLink></li>
          <li><NavLink to="/performance">Performance & <br /> Well-being</NavLink></li>
          <li><NavLink to="/recommendations">Personalized Recommendations</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><NavLink to="/privacy" className="active">Privacy & Consent</NavLink></li>
          <li>
            <span onClick={() => setShowLogoutModal(true)} className="nav-logout-link" style={{ cursor: "pointer" }}>
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

          <form onSubmit={(e) => e.preventDefault()}>
            <section className="privacy-section">
              <h2>Analytics Tracking</h2>
              <label>
                <input
                  type="checkbox"
                  name="analytics"
                  checked={editable ? tempConsent.analytics : consent.analytics}
                  onChange={handleChange}
                  style={{ pointerEvents: editable ? "auto" : "none" }}
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
                  checked={editable ? tempConsent.research : consent.research}
                  onChange={handleChange}
                  style={{ pointerEvents: editable ? "auto" : "none" }}
                />
                Allow anonymized data to be used for educational research.
              </label>
            </section>

            <section className="privacy-section">
              <h2>Data Consent</h2>
              <label>
                <input
                  type="checkbox"
                  name="consent"
                  checked={editable ? tempConsent.consent : consent.consent}
                  onChange={handleChange}
                  style={{ pointerEvents: editable ? "auto" : "none" }}
                />
                I consent to the collection and use of my personal and academic data— including analytics, performance metrics, and well-being indicators— for educational and research purposes.
              </label>
            </section>

            {!editable ? (
              <button type="button" className="save-consent-btn" onClick={handleManage}>
                Manage Preferences
              </button>
            ) : (
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="button" className="save-consent-btn" onClick={handleSave}>
                  Save Preferences
                </button>
                <button type="button" className="save-consent-btn cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button className="yes-button" onClick={() => { localStorage.clear(); window.location.href = "/"; }}>Yes</button>
              <button className="no-button" onClick={() => setShowLogoutModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">&copy; 2025 Unilytics. All rights reserved.</footer>
    </div>
  );
}

export default Privacy;
