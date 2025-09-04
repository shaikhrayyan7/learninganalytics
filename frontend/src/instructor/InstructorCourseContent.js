import React, { useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import "../pages/Dashboard.css";
import "./InstructorCourseContent.css";
import logo from "../assets/unilytics_logo.png";

const dummyCourses = {
  ds: {
    title: "Data Science",
    description: "Learn data analysis, visualization, and machine learning",
    tabs: {
      overview: "This course covers fundamental concepts in Data Science.",
      material: "Lecture notes, Jupyter notebooks, datasets.",
      exam: "Midterm (40%), Final exam (60%)",
      exercises: "Weekly assignments and projects.",
      lecture: "Lectures on Mon/Wed/Fri 9:00-10:30"
    }
  },
  ai: {
    title: "Artificial Intelligence",
    description: "Introduction to AI, machine learning, and neural networks.",
    tabs: {
      overview: "Basics of AI including search algorithms and knowledge representation.",
      material: "Textbooks, research papers, code examples.",
      exam: "Final exam and project presentation.",
      exercises: "Practical coding tasks and quizzes.",
      lecture: "Tue/Thu 14:00-15:30"
    }
  }
};

function InstructorCourseContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  // Store course data in state to allow edits
  const [courseData, setCourseData] = useState(dummyCourses[courseId]);

  // If courseId invalid
  if (!courseData) {
    return (
      <div className="dashboard-page">
        <header className="navbar">
          <img src={logo} alt="Unilytics Logo" className="logo" />
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </header>
        <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
          <ul>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/instructor/my-teaching">My Teaching</NavLink></li>
            <li><NavLink to="/profile">Profile</NavLink></li>
            <li><NavLink to="/privacy">Privacy & Consent</NavLink></li>
            <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
          </ul>
        </nav>
        <main className="main-content">
          <h1>Course Not Found</h1>
          <p>The requested course does not exist or hasn't been assigned yet.</p>
        </main>
      </div>
    );
  }

  const tabLabels = {
    overview: "Overview",
    material: "Study Material",
    exam: "Examination",
    exercises: "Exercises",
    lecture: "Lecture"
  };

  const handleEditClick = () => {
    setEditedContent(courseData.tabs[activeTab]);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setCourseData(prev => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [activeTab]: editedContent
      }
    }));
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button className="hamburger" onClick={() => {
          setMenuOpen(!menuOpen);
          localStorage.setItem("menuOpen", !menuOpen);
        }}>☰</button>
      </header>

      {/* SIDEBAR */}
      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/instructor/my-teaching">My Teaching</NavLink></li>
          <li><NavLink to="instructor/class-analytics">Class Analytics</NavLink></li>
          <li><NavLink to="/instructor/student-list">Student List</NavLink></li>
          <li><NavLink to="/instructor/send-recommendations">Send Recommendations</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <h1>{courseData.title}</h1>
        <p><strong>Description:</strong> {courseData.description}</p>

        {/* TABS */}
        <div className="course-tabs">
          {Object.keys(tabLabels).map(key => (
            <button
              key={key}
              className={`tab-button ${activeTab === key ? "active" : ""}`}
              onClick={() => {
                setActiveTab(key);
                setIsEditing(false);
              }}
            >
              {tabLabels[key]}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="tab-content">
          {!isEditing && <p>{courseData.tabs[activeTab]}</p>}

          {isEditing && (
            <textarea
              className="edit-textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={8}
            />
          )}

          {!isEditing ? (
            <button className="edit-button" onClick={handleEditClick}>
              Edit this section
            </button>
          ) : (
            <>
              <button className="edit-button save" onClick={handleSaveClick}> Save</button>
              <button className="edit-button cancel" onClick={handleCancelClick}> Cancel</button>
            </>
          )}
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

export default InstructorCourseContent;
