import React, { useState, useEffect } from "react";
import logo from "../assets/unilytics_logo.png";
import blankProfile from "../assets/blank_profile.png";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import "./ManagePrograms.css";

function AdminProfile() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const [profileImage] = useState(blankProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [backupData, setBackupData] = useState({});

  // Redirect non-admins
  useEffect(() => {
    if (!email || role?.toLowerCase() !== "admin") {
      navigate("/"); // redirect to login
    }
  }, [email, role, navigate]);

  // Fetch admin profile
  useEffect(() => {
    if (email && role?.toLowerCase() === "admin") {
      fetch(`http://127.0.0.1:5000/profile/${email}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData(data);
          setBackupData(data);
        })
        .catch((err) => console.error("Error fetching admin profile:", err));
    }
  }, [email, role]);

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    localStorage.setItem("menuOpen", newState);
  };

  const handleChange = (e) => {
    if (isEditing) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleEdit = () => {
    setBackupData(formData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(backupData);
    setIsEditing(false);
  };

  const handleUpdate = () => {
    fetch(`http://127.0.0.1:5000/profile/${email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Admin profile updated:", data);
        setIsEditing(false);
      })
      .catch((err) => console.error("Error updating admin profile:", err));
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button className="hamburger" onClick={toggleMenu}>☰</button>
      </header>

      {/* SIDEBAR */}
      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/admin/manage-users">Manage Users</NavLink></li>
          <li><NavLink to="/admin/manage-programs">Manage Programs</NavLink></li>
          <li><NavLink to="/admin/profile" className="active">Profile</NavLink></li>
          <li>
            <span onClick={() => setShowLogoutModal(true)} className="nav-logout-link">Logout</span>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content profile-page">
        <div className="profile-container">
          <div className="profile-image-wrapper">
            <img
              src={profileImage}
              alt="Admin Avatar"
              className="profile-avatar"
            />
          </div>

          <div className="profile-grid">
            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={formData.email || ""} disabled />
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button className="edit-profile-btn" onClick={handleEdit}>Edit Profile</button>
            ) : (
              <>
                <button className="update-btn" onClick={handleUpdate}>Update</button>
                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
              </>
            )}
          </div>
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

export default AdminProfile;
