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
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "student@student-dhbw.de";
  const role = localStorage.getItem("role") || "student";
  const username = email.split("@")[0];

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  const dummyCourses = {
    math2: {
      title: "Mathematics 2",
      description: "Covers Linear Algebra and Statistics",
      tabs: {
        overview: "This course provides foundational knowledge in Linear Algebra and Statistical methods.",
        material: "Lecture slides, textbooks (e.g., Linear Algebra by Gilbert Strang), problem sets.",
        exam: "Final exam: 50%, Midterm: 30%, Quizzes: 20%",
        exercises: "Weekly problem sheets with solutions.",
        lecture: "Lectures held Mon/Wed 10:00–11:30. Recorded sessions available."
      }
    },
    cn: {
      title: "Computer Networks",
      description: "Understand OSI Model, Routing, Protocols",
      tabs: {
        overview: "Course explains the fundamentals of network layers and protocols.",
        material: "RFC docs, textbook: Computer Networking by Kurose, lab guides.",
        exam: "Project: 40%, Final: 60%",
        exercises: "Packet tracing labs, router setup tasks.",
        lecture: "Tue/Thu 13:00–14:30. Lab sessions every Friday."
      }
    }
  };

  const course = dummyCourses[courseId];

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
            <p><strong>Description:</strong> {course.description}</p>

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
            <h1>Course Not Found</h1>
            <p>The requested course does not exist or hasn't been assigned yet.</p>
          </div>
        )}
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

export default CourseContent;
