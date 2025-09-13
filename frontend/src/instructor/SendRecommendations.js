import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./SendRecommendations.css";

const categories = ["Study Tips", "Upcoming Deadlines", "Workshops & Resources", "Well-being Tips"];

function SendRecommendations() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const [courses, setCourses] = useState({});
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [personalCategory, setPersonalCategory] = useState(categories[0]);
  const [personalSuccess, setPersonalSuccess] = useState(false);

  const [classCourse, setClassCourse] = useState("");
  const [classMessage, setClassMessage] = useState("");
  const [classCategory, setClassCategory] = useState(categories[0]);
  const [classSuccess, setClassSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  // Fetch courses and students for this instructor from your backend
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/instructor/${email}/courses`)
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        const firstCourse = Object.keys(data)[0] || "";
        setSelectedCourse(firstCourse);
        setClassCourse(firstCourse);
        setSelectedStudent(data[firstCourse]?.[0] || "");
      })
      .catch(err => console.error(err));
  }, [email]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handlePersonalSend = () => {
    if (!personalMessage.trim()) return;

    fetch("http://127.0.0.1:5000/api/instructor/personal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student: selectedStudent,
        message: personalMessage,
        instructor: email,
        category: personalCategory,
        course: selectedCourse,
      }),
    }).then(() => {
      setPersonalSuccess(true);
      setPersonalMessage("");
      setTimeout(() => setPersonalSuccess(false), 3000);
    }).catch(err => console.error(err));
  };

  const handleClassSend = () => {
    if (!classMessage.trim()) return;

    fetch("http://127.0.0.1:5000/api/instructor/class", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: classMessage,
        instructor: email,
        category: classCategory,
        course: classCourse,
      }),
    }).then(() => {
      setClassSuccess(true);
      setClassMessage("");
      setTimeout(() => setClassSuccess(false), 3000);
    }).catch(err => console.error(err));
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
          <li><NavLink to="/instructor/send-recommendations" className="active">Send Recommendations</NavLink></li>
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
                  setSelectedStudent(courses[e.target.value]?.[0] || "");
                }}
              >
                {Object.keys(courses).map(course => <option key={course} value={course}>{course}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                {(courses[selectedCourse] || []).map(student => (
                  <option key={student} value={student}>{student}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={personalCategory}
                onChange={(e) => setPersonalCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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

            <button className="send-btn" onClick={handlePersonalSend} disabled={!personalMessage.trim()}>
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
                {Object.keys(courses).map(course => <option key={course} value={course}>{course}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={classCategory}
                onChange={(e) => setClassCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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

            <button className="send-btn" onClick={handleClassSend} disabled={!classMessage.trim()}>
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
      <footer className="footer">&copy; 2025 Unilytics. All rights reserved.</footer>
    </div>
  );
}

export default SendRecommendations;
