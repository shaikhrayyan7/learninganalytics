import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../pages/Dashboard.css";
import "./StudentList.css";
import logo from "../assets/unilytics_logo.png";

function StudentList() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "drsmith@instructor-dhbw.de";
  const username = email.split("@")[0];

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  // Fetch instructor courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/studentlist/${email}/courses`);
        const data = await res.json();
        setCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      }
    };
    fetchCourses();
  }, [email]);

  // Fetch students for selected course
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchStudents = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/studentlist/course/${selectedCourse}/students`);
        const data = await res.json();
        setStudents(data || []);
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
      }
    };
    fetchStudents();
  }, [selectedCourse]);

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName} ${student.email} ${student.matriculation}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

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
          <li><NavLink to="/instructor/class-analytics">Class Analytics</NavLink></li>
          <li><NavLink to="/instructor/student-list">Student List</NavLink></li>
          <li><NavLink to="/instructor/recommendations">Send Recommendations</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      <main className="main-content">
        {!selectedCourse ? (
          <>
            <section className="dashboard-hero">
              <h1>Welcome, {username}</h1>
              <p>Select a module to view enrolled students</p>
            </section>

            <section className="dashboard-tiles">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="tile-card tile-clickable"
                  onClick={() => setSelectedCourse(course.id)}
                >
                  <h3>{course.title}</h3>
                </div>
              ))}
            </section>
          </>
        ) : (
          <>
            <button
              className="back-button"
              onClick={() => { setSelectedCourse(null); setSearchQuery(""); setStudents([]); }}
            >
              ⬅ Back to Module Selection
            </button>

            <h2 className="student-section-title">
              Students in {courses.find(c => c.id === selectedCourse)?.title}
            </h2>

            <input
              className="student-search-input"
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <section className="student-table-section">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Matriculation</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? filteredStudents.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.firstName}</td>
                      <td>{s.lastName}</td>
                      <td>{s.email}</td>
                      <td>{s.matriculation}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="no-students">No students found.</td></tr>
                  )}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>

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

      <footer className="footer">&copy; 2025 Unilytics. All rights reserved.</footer>
    </div>
  );
}

export default StudentList;
