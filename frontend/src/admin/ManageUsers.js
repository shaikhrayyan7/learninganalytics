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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    program: "",
    matriculationNumber: "",
    number: "",
    dob: "",
    address: "",
    department: "",
    intake: "",
    office: "",
  });

  // Persist menu state
  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  // Fetch users and programs
  useEffect(() => {
    fetchUsers();
    fetchPrograms();
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

  const fetchPrograms = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/programs");
      const data = await res.json();
      setPrograms(data.map(p => p.name));
    } catch (err) {
      console.error("Error fetching programs:", err);
    }
  };

  const filteredUsers = users.filter(
    user => user.role?.toLowerCase() === selectedRole.toLowerCase()
  );

  const handleFormChange = e => {
    const { name, value } = e.target;
    if (name === "dob") {
      const [year] = value.split("-");
      if (year.length > 4) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddForm = () => {
    setEditingUser(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      program: "",
      matriculationNumber: "",
      number: "",
      dob: "",
      address: "",
      department: "",
      intake: "",
      office: "",
      password: "",
    });
    setFormVisible(true);
  };

  const openEditForm = user => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      program: user.program,
      matriculationNumber: user.matriculationNumber,
      number: user.number,
      dob: user.dob,
      address: user.address,
      department: user.department,
      intake: user.intake,
      office: user.office,
    });
    setFormVisible(true);
  };

  const handleDelete = user => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/users/${userToDelete._id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    try {
      const payload = { ...formData, role: selectedRole };
      if (editingUser) {
        await fetch(`http://127.0.0.1:5000/api/users/${editingUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://127.0.0.1:5000/api/users/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </header>

      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/admin/manage-users" className="active">Manage Users</NavLink></li>
          <li><NavLink to="/admin/manage-programs">Manage Programs</NavLink></li>
          <li><NavLink to="/admin/profile">Profile</NavLink></li>
          <li>
            <span onClick={() => setShowLogoutModal(true)} className="nav-logout-link">Logout</span>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <h1>Manage Users</h1>
        <p>Choose a user type to view and manage:</p>

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

        <div className="add-user-container">
          <button className="add-user-button" onClick={openAddForm}>+ Add User</button>
        </div>

        {formVisible && (
          <form className="user-form" onSubmit={handleFormSubmit}>
            <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleFormChange} required />
            <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleFormChange} required />
            <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleFormChange} required />

            {selectedRole === "Student" && (
              <>
                <select name="program" value={formData.program} onChange={handleFormChange} required className="user-form-input">
                  <option value="">Select Program</option>
                  {programs.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input name="matriculationNumber" placeholder="Matriculation Number" value={formData.matriculationNumber} onChange={handleFormChange} required />
                <input name="number" placeholder="Phone" value={formData.number} onChange={handleFormChange} />
                <input name="dob" type="date" placeholder="Date of Birth" value={formData.dob} onChange={handleFormChange} />
                <input name="address" placeholder="Address" value={formData.address} onChange={handleFormChange} />
                <input name="department" placeholder="Department" value={formData.department} onChange={handleFormChange} />
                <input name="intake" placeholder="Intake" value={formData.intake} onChange={handleFormChange} />
              </>
            )}

            {!editingUser && (
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={formData.password || ""}
                onChange={handleFormChange}
                required
                className="user-form-input"
              />
            )}

            {selectedRole === "Instructor" && (
              <>
                <input name="department" placeholder="Department" value={formData.department} onChange={handleFormChange} />
                <input name="office" placeholder="Office" value={formData.office} onChange={handleFormChange} />
                <input name="number" placeholder="Phone" value={formData.number} onChange={handleFormChange} />
              </>
            )}

            {selectedRole === "Admin" && null}

            <button type="submit" className="submit-button">{editingUser ? "Update" : "Add"}</button>
            <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
          </form>
        )}

        <div className="user-table-wrapper">
        <h2>{selectedRole}s</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>

              {selectedRole === "Student" && <th>Program</th>}
              {selectedRole === "Student" && <th>Matriculation Number</th>}
              {selectedRole === "Student" && <th>Phone</th>}
              {selectedRole === "Student" && <th>DOB</th>}
              {selectedRole === "Student" && <th>Address</th>}
              {selectedRole === "Student" && <th>Department</th>}
              {selectedRole === "Student" && <th>Intake</th>}

              {selectedRole === "Instructor" && <th>Department</th>}
              {selectedRole === "Instructor" && <th>Office</th>}
              {selectedRole === "Instructor" && <th>Phone</th>}

              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.firstName || "N/A"}</td>
                <td>{user.lastName || "N/A"}</td>
                <td>{user.email || "N/A"}</td>

                {selectedRole === "Student" && <td>{user.program || "N/A"}</td>}
                {selectedRole === "Student" && <td>{user.matriculationNumber || "N/A"}</td>}
                {selectedRole === "Student" && <td>{user.number || "N/A"}</td>}
                {selectedRole === "Student" && <td>{user.dob || "N/A"}</td>}
                {selectedRole === "Student" && <td>{user.address || "N/A"}</td>}
                {selectedRole === "Student" && <td>{user.department || "N/A"}</td>}
                {selectedRole === "Student" && <td>{user.intake || "N/A"}</td>}

                {selectedRole === "Instructor" && <td>{user.department || "N/A"}</td>}
                {selectedRole === "Instructor" && <td>{user.office || "N/A"}</td>}
                {selectedRole === "Instructor" && <td>{user.number || "N/A"}</td>}

                <td>{user.role || "N/A"}</td>
                <td>
                  <button className="action-button update" onClick={() => openEditForm(user)}>Edit</button>
                  <button className="action-button delete" onClick={() => handleDelete(user)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </main>

      {showDeleteModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Are you sure you want to delete {userToDelete.firstName} {userToDelete.lastName}?</h2>
            <div className="logout-buttons">
              <button className="yes-button" onClick={confirmDelete}>Yes</button>
              <button className="no-button" onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}

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
