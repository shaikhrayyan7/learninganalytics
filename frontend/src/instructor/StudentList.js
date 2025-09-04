import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../pages/Dashboard.css";
import "./StudentList.css";
import logo from "../assets/unilytics_logo.png";

function StudentList() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Add search state
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

  const instructorCourses = [
    { id: "ipm", title: "International Project Management" },
    { id: "ctcs", title: "Current Topics in Computer Science" },
  ];

  const studentData = {
    ipm: [
      { name: "Alice Johnson", email: "alice@srh.de", matriculation: "100123" },
      { name: "Bob Smith", email: "bob@dhbw.de", matriculation: "100124" },
      { name: "Charlie Davis", email: "charlie@srh.de", matriculation: "100125" },
      { name: "Diana Evans", email: "diana@dhbw.de", matriculation: "100126" },
      { name: "Ethan Brown", email: "ethan@srh.de", matriculation: "100127" },
      { name: "Fiona Clark", email: "fiona@dhbw.de", matriculation: "100128" },
      { name: "George Wilson", email: "george@srh.de", matriculation: "100129" },
      { name: "Hannah Lewis", email: "hannah@dhbw.de", matriculation: "100130" },
      { name: "Ian Walker", email: "ian@srh.de", matriculation: "100131" },
      { name: "Jasmine Hall", email: "jasmine@dhbw.de", matriculation: "100132" },
      { name: "Kyle Young", email: "kyle@srh.de", matriculation: "100133" },
      { name: "Laura King", email: "laura@dhbw.de", matriculation: "100134" },
      { name: "Mark Adams", email: "mark@srh.de", matriculation: "100135" },
      { name: "Nina Perez", email: "nina@dhbw.de", matriculation: "100136" },
      { name: "Oscar Turner", email: "oscar@srh.de", matriculation: "100137" },
      { name: "Paula Scott", email: "paula@dhbw.de", matriculation: "100138" },
      { name: "Quinn Rogers", email: "quinn@srh.de", matriculation: "100139" },
      { name: "Rachel Stewart", email: "rachel@dhbw.de", matriculation: "100140" },
      { name: "Samuel Morris", email: "samuel@srh.de", matriculation: "100141" },
      { name: "Tina Foster", email: "tina@dhbw.de", matriculation: "100142" },
      { name: "Umar Jenkins", email: "umar@srh.de", matriculation: "100143" },
      { name: "Violet Kelly", email: "violet@dhbw.de", matriculation: "100144" },
      { name: "William Brooks", email: "william@srh.de", matriculation: "100145" },
      { name: "Xena Gray", email: "xena@dhbw.de", matriculation: "100146" },
      { name: "Yusuf Price", email: "yusuf@srh.de", matriculation: "100147" },
      { name: "Zoe Sanders", email: "zoe@dhbw.de", matriculation: "100148" },
      { name: "Aiden Reed", email: "aiden@srh.de", matriculation: "100149" },
      { name: "Bella Howard", email: "bella@dhbw.de", matriculation: "100150" },
      { name: "Caleb Ward", email: "caleb@srh.de", matriculation: "100151" },
      { name: "Daisy Hughes", email: "daisy@dhbw.de", matriculation: "100152" }
    ],
    ctcs: [
      { name: "Elliot Barnes", email: "elliot@srh.de", matriculation: "100153" },
      { name: "Faith Mitchell", email: "faith@dhbw.de", matriculation: "100154" },
      { name: "Gavin Ross", email: "gavin@srh.de", matriculation: "100155" },
      { name: "Hailey Chapman", email: "hailey@dhbw.de", matriculation: "100156" },
      { name: "Isaac Lane", email: "isaac@srh.de", matriculation: "100157" },
      { name: "Jade Weber", email: "jade@dhbw.de", matriculation: "100158" },
      { name: "Kieran Black", email: "kieran@srh.de", matriculation: "100159" },
      { name: "Lena Ford", email: "lena@dhbw.de", matriculation: "100160" },
      { name: "Miles Bennett", email: "miles@srh.de", matriculation: "100161" },
      { name: "Nora Greene", email: "nora@dhbw.de", matriculation: "100162" },
      { name: "Owen Richards", email: "owen@srh.de", matriculation: "100163" },
      { name: "Piper Simmons", email: "piper@dhbw.de", matriculation: "100164" },
      { name: "Riley Fisher", email: "riley@srh.de", matriculation: "100165" },
      { name: "Sienna Palmer", email: "sienna@dhbw.de", matriculation: "100166" },
      { name: "Theo Douglas", email: "theo@srh.de", matriculation: "100167" },
      { name: "Uma Wallace", email: "uma@dhbw.de", matriculation: "100168" },
      { name: "Victor Hayes", email: "victor@srh.de", matriculation: "100169" },
      { name: "Willow Spencer", email: "willow@dhbw.de", matriculation: "100170" },
      { name: "Xander Boyd", email: "xander@srh.de", matriculation: "100171" },
      { name: "Yara Chambers", email: "yara@dhbw.de", matriculation: "100172" },
      { name: "Zachary Ellis", email: "zachary@srh.de", matriculation: "100173" },
      { name: "Amelia Nichols", email: "amelia@dhbw.de", matriculation: "100174" },
      { name: "Brayden Parks", email: "brayden@srh.de", matriculation: "100175" },
      { name: "Clara Lawson", email: "clara@dhbw.de", matriculation: "100176" },
      { name: "Declan Shaw", email: "declan@srh.de", matriculation: "100177" },
      { name: "Eva Barrett", email: "eva@dhbw.de", matriculation: "100178" },
      { name: "Felix Hammond", email: "felix@srh.de", matriculation: "100179" },
      { name: "Gianna Newton", email: "gianna@dhbw.de", matriculation: "100180" },
      { name: "Henry Blake", email: "henry@srh.de", matriculation: "100181" },
      { name: "Isla Monroe", email: "isla@dhbw.de", matriculation: "100182" }
    ] 
  };

  // 🔍 Filtered student list
  const filteredStudents = selectedCourse
    ? studentData[selectedCourse].filter((student) =>
        `${student.name} ${student.email} ${student.matriculation}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

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
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      {/* MAIN */}
      <main className="main-content">
        {!selectedCourse ? (
          <>
            <section className="dashboard-hero">
              <h1>Welcome, {username}</h1>
              <p>Select a module to view enrolled students</p>
            </section>

            <section className="dashboard-tiles">
              {instructorCourses.map((course) => (
                <div
                  className="tile-card"
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  style={{ cursor: "pointer" }}
                >
                  <h3>{course.title}</h3>
                </div>
              ))}
            </section>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setSelectedCourse(null);
                setSearchQuery("");
              }}
              style={{
                marginBottom: "1rem",
                backgroundColor: "#b30000",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              ⬅ Back to Module Selection
            </button>

            <h2 style={{ color: "#b30000", marginBottom: "1rem" }}>
              Students in {instructorCourses.find(c => c.id === selectedCourse)?.title}
            </h2>

            {/* 🔍 Search bar */}
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "0.5rem",
                width: "100%",
                maxWidth: "400px",
                marginBottom: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            <table className="student-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Matriculation No.</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={index}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.matriculation}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
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

export default StudentList;
