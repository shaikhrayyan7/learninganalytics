import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./AdminDashboard.css";
import "./ManagePrograms.css";
import "./CourseManagement.css";

function CourseManagement() {
  const { programId, courseId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [course, setCourse] = useState(null);

  const [allInstructors, setAllInstructors] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [editInstructors, setEditInstructors] = useState(false);
  const [editStudents, setEditStudents] = useState(false);

  const [tempInstructors, setTempInstructors] = useState([]);
  const [tempStudents, setTempStudents] = useState([]);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeTarget, setRemoveTarget] = useState({ type: "", value: "" });

  const [newInstructor, setNewInstructor] = useState("");
  const [newStudent, setNewStudent] = useState("");

  // navbar state persisted like ProgramDetails
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  // fetch course, program, and users
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/programs/${programId}/courses`)
      .then(res => res.json())
      .then(data => {
        const foundCourse = data.flatMap(sem => sem.courses).find(c => c.id === courseId);
        if (foundCourse) {
          setCourse(foundCourse);
          setTempInstructors(foundCourse.instructors || []);
          setTempStudents(foundCourse.students || []);
        }
      })
      .catch(console.error);

    fetch(`http://127.0.0.1:5000/api/programs/${programId}`)
      .then(res => res.json())
      .then(setProgram)
      .catch(console.error);

    fetch(`http://127.0.0.1:5000/api/users`)
      .then(res => res.json())
      .then(users => {
        setAllInstructors(users.filter(u => u.role.toLowerCase() === "instructor"));
        setAllStudents(users.filter(u => u.role.toLowerCase() === "student"));
      })
      .catch(console.error);
  }, [programId, courseId]);

  const confirmRemove = () => {
    if (removeTarget.type === "instructor") {
      setTempInstructors(tempInstructors.filter(i => i !== removeTarget.value));
    } else if (removeTarget.type === "student") {
      setTempStudents(tempStudents.filter(s => s !== removeTarget.value));
    }
    setShowRemoveModal(false);
    setRemoveTarget({ type: "", value: "" });
  };

  const cancelRemove = () => {
    setShowRemoveModal(false);
    setRemoveTarget({ type: "", value: "" });
  };

  const handleAddInstructor = () => {
    if (newInstructor && !tempInstructors.includes(newInstructor)) {
      setTempInstructors([...tempInstructors, newInstructor]);
      setNewInstructor("");
    }
  };

  const handleAddStudent = () => {
    if (newStudent && !tempStudents.includes(newStudent)) {
      setTempStudents([...tempStudents, newStudent]);
      setNewStudent("");
    }
  };

  const handleSaveInstructors = async () => {
    await fetch(`http://127.0.0.1:5000/api/programs/${programId}/courses/${courseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instructors: tempInstructors }),
    });
    setCourse({ ...course, instructors: tempInstructors });
    setEditInstructors(false);
  };

  const handleSaveStudents = async () => {
    await fetch(`http://127.0.0.1:5000/api/programs/${programId}/courses/${courseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ students: tempStudents }),
    });
    setCourse({ ...course, students: tempStudents });
    setEditStudents(false);
  };

  if (!course || !program) return <p>Loading...</p>;

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
          <li><span className="nav-link" onClick={() => navigate("/admin/profile")}>Profile</span></li>
          <li><span className="nav-logout-link" onClick={() => navigate("/")}>Logout</span></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>{program.name}</h1>
        <h2>{course.title}</h2>

        {/* Instructors Section */}
        <section className="course-section">
          <h3>Instructors</h3>
          <ul>
            {tempInstructors.map((inst, i) => (
              <li key={i}>
                {inst}{" "}
                {editInstructors && (
                  <button onClick={() => { setRemoveTarget({ type: "instructor", value: inst }); setShowRemoveModal(true); }}>
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
          {!editInstructors ? (
            <button onClick={() => setEditInstructors(true)}>Edit</button>
          ) : (
            <>
              <div className="add-section">
                <select value={newInstructor} onChange={e => setNewInstructor(e.target.value)}>
                  <option value="">Select Instructor</option>
                  {allInstructors
                    .filter(u => !tempInstructors.includes(u.email))
                    .map(u => (
                      <option key={u.email} value={u.email}>{u.email}</option>
                    ))}
                </select>
                <button onClick={handleAddInstructor}>Add Instructor</button>
              </div>
              <button onClick={handleSaveInstructors}>Save Changes</button>
              <button onClick={() => setEditInstructors(false)}>Cancel</button>
            </>
          )}
        </section>

        {/* Students Section */}
        <section className="course-section">
          <h3>Students</h3>
          <ul>
            {tempStudents.map((stu, i) => (
              <li key={i}>
                {stu}{" "}
                {editStudents && (
                  <button onClick={() => { setRemoveTarget({ type: "student", value: stu }); setShowRemoveModal(true); }}>
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
          {!editStudents ? (
            <button onClick={() => setEditStudents(true)}>Edit</button>
          ) : (
            <>
              <div className="add-section">
                <select value={newStudent} onChange={e => setNewStudent(e.target.value)}>
                  <option value="">Select Student</option>
                  {allStudents
                    .filter(u => !tempStudents.includes(u.email))
                    .map(u => (
                      <option key={u.email} value={u.email}>{u.email}</option>
                    ))}
                </select>
                <button onClick={handleAddStudent}>Add Student</button>
              </div>
              <button onClick={handleSaveStudents}>Save Changes</button>
              <button onClick={() => setEditStudents(false)}>Cancel</button>
            </>
          )}
        </section>
      </main>

      {/* REMOVE CONFIRMATION MODAL */}
      {showRemoveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Removal</h3>
            <p>Are you sure you want to remove "{removeTarget.value}"?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmRemove}>Yes</button>
              <button className="cancel-btn" onClick={cancelRemove}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseManagement;
