import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "../pages/Dashboard.css";
import "./InstructorCourseContent.css";
import logo from "../assets/unilytics_logo.png";

function InstructorCourseContent() {
  const { courseId } = useParams();
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const navigate = useNavigate();

  const tabLabels = {
    overview: "Overview",
    material: "Study Material",
    exam: "Examination",
    exercises: "Exercises",
    lecture: "Lecture"
  };

  // Save menu state
  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  // Fetch course data from backend
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/courses/${courseId}`);
        const data = await res.json();

        if (!data.error) {
          // Use "tabs" field from DB if present, else leave blank
          const tabsFromDB = data.tabs || {};
          setCourseData({ ...data, tabs: tabsFromDB });
        } else {
          setCourseData(null);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setCourseData(null);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Edit handlers
  const handleEditClick = () => {
    setEditedContent(courseData.tabs[activeTab] || "");
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await fetch(`http://127.0.0.1:5000/api/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tab: activeTab, content: editedContent })
      });

      setCourseData(prev => ({
        ...prev,
        tabs: { ...prev.tabs, [activeTab]: editedContent }
      }));

      setIsEditing(false);
    } catch (err) {
      console.error("Error saving content:", err);
    }
  };

  const handleCancelClick = () => setIsEditing(false);

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

  return (
    <div className="dashboard-page">
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button
          className="hamburger"
          onClick={() => { setMenuOpen(!menuOpen); localStorage.setItem("menuOpen", !menuOpen); }}
        >
          ☰
        </button>
      </header>

      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/instructor/my-teaching">My Teaching</NavLink></li>
          <li><NavLink to="/instructor/class-analytics">Class Analytics</NavLink></li>
          <li><NavLink to="/instructor/student-list">Student List</NavLink></li>
          <li><NavLink to="/instructor/recommendations">Send Recommendations</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      <main className="main-content">
        <h1>{courseData.title}</h1>

        <div className="course-tabs">
          {Object.keys(tabLabels).map(key => (
            <button
              key={key}
              className={`tab-button ${activeTab === key ? "active" : ""}`}
              onClick={() => { setActiveTab(key); setIsEditing(false); }}
            >
              {tabLabels[key]}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {!isEditing && <p>{courseData.tabs[activeTab] || ""}</p>}

          {isEditing && (
            <textarea
              className="edit-textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={8}
            />
          )}

          {!isEditing ? (
            <button className="edit-button" onClick={handleEditClick}>Edit this section</button>
          ) : (
            <>
              <button className="edit-button save" onClick={handleSaveClick}>Save</button>
              <button className="edit-button cancel" onClick={handleCancelClick}>Cancel</button>
            </>
          )}
        </div>
      </main>

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button className="yes-button" onClick={() => { localStorage.clear(); navigate("/"); }}>Yes</button>
              <button className="no-button" onClick={() => setShowLogoutModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">&copy; 2025 Unilytics. All rights reserved.</footer>
    </div>
  );
}

export default InstructorCourseContent;
