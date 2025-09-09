import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./SendRecommendations.css";

const courses = {
  "International Project Management": ["Alice", "Bob", "Charlie"],
  "Current Topics in CS": ["David", "Eva", "Frank"],
};

function SendRecommendations() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "drsmith@instructor-dhbw.de";
  const username = email.split("@")[0];

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Personalized
  const [selectedCourse, setSelectedCourse] = useState(Object.keys(courses)[0]);
  const [selectedStudent, setSelectedStudent] = useState(courses[Object.keys(courses)[0]][0]);
  const [personalMessage, setPersonalMessage] = useState("");
  const [personalSuccess, setPersonalSuccess] = useState(false);

  // Class-wide
  const [classCourse, setClassCourse] = useState(Object.keys(courses)[0]);
  const [classMessage, setClassMessage] = useState("");
  const [classSuccess, setClassSuccess] = useState(false);

  const handlePersonalSend = () => {
    if (!personalMessage.trim()) return;

    console.log("📤 Personal Recommendation", {
      course: selectedCourse,
      student: selectedStudent,
      message: personalMessage,
    });

    setPersonalSuccess(true);
    setPersonalMessage("");
    setTimeout(() => setPersonalSuccess(false), 3000);
  };

  const handleClassSend = () => {
    if (!classMessage.trim()) return;

    console.log("📤 Class-wide Recommendation", {
      course: classCourse,
      message: classMessage,
    });

    setClassSuccess(true);
    setClassMessage("");
    setTimeout(() => setClassSuccess(false), 3000);
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
          <li><NavLink to="/instructor/my-teaching">My Teaching</NavLink></li>
          <li><NavLink to="/instructor/class-analytics">Class Analytics</NavLink></li>
          <li><NavLink to="/instructor/student-list">Student List</NavLink></li>
          <li><NavLink to="/instructor/recommendations" className="active">Send Recommendations</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      {/* MAIN */}
      <main className="main-content">
        <h1>📬 Send Recommendations</h1>
        <p className="subtitle">Choose whether to send a personal message to a student or a general recommendation to a whole class.</p>

        <div className="recommendations-container">
          {/* PERSONALIZED */}
          <div className="recommendation-box">
            <h2>🎯 Personalized Recommendation</h2>

            <div className="form-group">
              <label>Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedStudent(courses[e.target.value][0]);
                }}
              >
                {Object.keys(courses).map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                {courses[selectedCourse].map((student) => (
                  <option key={student} value={student}>{student}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Type your message..."
              />
            </div>

            <button
              className="send-btn"
              onClick={handlePersonalSend}
              disabled={!personalMessage.trim()}
            >
              Send to Student
            </button>

            {personalSuccess && <p className="success-msg">✅ Sent to {selectedStudent}</p>}
          </div>

          {/* CLASS-WIDE */}
          <div className="recommendation-box">
            <h2>📢 Class-wide Recommendation</h2>

            <div className="form-group">
              <label>Course</label>
              <select
                value={classCourse}
                onChange={(e) => setClassCourse(e.target.value)}
              >
                {Object.keys(courses).map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                value={classMessage}
                onChange={(e) => setClassMessage(e.target.value)}
                placeholder="Message for all students in this course..."
              />
            </div>

            <button
              className="send-btn"
              onClick={handleClassSend}
              disabled={!classMessage.trim()}
            >
              Send to All Students
            </button>

            {classSuccess && <p className="success-msg">✅ Sent to all students in {classCourse}</p>}
          </div>
        </div>
      </main>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button className="yes-button" onClick={handleLogout}>Yes</button>
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

export default SendRecommendations;
