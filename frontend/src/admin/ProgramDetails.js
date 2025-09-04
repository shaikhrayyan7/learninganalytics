// src/admin/ProgramDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./AdminDashboard.css";
import "./ManagePrograms.css";
import "./ProgramDetails.css";

const allPrograms = [
  { id: 1, name: "Computer Science", code: "CS101", department: "CS", coordinator: "Dr. Smith" },
  { id: 2, name: "Business Administration", code: "BA201", department: "Business", coordinator: "Prof. Jones" },
  { id: 3, name: "Mechanical Engineering", code: "ME301", department: "Engineering", coordinator: "Dr. Miller" },
  { id: 4, name: "Architecture", code: "AR401", department: "Design", coordinator: "Dr. Lee" },
  { id: 5, name: "Psychology", code: "PSY501", department: "Humanities", coordinator: "Dr. Kim" },
  { id: 6, name: "Applied Computer Science", code: "ACS601", department: "CS", coordinator: "Sabine Helwig" },
  { id: 7, name: "Applied Data Science and Analytics", code: "DSA701", department: "CS", coordinator: "Prof. Khan" },
  { id: 8, name: "International Business and Engineering", code: "IBE801", department: "Business", coordinator: "Dr. Martinez" },
  { id: 9, name: "Water Technology", code: "WT901", department: "Science", coordinator: "Prof. Gupta" },
  { id: 10, name: "Global Business & Leadership", code: "GBL1001", department: "Business", coordinator: "Dr. Clark" },
];

function ProgramDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const program = allPrograms.find((p) => p.id.toString() === id);

  // Courses with structure: {id, name, instructors: [], students: []}
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [editingCourseId, setEditingCourseId] = useState(null);

  // Temp states for editing fields
  const [editCourseName, setEditCourseName] = useState("");
  const [editInstructorInput, setEditInstructorInput] = useState("");
  const [editStudentInput, setEditStudentInput] = useState("");

  // Expanded state to toggle student list per course
  const [expandedCourses, setExpandedCourses] = useState({});

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  if (!program) {
    return <div className="main-content"><h2>Program not found.</h2></div>;
  }

  // Add new course
  const handleAddCourse = () => {
    if (!newCourseName.trim()) return;
    const newId = Date.now();
    setCourses([
      ...courses,
      { id: newId, name: newCourseName.trim(), instructors: [], students: [] }
    ]);
    setNewCourseName("");
  };

  // Start editing a course tile
  const startEditing = (course) => {
    setEditingCourseId(course.id);
    setEditCourseName(course.name);
    setEditInstructorInput("");
    setEditStudentInput("");
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCourseId(null);
    setEditCourseName("");
    setEditInstructorInput("");
    setEditStudentInput("");
  };

  // Save edited course details
  const saveCourseDetails = () => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === editingCourseId
          ? { ...course, name: editCourseName.trim() || course.name }
          : course
      )
    );
    cancelEditing();
  };

  // Add instructor (multiple allowed)
  const addInstructor = (courseId) => {
    if (!editInstructorInput.trim()) return;
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          // Avoid duplicate instructor names (case insensitive)
          const exists = course.instructors.some(
            (inst) => inst.toLowerCase() === editInstructorInput.trim().toLowerCase()
          );
          if (exists) return course;

          return {
            ...course,
            instructors: [...course.instructors, editInstructorInput.trim()],
          };
        }
        return course;
      })
    );
    setEditInstructorInput("");
  };

  // Remove instructor by name
  const removeInstructor = (courseId, instructorName) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? {
              ...course,
              instructors: course.instructors.filter((i) => i !== instructorName),
            }
          : course
      )
    );
  };

  // Add student
  const addStudent = (courseId) => {
    if (!editStudentInput.trim()) return;
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          // Avoid duplicate student names (case insensitive)
          const exists = course.students.some(
            (stu) => stu.toLowerCase() === editStudentInput.trim().toLowerCase()
          );
          if (exists) return course;

          return {
            ...course,
            students: [...course.students, editStudentInput.trim()],
          };
        }
        return course;
      })
    );
    setEditStudentInput("");
  };

  // Remove student by name
  const removeStudent = (courseId, studentName) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? {
              ...course,
              students: course.students.filter((s) => s !== studentName),
            }
          : course
      )
    );
  };

  // Delete whole course
  const deleteCourse = (courseId) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    if (editingCourseId === courseId) cancelEditing();
  };

  // Toggle expand/collapse student list for a course
  const toggleExpand = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
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
          <li><span className="nav-link" onClick={() => navigate("/admin/dashboard")}>Dashboard</span></li>
          <li><span className="nav-link" onClick={() => navigate("/admin/manage-users")}>Manage Users</span></li>
          <li><span className="nav-link active" onClick={() => navigate("/admin/manage-programs")}>Manage Programs</span></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>{program.name}</h1>
        <p><strong>Program ID:</strong> {program.id}</p>
        <p><strong>Code:</strong> {program.code}</p>
        <p><strong>Department:</strong> {program.department}</p>
        <p><strong>Coordinator:</strong> {program.coordinator}</p>

        <hr />

        <section>
          <h2>Courses in this Program</h2>

          <div className="course-add-section">
            <input
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder="New Course Name"
              aria-label="New Course Name"
            />
            <button onClick={handleAddCourse}>Add Course</button>
          </div>

          {courses.length === 0 && <p>No courses yet.</p>}

          <div className="courses-list">
            {courses.map((course) => {
              const isEditing = editingCourseId === course.id;
              const isExpanded = expandedCourses[course.id] || false;

              return (
                <div key={course.id} className="course-card">
                  {!isEditing ? (
                    <>
                      <h3 className="course-title">{course.name}</h3>

                      <div className="instructors-display">
                        <strong>Instructors:</strong>
                        {course.instructors.length > 0 ? (
                          <ul>
                            {course.instructors.map((inst, idx) => (
                              <li key={idx}>{inst}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-data">No instructors assigned</p>
                        )}
                      </div>

                      <div className="students-display">
                        <strong>
                          Students:{" "}
                          {course.students.length > 10 && (
                            <button
                              className="expand-toggle"
                              onClick={() => toggleExpand(course.id)}
                              aria-label={`${isExpanded ? "Collapse" : "Expand"} student list`}
                            >
                              {isExpanded ? "▲" : "▼"}
                            </button>
                          )}
                        </strong>
                        {course.students.length > 0 ? (
                          <ul className={`students-list ${isExpanded ? "expanded" : "collapsed"}`}>
                            {(isExpanded ? course.students : course.students.slice(0, 10)).map((stu, idx) => (
                              <li key={idx}>{stu}</li>
                            ))}
                            {!isExpanded && course.students.length > 10 && (
                              <li className="more-count">...and {course.students.length - 10} more</li>
                            )}
                          </ul>
                        ) : (
                          <p className="no-data">No students enrolled</p>
                        )}
                      </div>

                      <div className="course-actions">
                        <button className="edit-button" onClick={() => startEditing(course)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => deleteCourse(course.id)}>
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <label htmlFor={`courseName-${course.id}`} className="input-label">
                        Course Name
                      </label>
                      <input
                        id={`courseName-${course.id}`}
                        type="text"
                        value={editCourseName}
                        onChange={(e) => setEditCourseName(e.target.value)}
                      />

                      <label className="input-label">Instructors</label>
                      <ul className="editable-list">
                        {course.instructors.map((inst) => (
                          <li key={inst} className="editable-list-item">
                            <span>{inst}</span>
                            <button
                              className="remove-button"
                              onClick={() => removeInstructor(course.id, inst)}
                              aria-label={`Delete instructor ${inst}`}
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="input-inline">
                        <input
                          type="text"
                          placeholder="Add Instructor"
                          value={editInstructorInput}
                          onChange={(e) => setEditInstructorInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addInstructor(course.id)}
                          aria-label="Add Instructor"
                        />
                        <button onClick={() => addInstructor(course.id)}>Add</button>
                      </div>

                      <label className="input-label">Students</label>
                      <ul className="editable-list">
                        {course.students.map((stu) => (
                          <li key={stu} className="editable-list-item">
                            <span>{stu}</span>
                            <button
                              className="remove-button"
                              onClick={() => removeStudent(course.id, stu)}
                              aria-label={`Delete student ${stu}`}
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="input-inline">
                        <input
                          type="text"
                          placeholder="Add Student"
                          value={editStudentInput}
                          onChange={(e) => setEditStudentInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addStudent(course.id)}
                          aria-label="Add Student"
                        />
                        <button onClick={() => addStudent(course.id)}>Add</button>
                      </div>

                      <div className="course-actions">
                        <button className="save-button" onClick={saveCourseDetails}>
                          Save
                        </button>
                        <button className="cancel-button" onClick={cancelEditing}>
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Are you sure you want to logout?</p>
            <button onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}>
              Yes
            </button>
            <button onClick={() => setShowLogoutModal(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramDetails;
