import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./StudentSurvey.css";

function StudentSurvey() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [surveys, setSurveys] = useState([]);
  const [responses, setResponses] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    localStorage.setItem("menuOpen", newState);
  };

  useEffect(() => {
    if (!email) return;
    fetch(`http://127.0.0.1:5000/api/student/assigned/${email}`)
      .then(res => res.json())
      .then(data => setSurveys(data))
      .catch(err => console.error(err));
  }, [email]);

  const handleAnswer = (surveyId, category, questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [surveyId]: {
        ...prev[surveyId],
        [category]: {
          ...prev[surveyId]?.[category],
          [questionId]: value
        }
      }
    }));
  };

  const handleSubmit = async (e, surveyId) => {
    e.preventDefault();
    const surveyResponses = responses[surveyId] || {};
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/student/submit/${surveyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: surveyResponses })
      });
      if (res.ok) {
        setNotification({ message: "Survey submitted successfully!", type: "success" });
        setSurveys(prev => prev.filter(s => s._id !== surveyId));
        setResponses(prev => {
          const copy = { ...prev };
          delete copy[surveyId];
          return copy;
        });
      } else {
        setNotification({ message: "Failed to submit survey.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setNotification({ message: "Error submitting survey.", type: "error" });
    }

    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const toggleSection = (surveyId, category) => {
    setExpandedSections(prev => ({
      ...prev,
      [surveyId]: {
        ...prev[surveyId],
        [category]: !prev[surveyId]?.[category]
      }
    }));
  };

  return (
    <div className="dashboard-page">
      <header className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <button className="hamburger" onClick={toggleMenu}>☰</button>
      </header>

      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/courses">Courses</NavLink></li>
          <li><NavLink to="/grades">Grades</NavLink></li>
          <li><NavLink to="/survey" className="active">My Surveys</NavLink></li>
          <li><NavLink to="/performance">Performance & <br /> Well-being</NavLink></li>
          <li><NavLink to="/recommendations">Personalized Recommendations</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><NavLink to="/privacy">Privacy & Consent</NavLink></li>  
          <li><span onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      <main className="main-content">
        <h1>📋 Your Assigned Surveys</h1>
        {surveys.length === 0 && <p>No surveys assigned!</p>}

        {notification.message && (
          <div className={`notification ${notification.type}`}>{notification.message}</div>
        )}

        {surveys.map(survey => (
          <form key={survey._id} onSubmit={(e) => handleSubmit(e, survey._id)} className="survey-form">
            <h2 className="survey-title">{survey.course} — {survey.label}</h2>
            <p className="survey-dates">
              {new Date(survey.startDate).toLocaleDateString()} - {new Date(survey.endDate).toLocaleDateString()}
            </p>

            {['engagement', 'wellbeing', 'stress', 'focus'].map(cat => (
              <div key={cat} className="survey-tile">
                <div
                  className="category-header"
                  onClick={() => toggleSection(survey._id, cat)}
                >
                  <h3>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
                  <span className={`arrow ${expandedSections[survey._id]?.[cat] ? 'open' : ''}`}>▼</span>
                </div>

                {expandedSections[survey._id]?.[cat] && (
                  <div className="questions-container">
                    {survey.questions[cat].map(q => (
                      <div key={q._id} className="question-block">
                        <p className="question-text">{q.text}</p>
                        <div className="options">
                          {q.options.map(opt => (
                            <label key={opt}>
                              <input
                                type="radio"
                                name={`${cat}-${q._id}`}
                                value={opt}
                                checked={responses[survey._id]?.[cat]?.[q._id] === opt}
                                onChange={(e) => handleAnswer(survey._id, cat, q._id, e.target.value)}
                                required
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="survey-actions">
              <button type="submit" className="update-btn">Submit Survey</button>
            </div>
          </form>
        ))}
      </main>

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button className="update-btn" onClick={() => { localStorage.clear(); navigate("/"); }}>Yes</button>
              <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">&copy; 2025 Unilytics. All rights reserved.</footer>
    </div>
  );
}

export default StudentSurvey;
