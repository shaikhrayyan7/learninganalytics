// src/pages/Profile.js
import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/unilytics_logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./Profile.css";
import blankProfile from "../assets/blank_profile.png";

function Profile() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const email = localStorage.getItem("email");
  const isInstructor = email.endsWith("@instructor-dhbw.de");
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(blankProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [backupData, setBackupData] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();

  // Password notifications & visibility
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageType, setPasswordMessageType] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/profile/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
        setBackupData(data);
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [email]);

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    localStorage.setItem("menuOpen", newState);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const triggerFileInput = () => fileInputRef.current.click();

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
        console.log("Profile updated:", data);
        setIsEditing(false);
      })
      .catch((err) => console.error("Error updating profile:", err));
  };

  const handlePasswordSave = () => {
    fetch(`http://127.0.0.1:5000/profile/${email}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPasswordMessage("Password updated successfully!");
          setPasswordMessageType("success");
          setFormData({ ...formData, currentPassword: "", newPassword: "" });
          setShowPasswordForm(false);
        } else {
          setPasswordMessage(data.error || "Error updating password");
          setPasswordMessageType("error");
        }
      })
      .catch((err) => {
        console.error("Error updating password:", err);
        setPasswordMessage("Server error. Please try again.");
        setPasswordMessageType("error");
      });
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
          {isInstructor ? (
            <>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li><NavLink to="/instructor/my-teaching">My Teaching</NavLink></li>
              <li><NavLink to="/instructor/class-analytics">Class Analytics</NavLink></li>
              <li><NavLink to="/instructor/student-list">Student List</NavLink></li>
              <li><NavLink to="/instructor/recommendations">Send Recommendations</NavLink></li>
              <li><NavLink to="/profile" className="active">Profile</NavLink></li>
              <li>
                <span onClick={() => setShowLogoutModal(true)} className="nav-logout-link">Logout</span>
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li><NavLink to="/courses">Courses</NavLink></li>
              <li><NavLink to="/grades">Grades</NavLink></li>
              <li><NavLink to="/performance">Performance &<br />Well-being</NavLink></li>
              <li><NavLink to="/recommendations">Personalized Recommendations</NavLink></li>
              <li><NavLink to="/profile" className="active">Profile</NavLink></li>
              <li><NavLink to="/privacy">Privacy & Consent</NavLink></li>
              <li>
                <span onClick={() => setShowLogoutModal(true)} className="nav-logout-link">Logout</span>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content profile-page">
        {/* Profile Info */}
        <div className="profile-container">
          <div className="profile-image-wrapper">
            <img
              src={profileImage}
              alt="Profile"
              className="profile-avatar"
              onClick={() => isEditing && triggerFileInput()}
              style={{ cursor: isEditing ? "pointer" : "default" }}
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          {isInstructor ? (
            <div className="profile-grid">
              <div className="form-group">
                <label>First Name</label>
                <input name="firstName" value={formData.firstName || ""} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" value={formData.lastName || ""} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={formData.email || ""} disabled />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input name="department" value={formData.department || ""} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="form-group">
                <label>Office</label>
                <input name="office" value={formData.office || ""} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={formData.phone || ""} onChange={handleChange} disabled={!isEditing} />
              </div>
            </div>
          ) : (
            <div className="profile-grid">
              <div className="form-group">
                <label>First Name</label>
                <input name="firstName" value={formData.firstName || ""} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" value={formData.lastName || ""} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={formData.email || ""} disabled />
              </div>
              <div className="form-group">
                <label>Matriculation Number</label>
                <input name="matriculationNumber" value={formData.matriculationNumber || ""} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="form-group">
                <label>Phone (+49)</label>
                <input name="number" value={formData.number || ""} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dob" value={formData.dob || ""} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input name="address" value={formData.address || ""} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="form-group">
                <label>Program</label>
                <input value={formData.program || ""} disabled />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input value={formData.department || ""} disabled />
              </div>
              <div className="form-group">
                <label>Intake</label>
                <input value={formData.intake || ""} disabled />
              </div>
            </div>
          )}

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

        {/* Password Change Section */}
        <div className="password-container">
          <h2>Change your password</h2>
          {!showPasswordForm ? (
            <div className="profile-actions" style={{ textAlign: "center" }}>
              <button className="edit-profile-btn" onClick={() => setShowPasswordForm(true)}>
                Update
              </button>
            </div>
          ) : (
            <>
              <div className="form-group password-field">
                <label>Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword || ""}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                  <span
                    className="toggle-eye"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? "" : ""}
                  </span>
                </div>
              </div>

              <div className="form-group password-field">
                <label>New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword || ""}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                  <span
                    className="toggle-eye"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? "" : ""}
                  </span>
                </div>
              </div>

              {passwordMessage && (
                <div className={`password-message ${passwordMessageType}`}>
                  {passwordMessage}
                </div>
              )}

              <div className="profile-actions" style={{ textAlign: "center" }}>
                <button className="update-btn" onClick={handlePasswordSave}>Save</button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setFormData({ ...formData, currentPassword: "", newPassword: "" });
                    setPasswordMessage("");
                  }}
                >
                  Cancel
                </button>
              </div>
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

export default Profile;
