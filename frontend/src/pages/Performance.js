// src/pages/Performance.js
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import logo from "../assets/unilytics_logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./Performance.css";

function Performance() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [grades, setGrades] = useState([]);
  const [analytics, setAnalytics] = useState({ weeks: [], engagement: [], focus: [], stress: [], wellbeing: [] });
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [selectedEngagementWeek, setSelectedEngagementWeek] = useState("All Weeks");
  const [selectedFocusWeek, setSelectedFocusWeek] = useState("All Weeks");
  const [selectedStressWeek, setSelectedStressWeek] = useState("All Weeks");
  const [selectedWellbeingWeek, setSelectedWellbeingWeek] = useState("All Weeks");

  const navigate = useNavigate();
  const email = localStorage.getItem("email") || "student@student-dhbw.de";
  const username = email.split("@")[0];

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    localStorage.setItem("menuOpen", newState);
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/student/${email}/grades`)
      .then(res => res.json())
      .then(data => setGrades(data))
      .catch(err => console.error(err));
  }, [email]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/student/performance/analytics/${email}`)
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error(err));
  }, [email]);

  const semesters = Array.from(new Set(grades.map(g => g.semester))).sort((a, b) => a - b);
  const semesterOptions = ["All Semesters", ...semesters.map(s => `Semester ${s}`)];
  const filteredGrades = grades.filter(g =>
    selectedSemester === "All Semesters" ? true : g.semester === parseInt(selectedSemester.split(" ")[1])
  );

  const weekRanges = ["All Weeks"];
  for (let i = 0; i < analytics.weeks.length; i += 5) {
    const start = analytics.weeks[i];
    const end = analytics.weeks[Math.min(i + 4, analytics.weeks.length - 1)];
    weekRanges.push(start === end ? start : `${start} - ${end}`);
  }

  const filterByWeek = (metric, selectedWeek) => {
    if (!metric || metric.length === 0) return [0];
    if (selectedWeek === "All Weeks") return metric;
    if (!selectedWeek.includes("-")) {
      const idx = analytics.weeks.indexOf(selectedWeek);
      return idx !== -1 ? [metric[idx]] : [0];
    }
    const [start, end] = selectedWeek.split(" - ");
    const startIndex = analytics.weeks.indexOf(start);
    const endIndex = analytics.weeks.indexOf(end) + 1;
    return metric.slice(startIndex, endIndex);
  };

  const filteredEngagement = filterByWeek(analytics.engagement, selectedEngagementWeek);
  const filteredFocus = filterByWeek(analytics.focus, selectedFocusWeek);
  const filteredStress = filterByWeek(analytics.stress, selectedStressWeek);

  const filteredWeeksEngagement = filterByWeek(analytics.weeks, selectedEngagementWeek);
  const filteredWeeksFocus = filterByWeek(analytics.weeks, selectedFocusWeek);
  const filteredWeeksStress = filterByWeek(analytics.weeks, selectedStressWeek);

  const gradesChart = {
    series: [{ name: "Grade", data: filteredGrades.map(g => (g.grade != null ? 4 - g.grade + 1 : 0)) }],
    options: {
      chart: { type: "bar", height: 350 },
      xaxis: { categories: filteredGrades.map(g => g.title) },
      yaxis: { min: 1, max: 4, tickAmount: 7, labels: { formatter: val => (val === 0 ? "N/A" : (4 - val + 1).toFixed(1)) } },
      plotOptions: { bar: { horizontal: false, dataLabels: { position: "top" } } },
      dataLabels: { enabled: true, formatter: val => (val === 0 ? "N/A" : (4 - val + 1).toFixed(1)), offsetY: -10 },
      tooltip: { shared: true, intersect: false, y: { formatter: val => (val === 0 ? "N/A" : (4 - val + 1).toFixed(1)) } },
      title: { text: "Course Grades", align: "left" }
    }
  };

  const engagementData = {
    series: [{ name: "Engagement", data: filteredEngagement }],
    options: {
      chart: { type: "area", height: 300 },
      xaxis: { categories: filteredWeeksEngagement },
      stroke: { curve: "smooth" },
      yaxis: { min: 0, max: 100 },
      title: { text: "Weekly Engagement", align: "left" }
    }
  };

  const focusStressData = {
    series: [
      { name: "Focus Level", data: filteredFocus },
      { name: "Stress Level", data: filteredStress }
    ],
    options: {
      chart: { id: "focus-stress-line", toolbar: { show: false }, height: 300 },
      xaxis: { categories: filteredWeeksFocus },
      stroke: { curve: "smooth" },
      yaxis: { min: 0, max: 100 },
      title: { text: "Focus & Stress Levels", align: "left" }
    }
  };

  const filteredWellbeing = (() => {
    if (!analytics.wellbeing || analytics.wellbeing.length === 0) return 0;
    if (selectedWellbeingWeek === "All Weeks") {
      return analytics.wellbeing; // array for mapping
    }
    const weekIndex = analytics.weeks.indexOf(selectedWellbeingWeek);
    return weekIndex !== -1 ? analytics.wellbeing[weekIndex] : 0;
  })();

  const getWellbeingColor = (value) => {
    if (value <= 25) return "#FF4C4C";
    if (value <= 50) return "#FFCE56";
    if (value <= 75) return "#36A2EB";
    return "#4CAF50";
  };

  return (
    <div className="dashboard-page">
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button className="hamburger" onClick={toggleMenu}>☰</button>
      </header>

      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/courses">Courses</NavLink></li>
          <li><NavLink to="/grades">Grades</NavLink></li>
          <li><NavLink to="/survey">My Surveys</NavLink></li>
          <li><NavLink to="/performance" className="active">Performance & Well-being</NavLink></li>
          <li><NavLink to="/recommendations">Personalized Recommendations</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><NavLink to="/privacy">Privacy & Consent</NavLink></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      <main className="main-content performance-page">
        <section className="dashboard-hero">
          <h1>Welcome, {username}</h1>
          <h1>Performance and Well-being Overview</h1>
        </section>

        <div className="performance-panels">
          {/* Grades */}
          <div className="panel">
            <h3>Course Grades</h3>
            <label>Semester: </label>
            <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
              {semesterOptions.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
            </select>
            <Chart options={gradesChart.options} series={gradesChart.series} type="bar" height={350} />
          </div>

          {/* Engagement */}
          <div className="panel">
            <h3>Weekly Engagement</h3>
            <label>Week Range: </label>
            <select value={selectedEngagementWeek} onChange={e => setSelectedEngagementWeek(e.target.value)}>
              {weekRanges.map((w, idx) => <option key={idx} value={w}>{w}</option>)}
            </select>
            <Chart options={engagementData.options} series={engagementData.series} type="area" height={300} />
          </div>

          {/* Focus & Stress */}
          <div className="panel">
            <h3>Focus & Stress Levels</h3>
            <label>Week Range: </label>
            <select value={selectedFocusWeek} onChange={e => setSelectedFocusWeek(e.target.value)}>
              {weekRanges.map((w, idx) => <option key={idx} value={w}>{w}</option>)}
            </select>
            <Chart options={focusStressData.options} series={focusStressData.series} type="line" height={300} />
          </div>

          {/* Well-being */}
          <div className="panel">
            <h3>Well-being</h3>
            <label>Week: </label>
            <select value={selectedWellbeingWeek} onChange={e => setSelectedWellbeingWeek(e.target.value)}>
              {["All Weeks", ...analytics.weeks].map((w, idx) => <option key={idx} value={w}>{w}</option>)}
            </select>
            <div className="circular-container">
              {Array.isArray(filteredWellbeing)
                ? filteredWellbeing.map((val, idx) => (
                    <div key={idx} className="circular-item">
                      <CircularProgressbar
                        value={val}
                        text={`${val}%`}
                        strokeWidth={8}
                        styles={buildStyles({
                          pathColor: getWellbeingColor(val),
                          textColor: "#000",
                          trailColor: "#eee",
                          textSize: "14px"
                        })}
                      />
                      <div className="week-label">{analytics.weeks[idx]}</div>
                    </div>
                  ))
                : (
                    <div className="circular-item">
                      <CircularProgressbar
                        value={filteredWellbeing}
                        text={`${filteredWellbeing}%`}
                        strokeWidth={10}
                        styles={buildStyles({
                          pathColor: getWellbeingColor(filteredWellbeing),
                          textColor: "#000",
                          trailColor: "#eee",
                          textSize: "16px"
                        })}
                      />
                      <div className="week-label">
                        {selectedWellbeingWeek !== "All Weeks" ? selectedWellbeingWeek : ""}
                      </div>
                    </div>
                  )
              }
            </div>
          </div>
        </div>
      </main>

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button onClick={() => { localStorage.clear(); navigate("/"); }}>Yes</button>
              <button onClick={() => setShowLogoutModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">&copy; 2025 Unilytics. All rights reserved.</footer>
    </div>
  );
}

export default Performance;
