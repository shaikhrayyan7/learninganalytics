// src/pages/CourseContent.js
import React, { useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./Courses.css";
import logo from "../assets/unilytics_logo.png";

function CourseContent() {
  const { courseId } = useParams();
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "student@student-dhbw.de";
  const role = localStorage.getItem("role") || "student";
  const username = email.split("@")[0];

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/courses/${courseId}`);
        const data = await res.json();
        if (!data.error) {
          // add some default tab contents for now
          setCourse({
            ...data,
            tabs: {
              overview: data.description || "No overview available yet.",
              material: "Study material will be uploaded here.",
              exam: "Examination details will be announced.",
              exercises: "Exercises will be provided.",
              lecture: "Lecture schedule will be shared."
            }
          });
        }
      } catch (err) {
        console.error("Error fetching course details:", err);
      }
    };
    fetchCourseDetails();
  }, [courseId]);

  const renderTabContent = () => {
    if (!course) return null;
    const content = course.tabs[activeTab];
    return (
      <div className="tab-content">
        <p>{content}</p>
        {role === "instructor" && (
          <button className="edit-button">✏️ Edit this section</button>
        )}
      </div>
    );
  };

  const tabLabels = {
    overview: "Overview",
    material: "Study Material",
    exam: "Examination",
    exercises: "Exercises",
    lecture: "Lecture"
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
          {role === "student" && (
            <>
              <li><NavLink to="/grades">Grades</NavLink></li>
              <li><NavLink to="/performance">Performance &<br /> Well-being</NavLink></li>
              <li><NavLink to="/recommendations">Personalized Recommendations</NavLink></li>
            </>
          )}
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><NavLink to="/privacy">Privacy & Consent</NavLink></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {course ? (
          <>
            <h1>{course.title}</h1>
            <p><strong>Credits:</strong> {course.creditPoints}</p>
            {course.specialization && <p><strong>Specialization:</strong> {course.specialization}</p>}

            {/* TABS */}
            <div className="course-tabs">
              {Object.keys(tabLabels).map((key) => (
                <button
                  key={key}
                  className={`tab-button ${activeTab === key ? "active" : ""}`}
                  onClick={() => setActiveTab(key)}
                >
                  {tabLabels[key]}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            {renderTabContent()}
          </>
        ) : (
          <div className="course-details">
            <h1>Loading...</h1>
            <p>Fetching course details, please wait.</p>
          </div>
        )}
      </main>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button className="yes-button" onClick={() => {
                localStorage.clear();
                navigate("/");
              }}>Yes</button>
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

export default CourseContent;
