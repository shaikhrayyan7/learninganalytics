import React, { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(() => localStorage.getItem("menuOpen") === "true");

  React.useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  // --- MOCKED DATA (class-wide + personalized by instructor) ---
  const recommendations = {
    "Study Tips": {
      classWide: [
        "Use the Pomodoro technique for focused study sessions.",
        "Review your notes within 24 hours after class.",
        "Join or form study groups to enhance learning."
      ],
      personalized: [
        "Set clear, achievable goals for each study session."
      ]
    },
    "Upcoming Deadlines": {
      classWide: [
        "Math Assignment due in 3 days",
        "Computer Science Project submission due next week",
        "Register for upcoming exams by next Friday"
      ],
      personalized: []
    },
    "Workshops & Resources": {
      classWide: [
        "Register for time management webinars.",
        "Check out free resources on the student portal."
      ],
      personalized: []
    },
    "Well-being Tips": {
      classWide: [
        "Practice mindfulness exercises daily to reduce stress.",
        "Take short breaks during long study sessions.",
        "Stay hydrated and get enough sleep."
      ],
      personalized: [
        "Try guided meditation at night to improve your sleep quality."
      ]
    }
  };

  const renderTileContent = (category) => {
    const { classWide, personalized } = recommendations[category];

    return (
      <div>
        <ul>
          {classWide.map((tip, index) => (
            <li key={`cw-${index}`}>{tip}</li>
          ))}
        </ul>

        {personalized.length > 0 && (
          <div className="personalized-section">
            <strong>👤 Personally recommended by your instructor:</strong>
            <ul>
              {personalized.map((tip, index) => (
                <li key={`pr-${index}`} className="personal-tip">{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
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

          <ExpandableTile title="Study Tips" icon="📚">
            {renderTileContent("Study Tips")}
          </ExpandableTile>

          <ExpandableTile title="Upcoming Deadlines" icon="⏰">
            {renderTileContent("Upcoming Deadlines")}
          </ExpandableTile>

          <ExpandableTile title="Workshops & Resources" icon="🛠️">
            {renderTileContent("Workshops & Resources")}
          </ExpandableTile>

          <ExpandableTile title="Well-being Tips" icon="💡">
            {renderTileContent("Well-being Tips")}
          </ExpandableTile>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        &copy; 2025 Unilytics. All rights reserved.
      </footer>
    </div>
  );
}

export default Recommendations;
