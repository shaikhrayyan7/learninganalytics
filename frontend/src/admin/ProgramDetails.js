import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./AdminDashboard.css";
import "./ManagePrograms.css";
import "./ProgramDetails.css";

function ProgramDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [program, setProgram] = useState(null);
  const [coursesBySemester, setCoursesBySemester] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", semester:"", creditPoints: "", type: "core" });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/programs`)
      .then((res) => res.json())
      .then((data) => {
        const prog = data.find((p) => p.id === id);
        if (prog) setProgram(prog);
      })
      .catch(console.error);

    fetchCourses();
  }, [id]);

  const fetchCourses = () => {
    fetch(`http://127.0.0.1:5000/api/programs/${id}/courses`)
      .then((res) => res.json())
      .then((data) => {
        const newData = data.map((sem) => ({
          ...sem,
          courses: sem.courses.map((c) => ({ ...c, isEditing: false })),
        }));
        setCoursesBySemester(newData);
      })
      .catch(console.error);
  };

  const handleAddCourse = async () => {
    if (!newCourse.title) return;
    const res = await fetch(`http://127.0.0.1:5000/api/programs/${id}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    });
    if (res.ok) {
      setNewCourse({ title: "", semester: 1, creditPoints: 0, type: "core" });
      fetchCourses();
    }
  };

  const handleEditCourse = (semIndex, courseIndex) => {
    const updated = [...coursesBySemester];
    updated[semIndex].courses[courseIndex].isEditing = true;
    setCoursesBySemester(updated);
  };

  const handleCancelEdit = (semIndex, courseIndex) => {
    const updated = [...coursesBySemester];
    updated[semIndex].courses[courseIndex].isEditing = false;
    setCoursesBySemester(updated);
  };

  const handleSaveCourse = async (course, semIndex) => {
    const res = await fetch(
      `http://127.0.0.1:5000/api/programs/${id}/courses/${course.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      }
    );
    if (res.ok) fetchCourses();
  };

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;
    const res = await fetch(
      `http://127.0.0.1:5000/api/programs/${id}/courses/${courseToDelete.id}`,
      { method: "DELETE" }
    );
    if (res.ok) fetchCourses();
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  const cancelDeleteCourse = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  if (!program) {
    return (
      <div className="main-content">
        <h2>Program not found.</h2>
      </div>
    );
  }

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
        <p><strong>Program ID:</strong> {program.id}</p>
        <p><strong>Type:</strong> {program.type || "-"}</p>
        <p><strong>Duration:</strong> {program.duration || "-"} years</p>
        <p><strong>Specializations:</strong> {program.specializations ? program.specializations.join(", ") : "-"}</p>

        <hr />

        {/* Add Course */}
        <section className="course-add-section">
          <input
            type="text"
            placeholder="Course title"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          />
          <input
            type="number"
            placeholder="Credit Points"
            value={newCourse.creditPoints}
            onChange={(e) => setNewCourse({ ...newCourse, creditPoints: parseInt(e.target.value) })}
          />
          <select
            value={newCourse.type}
            onChange={(e) => setNewCourse({ ...newCourse, type: e.target.value })}
          >
            <option value="core">Core</option>
            <option value="elective">Elective</option>
          </select>
          <input
            type="number"
            placeholder="Semester"
            value={newCourse.semester}
            min={1}
            onChange={(e) => setNewCourse({ ...newCourse, semester: parseInt(e.target.value) })}
          />
          <button onClick={handleAddCourse}>Add Course</button>
        </section>

        {/* Courses List */}
        <section>
          <h2>Courses in this Program</h2>
          {coursesBySemester.length === 0 && <p>No courses yet.</p>}

          {coursesBySemester.map((sem, semIndex) => (
            <div key={sem._id || sem.semester}>
              <h3>Semester {sem.semester}</h3>
              <div className="courses-list">
                {sem.courses.map((course, index) => (
                  <div className="course-card" key={course.id}>
                    {course.isEditing ? (
                      <>
                        <input
                          type="text"
                          value={course.title}
                          onChange={(e) => {
                            const updated = [...coursesBySemester];
                            updated[semIndex].courses[index].title = e.target.value;
                            setCoursesBySemester(updated);
                          }}
                        />
                        <input
                          type="number"
                          value={course.creditPoints}
                          onChange={(e) => {
                            const updated = [...coursesBySemester];
                            updated[semIndex].courses[index].creditPoints = parseInt(e.target.value);
                            setCoursesBySemester(updated);
                          }}
                        />
                        <select
                          value={course.type}
                          onChange={(e) => {
                            const updated = [...coursesBySemester];
                            updated[semIndex].courses[index].type = e.target.value;
                            setCoursesBySemester(updated);
                          }}
                        >
                          <option value="core">Core</option>
                          <option value="elective">Elective</option>
                        </select>
                        <div style={{ marginTop: "0.5rem" }}>
                          <button className="save-button" onClick={() => handleSaveCourse(course, semIndex)}>Save</button>
                          <button className="cancel-button" onClick={() => handleCancelEdit(semIndex, index)}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4>{course.title}</h4>
                        <p><strong>Type:</strong> {course.type || "-"}</p>
                        <p><strong>Credit Points:</strong> {course.creditPoints || "-"}</p>
                        <div style={{ marginTop: "0.5rem" }}>
                          <button className="save-button" onClick={() => handleEditCourse(semIndex, index)}>Edit</button>
                          <button className="delete-button" onClick={() => handleDeleteCourse(course)}>Delete</button>
                          <button
                            className="manage-button"
                            onClick={() => navigate(`/admin/programs/${id}/courses/${course.id}`)}
                          >
                            Manage Course
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Course</h3>
            <p>Are you sure you want to delete "{courseToDelete.title}"?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmDeleteCourse}>Yes, Delete</button>
              <button className="cancel-btn" onClick={cancelDeleteCourse}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramDetails;
