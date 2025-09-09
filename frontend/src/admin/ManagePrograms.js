import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./AdminDashboard.css";
import "./ManagePrograms.css";
import "./AdminProfile"

function ManagePrograms() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  // Fetch programs from backend
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/programs");
        const data = await res.json();
        setPrograms(data);
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };
    fetchPrograms();
  }, []);

  const filterProgramsByType = (type) =>
    programs
      .filter((p) => p.type === type)
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
          <li><span className="nav-link" onClick={() => navigate("/admin/dashboard")}>Dashboard</span></li>
          <li><span className="nav-link" onClick={() => navigate("/admin/manage-users")}>Manage Users</span></li>
          <li><span className="nav-link active" onClick={() => navigate("/admin/manage-programs")}>Manage Programs</span></li>
          <li><span className="nav-link active" onClick={() => navigate("/admin/profile")}>Profile</span></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <h1>Manage Programs</h1>
        <input
          type="text"
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="program-search"
        />

        <h2>Bachelor Programs</h2>
        <div className="program-tiles">
          {filterProgramsByType("Bachelor").map((program) => (
            <div
              className="program-tile clickable"
              key={program.id}
              onClick={() => navigate(`/admin/manage-programs/${program.id}`)}
            >
              <h3>{program.name}</h3>
            </div>
          ))}
        </div>

        <h2>Master Programs</h2>
        <div className="program-tiles">
          {filterProgramsByType("Master").map((program) => (
            <div
              className="program-tile clickable"
              key={program.id}
              onClick={() => navigate(`/admin/manage-programs/${program.id}`)}
            >
              <h3>{program.name}</h3>
            </div>
          ))}
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

      <footer className="footer">&copy; 2025 Unilytics. All rights reserved.</footer>
    </div>
  );
}

export default ManagePrograms;
