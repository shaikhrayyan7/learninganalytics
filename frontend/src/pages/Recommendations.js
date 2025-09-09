import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./Dashboard.css";
import "./Recommendations.css";

function ExpandableTile({ title, icon, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`tile ${isOpen ? "open" : ""}`}>
      <button className="tile-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="tile-icon">{icon}</span>
        <span className="tile-title">{title}</span>
        <span className="tile-arrow">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="tile-content">{children}</div>}
    </div>
  );
}

function Recommendations() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [recommendations, setRecommendations] = useState({});
  const email = localStorage.getItem("email"); // logged-in user

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/student/${email}/recommendations`)
      .then(res => res.json())
      .then(data => setRecommendations(data))
      .catch(err => console.error(err));
  }, [email]);

  const renderTileContent = (category) => {
    const recs = recommendations[category] || { classWide: [], personalized: [] };
    return (
      <div>
        <ul>
          {recs.classWide.map((tip, index) => <li key={`cw-${index}`}>{tip}</li>)}
        </ul>
        {recs.personalized.length > 0 && (
          <div className="personalized-section">
            <strong>👤 Personally recommended by your instructor:</strong>
            <ul>
              {recs.personalized.map((tip, index) => (
                <li key={`pr-${index}`} className="personal-tip">{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const categories = ["Study Tips", "Upcoming Deadlines", "Workshops & Resources", "Well-being Tips"];

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
          <li><NavLink to="/performance">Performance & <br /> Well-being</NavLink></li>
          <li><NavLink to="/recommendations" className="active">Personalized Recommendations</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><NavLink to="/privacy">Privacy & Consent</NavLink></li>
          <li><NavLink to="/logout">Logout</NavLink></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className={`main-content ${menuOpen ? "shifted" : ""}`}>
        <div className="recommendations-page">
          <h1>Personalized Recommendations</h1>
          <p>Click a topic to expand and explore tailored suggestions for your studies and well-being.</p>

          {categories.map(cat => (
            <ExpandableTile key={cat} title={cat} icon={
              cat === "Study Tips" ? "📚" :
              cat === "Upcoming Deadlines" ? "⏰" :
              cat === "Workshops & Resources" ? "🛠️" : "💡"
            }>
              {renderTileContent(cat)}
            </ExpandableTile>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">&copy; 2025 Unilytics. All rights reserved.</footer>
    </div>
  );
}

export default Recommendations;
