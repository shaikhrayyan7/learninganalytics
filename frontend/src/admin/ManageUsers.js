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

  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@uni.edu",
      role: "Student",
      program: "IPM",
      matricNo: "S12345",
      phone: "+49 123456789",
      dob: "2000-01-01",
      address: "123 Main St",
      department: "CS & Engineering",
      intake: "Winter 2025",
    },
    {
      id: 2,
      firstName: "Bob",
      lastName: "Smith",
      email: "bob@uni.edu",
      role: "Instructor",
      program: "CTCS",
      matricNo: "I78901",
      phone: "+49 987654321",
      dob: "",
      address: "",
      department: "CS & Engineering",
      intake: "",
    },
    {
      id: 3,
      firstName: "Claire",
      lastName: "Lee",
      email: "claire@uni.edu",
      role: "Student",
      program: "AI Fundamentals",
      matricNo: "S54321",
      phone: "+49 111222333",
      dob: "1999-05-15",
      address: "456 Elm St",
      department: "CS & Engineering",
      intake: "Summer 2024",
    },
    {
      id: 4,
      firstName: "Derek",
      lastName: "Ray",
      email: "derek@uni.edu",
      role: "Admin",
      program: "-",
      matricNo: "A00001",
      phone: "",
      dob: "",
      address: "",
      department: "",
      intake: "",
    },
  ]);

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

  const filteredUsers = users.filter(user => user.role === selectedRole);

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

  const handleDelete = id => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    if (editingUser) {
      setUsers(prev =>
        prev.map(u => (u.id === editingUser.id ? { ...editingUser, ...formData } : u))
      );
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
        role: selectedRole,
      };
      setUsers(prev => [...prev, newUser]);
    }
    setFormVisible(false);
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
              <p>{users.filter(user => user.role === role).length} user(s)</p>
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
                <input name="program" placeholder="Program" value={formData.program} onChange={handleFormChange} required />
                <input name="matricNo" placeholder="Matriculation Number" value={formData.matricNo} onChange={handleFormChange} required />
                <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleFormChange} />
                <input name="dob" type="date" placeholder="Date of Birth" value={formData.dob} onChange={handleFormChange} />
                <input name="address" placeholder="Address" value={formData.address} onChange={handleFormChange} />
                <input name="department" placeholder="Department" value={formData.department} onChange={handleFormChange} />
                <input name="intake" placeholder="Intake" value={formData.intake} onChange={handleFormChange} />
              </>
            )}
            <button type="submit" className="submit-button">{editingUser ? "Update" : "Add"}</button>
            <button type="button" onClick={() => setFormVisible(false)} className="cancel-button">Cancel</button>
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
                <tr key={user.id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  {selectedRole !== "Admin" && <td>{user.program}</td>}
                  {selectedRole !== "Admin" && <td>{user.matricNo}</td>}
                  {selectedRole !== "Admin" && <td>{user.phone}</td>}
                  {selectedRole !== "Admin" && (<td>{user.dob ? new Date(user.dob).toLocaleDateString("en-GB").replace(/\//g, "-") : ""}</td>)}
                  {selectedRole !== "Admin" && <td>{user.address}</td>}
                  {selectedRole !== "Admin" && <td>{user.department}</td>}
                  {selectedRole !== "Admin" && <td>{user.intake}</td>}
                  <td>{user.role}</td>
                  <td>
                    <button className="action-button update" onClick={() => openEditForm(user)}>Update</button>
                    <button className="action-button delete" onClick={() => handleDelete(user.id)}>Delete</button>
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
