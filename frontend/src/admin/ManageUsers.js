import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./AdminDashboard.css";
import "./ManageUsers.css";

function ManageUsers() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [selectedRole, setSelectedRole] = useState("Student");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [users, setUsers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    program: "",
    matricNo: "",
    phone: "",
    dob: "",
    address: "",
    department: "",
    intake: "",
  });

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/users/");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const filteredUsers = users.filter(
    user => user.role?.toLowerCase() === selectedRole.toLowerCase()
  );

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddForm = () => {
    setEditingUser(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      program: "",
      matricNo: "",
      phone: "",
      dob: "",
      address: "",
      department: "",
      intake: "",
    });
    setFormVisible(true);
  };

  const openEditForm = user => {
    setEditingUser(user);
    setFormData({ ...user });
    setFormVisible(true);
  };

  const handleDelete = async id => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    try {
      if (editingUser) {
        await fetch(`http://127.0.0.1:5000/api/users/${editingUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("http://127.0.0.1:5000/api/users/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, role: selectedRole }),
        });
      }
      setFormVisible(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormVisible(false);
    setEditingUser(null);
  };

  const handleLogoutYes = () => {
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
          <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/admin/manage-users" className="active">Manage Users</NavLink></li>
          <li><NavLink to="/admin/manage-programs">Manage Programs</NavLink></li>
          <li><NavLink to="/admin/profile" className="active">Profile</NavLink></li>
          <li>
            <span onClick={() => setShowLogoutModal(true)} className="nav-logout-link">Logout</span>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <h1>Manage Users</h1>
        <p>Choose a user type to view and manage:</p>

        {/* ROLE TILES */}
        <div className="user-role-tiles">
          {["Student", "Instructor", "Admin"].map(role => (
            <div
              key={role}
              className={`role-tile ${selectedRole === role ? "active" : ""}`}
              onClick={() => setSelectedRole(role)}
            >
              <h3>{role}s</h3>
              <p>{users.filter(user => user.role?.toLowerCase() === role.toLowerCase()).length} user(s)</p>
            </div>
          ))}
        </div>

        {/* Add User Button */}
        <div className="add-user-container">
          <button className="add-user-button" onClick={openAddForm}>+ Add User</button>
        </div>

        {/* Add/Edit Form */}
        {formVisible && (
          <form className="user-form" onSubmit={handleFormSubmit}>
            <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleFormChange} required />
            <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleFormChange} required />
            <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleFormChange} required />
            {selectedRole !== "Admin" && (
              <>
                <input name="program" placeholder="Program" value={formData.program || ""} onChange={handleFormChange} />
                <input name="matricNo" placeholder="Matriculation Number" value={formData.matricNo || ""} onChange={handleFormChange} />
                <input name="phone" placeholder="Phone" value={formData.phone || ""} onChange={handleFormChange} />
                <input name="dob" type="date" placeholder="Date of Birth" value={formData.dob || ""} onChange={handleFormChange} />
                <input name="address" placeholder="Address" value={formData.address || ""} onChange={handleFormChange} />
                <input name="department" placeholder="Department" value={formData.department || ""} onChange={handleFormChange} />
                <input name="intake" placeholder="Intake" value={formData.intake || ""} onChange={handleFormChange} />
              </>
            )}
            <button type="submit" className="submit-button">{editingUser ? "Update" : "Add"}</button>
            <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
          </form>
        )}

        {/* USERS TABLE */}
        <div className="user-table-wrapper">
          <h2>{selectedRole}s</h2>
          <table className="user-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                {selectedRole !== "Admin" && <th>Program</th>}
                {selectedRole !== "Admin" && <th>Matric No.</th>}
                {selectedRole !== "Admin" && <th>Phone</th>}
                {selectedRole !== "Admin" && <th>DOB</th>}
                {selectedRole !== "Admin" && <th>Address</th>}
                {selectedRole !== "Admin" && <th>Department</th>}
                {selectedRole !== "Admin" && <th>Intake</th>}
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id || user.id}>
                  <td>{user.firstName || "N/A"}</td>
                  <td>{user.lastName || "N/A"}</td>
                  <td>{user.email || "N/A"}</td>
                  {selectedRole !== "Admin" && <td>{user.program || "N/A"}</td>}
                  {selectedRole !== "Admin" && <td>{user.matricNo || "N/A"}</td>}
                  {selectedRole !== "Admin" && <td>{user.phone || "N/A"}</td>}
                  {selectedRole !== "Admin" && (
                    <td>
                      {user.dob
                        ? new Date(user.dob).toLocaleDateString("en-GB").replace(/\//g, "-")
                        : "N/A"}
                    </td>
                  )}
                  {selectedRole !== "Admin" && <td>{user.address || "N/A"}</td>}
                  {selectedRole !== "Admin" && <td>{user.department || "N/A"}</td>}
                  {selectedRole !== "Admin" && <td>{user.intake || "N/A"}</td>}
                  <td>{user.role || "N/A"}</td>
                  <td>
                    <button className="action-button update" onClick={() => openEditForm(user)}>Edit</button>
                    <button className="action-button delete" onClick={() => handleDelete(user._id || user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button className="yes-button" onClick={handleLogoutYes}>Yes</button>
              <button className="no-button" onClick={() => setShowLogoutModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        &copy; 2025 Unilytics. All rights reserved.
      </footer>
    </div>
  );
}

export default ManageUsers;
