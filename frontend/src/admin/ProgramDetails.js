import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./AdminDashboard.css";
import "./ManagePrograms.css";
import "./ProgramDetails.css";

function ProgramDetails() {
  const { id } = useParams(); // program ID
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [program, setProgram] = useState(null);
  const [coursesBySemester, setCoursesBySemester] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", semester: 1, creditPoints: 0, type: "core" });

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    // Fetch program info
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
        // Add "isEditing" flag for frontend editing
        const newData = data.map((sem) => ({
          ...sem,
          courses: sem.courses.map((c) => ({ ...c, isEditing: false, newInstructor: "", newStudent: "" })),
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

  const handleDeleteCourse = async (courseId) => {
    const res = await fetch(
      `http://127.0.0.1:5000/api/programs/${id}/courses/${courseId}`,
      { method: "DELETE" }
    );
    if (res.ok) fetchCourses();
  };

  const handleAddInstructor = (course, semIndex) => {
    if (!course.newInstructor) return;
    course.instructors = course.instructors ? [...course.instructors, course.newInstructor] : [course.newInstructor];
    course.newInstructor = "";
    handleSaveCourse(course, semIndex);
  };

  const handleRemoveInstructor = (course, semIndex, index) => {
    course.instructors.splice(index, 1);
    handleSaveCourse(course, semIndex);
  };

  const handleAddStudent = (course, semIndex) => {
    if (!course.newStudent) return;
    course.students = course.students ? [...course.students, course.newStudent] : [course.newStudent];
    course.newStudent = "";
    handleSaveCourse(course, semIndex);
  };

  const handleRemoveStudent = (course, semIndex, index) => {
    course.students.splice(index, 1);
    handleSaveCourse(course, semIndex);
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
          <li><span className="nav-link active" onClick={() => navigate("/admin/profile")}>Profile</span></li>
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
                        {course.specialization && <p><strong>Specialization:</strong> {course.specialization}</p>}
                        <p><strong>Credit Points:</strong> {course.creditPoints || "-"}</p>
                        <div style={{ marginTop: "0.5rem" }}>
                          <button className="save-button" onClick={() => handleEditCourse(semIndex, index)}>Edit</button>
                          <button className="delete-button" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                        </div>
                      </>
                    )}

                    {/* Instructors */}
                    <div className="instructors-list">
                      {course.instructors && course.instructors.map((inst, i) => (
                        <div className="instructor-item" key={i}>
                          <span>{inst}</span>
                          <button className="remove-instructor-btn" onClick={() => handleRemoveInstructor(course, semIndex, i)}>×</button>
                        </div>
                      ))}
                      {course.isEditing && (
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                          <input
                            type="text"
                            placeholder="Instructor Name"
                            value={course.newInstructor}
                            onChange={(e) => {
                              const updated = [...coursesBySemester];
                              updated[semIndex].courses[index].newInstructor = e.target.value;
                              setCoursesBySemester(updated);
                            }}
                          />
                          <button className="add-instructor-btn" onClick={() => handleAddInstructor(course, semIndex)}>Add</button>
                        </div>
                      )}
                    </div>

                    {/* Students */}
                    <div className="students-section">
                      <div className={`students-list-container`}>
                        <ul>
                          {course.students && course.students.map((stu, i) => (
                            <li key={i}>
                              {stu}
                              {course.isEditing && (
                                <button className="remove-student-btn" onClick={() => handleRemoveStudent(course, semIndex, i)}>×</button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {course.isEditing && (
                        <div className="students-add">
                          <input
                            type="text"
                            placeholder="Student Name"
                            value={course.newStudent}
                            onChange={(e) => {
                              const updated = [...coursesBySemester];
                              updated[semIndex].courses[index].newStudent = e.target.value;
                              setCoursesBySemester(updated);
                            }}
                          />
                          <button onClick={() => handleAddStudent(course, semIndex)}>Add Student</button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default ProgramDetails;
