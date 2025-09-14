import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../pages/Dashboard.css";
import "./MyTeaching.css";
import logo from "../assets/unilytics_logo.png";

function MyTeaching() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("email")?.toLowerCase(); // lowercase
  const username = email?.split("@")[0];

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/instructor/${email}/courses`);
        const data = await res.json();
        console.log("Fetched courses from backend:", data);

        if (!data.error) {
          // Convert object to array, ensure id exists
          const coursesArr = Object.keys(data).map(title => ({
            title,
            id: data[title]?.id || "ipm" // fallback to "ipm" for testing
          }));
          console.log("Mapped courses array:", coursesArr);
          setInstructorCourses(coursesArr);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, [email]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
          <li><NavLink to="/instructor/recommendations">Send Recommendations</NavLink></li>
          <li><NavLink to="/instructor/survey" className="active">Create Survey</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <section className="dashboard-hero">
          <h1>Welcome, {username}</h1>
          <p>Your Teaching Modules</p>
        </section>

        <section className="dashboard-tiles">
          {instructorCourses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            instructorCourses.map(course => (
              <div
                key={course.id}
                className="tile-card"
                onClick={() => navigate(`/instructor/course/${course.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h3>{course.title}</h3>
              </div>
            ))
          )}
        </section>
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

export default MyTeaching;
