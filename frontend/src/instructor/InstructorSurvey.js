import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/unilytics_logo.png";
import "./InstructorSurvey.css";

function InstructorSurvey() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState({});
  const [selectedCourse, setSelectedCourse] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [label, setLabel] = useState("");
  const [questions, setQuestions] = useState({
    engagement: [],
    wellbeing: [],
    focus: [],
    stress: []
  });

  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    localStorage.setItem("menuOpen", newState);
  };

  // Fetch courses for logged-in instructor
  useEffect(() => {
    if (!email) return;
    fetch(`http://127.0.0.1:5000/api/instructor/${email}/courses`)
      .then(res => res.json())
      .then(data => {
        setCourses(Object.keys(data));
        setStudents(data); // student emails per course
      })
      .catch(err => console.error(err));
  }, [email]);

  // Fetch 5 random questions per category
  const fetchRandomQuestions = async () => {
    const categories = ["engagement", "wellbeing", "focus", "stress"];
    let result = {};
    try {
      for (const cat of categories) {
        const res = await fetch(`http://127.0.0.1:5000/api/instructor/survey/questions?category=${cat}&count=5`);
        const data = await res.json();
        result[cat] = data;
      }
      setQuestions(result);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch survey questions.");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedCourse || !fromDate || !toDate) {
    alert("Select course and dates first!");
    return;
  }

  // Ensure students exist for the selected course
  const studentList = students[selectedCourse] || [];
  if (studentList.length === 0) {
    alert("No students found for the selected course!");
    return;
  }

  const payload = {
    course: selectedCourse,
    week: {
      from: fromDate,
      to: toDate,
      label: label || ""  // default to empty string if no label
    },
    students: studentList,
    questions
  };

  try {
    const res = await fetch("http://127.0.0.1:5000/api/instructor/survey/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (res.ok) {
      alert("Survey created and assigned successfully!");
      // Optionally, reset form
      setSelectedCourse("");
      setFromDate("");
      setToDate("");
      setLabel("");
      setQuestions({
        engagement: [],
        wellbeing: [],
        focus: [],
        stress: []
      });
    } else {
      alert(result.error || "Failed to create survey.");
    }
  } catch (err) {
    console.error(err);
    alert("Error creating survey.");
  }
};

  return (
    <div className="dashboard-page">
      <header className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <button className="hamburger" onClick={toggleMenu}>☰</button>
      </header>

      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/instructor/my-teaching">My Teaching</NavLink></li>
          <li><NavLink to="/instructor/class-analytics">Class Analytics</NavLink></li>
          <li><NavLink to="/instructor/student-list">Student List</NavLink></li>
          <li><NavLink to="/instructor/recommendations" className="active">Send Recommendations</NavLink></li>
          <li><NavLink to="/instructor/survey" className="active">Create Survey</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><span onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      <main className="main-content">
        <h1>📋 Create Weekly Survey</h1>
        <div className="form-row">
          <label>Course:</label>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
            <option value="">Select a course</option>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label>Week Label:</label>
          <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="Week label" />

          <label>From Date:</label>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />

          <label>To Date:</label>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />

          <button type="button" onClick={fetchRandomQuestions}>Fetch Questions</button>
        </div>

        {Object.keys(questions).map(cat => (
          <fieldset key={cat}>
            <legend>{cat.charAt(0).toUpperCase() + cat.slice(1)} Questions</legend>
            {questions[cat].map((q, idx) => <p key={idx}>{q.text}</p>)}
          </fieldset>
        ))}

        <button className="submit-button" onClick={handleSubmit}>Create Survey</button>
      </main>
    </div>
  );
}

export default InstructorSurvey;
