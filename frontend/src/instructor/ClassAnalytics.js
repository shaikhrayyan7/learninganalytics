import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { NavLink, useNavigate } from "react-router-dom";
import "../pages/Dashboard.css";
import "./ClassAnalytics.css";
import logo from "../assets/unilytics_logo.png";

function ClassAnalytics() {
  const [menuOpen, setMenuOpen] = useState(localStorage.getItem("menuOpen") === "true");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "drsmith@instructor-dhbw.de";
  const username = email.split("@")[0];

  useEffect(() => {
    localStorage.setItem("menuOpen", menuOpen);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const [selectedCourse, setSelectedCourse] = useState("International Project Management");

  const [attendanceWeek, setAttendanceWeek] = useState("Week 1");
  const [stressWeek, setStressWeek] = useState("Week 1");
  const [groupWeek, setGroupWeek] = useState("Week 2");
  const [riskWeek, setRiskWeek] = useState("Week 1");

  const currentWeekNumber = 2;
  const currentDayIndex = 1; // Tuesday

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

  const dailyLectureAccess = {
    "Week 1": [90, 85, 80, 75, 70],
    "Week 2": [88, 90, 82, 78, 0],
    "Week 3": [0, 0, 0, 0, 0],
    "Week 4": [0, 0, 0, 0, 0],
    "Week 5": [0, 0, 0, 0, 0],
  };

  const stressLevels = {
    "Week 1": { low: 13, medium: 12, high: 5 },
    "Week 2": { low: 3, medium: 15, high: 12 },
    "Week 3": { low: 5, medium: 10, high: 15 },
    "Week 4": { low: 0, medium: 0, high: 0 },
    "Week 5": { low: 0, medium: 0, high: 0 },
  };

  const groupProgress = {
    "Week 2": [
      { groupName: "Group 1", progress: 15 },
      { groupName: "Group 2", progress: 20 },
      { groupName: "Group 3", progress: 10 },
      { groupName: "Group 4", progress: 5 },
    ],
    "Week 3": [
      { groupName: "Group 1", progress: 50 },
      { groupName: "Group 2", progress: 60 },
      { groupName: "Group 3", progress: 45 },
      { groupName: "Group 4", progress: 55 },
    ],
    "Week 4": [
      { groupName: "Group 1", progress: 80 },
      { groupName: "Group 2", progress: 90 },
      { groupName: "Group 3", progress: 75 },
      { groupName: "Group 4", progress: 85 },
    ],
    "Week 5": [
      { groupName: "Group 1", progress: 100 },
      { groupName: "Group 2", progress: 98 },
      { groupName: "Group 3", progress: 100 },
      { groupName: "Group 4", progress: 95 },
    ],
  };

  // Attendance Handling
  let attendanceDataForWeek = dailyLectureAccess[attendanceWeek] || [0, 0, 0, 0, 0];
  if (attendanceWeek === `Week ${currentWeekNumber}`) {
    attendanceDataForWeek = attendanceDataForWeek.map((val, idx) =>
      idx <= currentDayIndex ? val : 0
    );
  } else if (parseInt(attendanceWeek.split(" ")[1]) > currentWeekNumber) {
    attendanceDataForWeek = [0, 0, 0, 0, 0];
  }

  const attendanceCategories = days.map((day, idx) => {
    if (attendanceWeek === `Week ${currentWeekNumber}` && idx > currentDayIndex)
      return `${day} (N/A)`;
    return day;
  });

  const stressData = stressLevels[stressWeek] || { low: 0, medium: 0, high: 0 };
  const totalStressStudents = stressData.low + stressData.medium + stressData.high;
  const stressPieSeries = [stressData.low, stressData.medium, stressData.high];
  const stressPieLabels = ["Low Stress", "Medium Stress", "High Stress"];
  const stressColors = ["#2ecc71", "#f1c40f", "#e74c3c"];

  const showGroupProgress = groupWeek !== "Week 1" && groupProgress[groupWeek];
  const groupProgressData = showGroupProgress ? groupProgress[groupWeek] : [];

  const riskStress = stressLevels[riskWeek];
  const riskAttendance = dailyLectureAccess[riskWeek];
  const riskProgress = groupProgress[riskWeek] || [];

  const avgAttendance = riskAttendance.reduce((a, b) => a + b, 0) / riskAttendance.length;
  const lowProgressGroups = riskProgress.filter((group) => group.progress < 30);

  const atRiskStudents = [];

  if (avgAttendance < 80) {
    atRiskStudents.push({
      name: "Multiple Students",
      lastAccessed: riskWeek,
      reason: `Low attendance (${avgAttendance.toFixed(0)}%)`,
    });
  }

  if (riskStress.medium + riskStress.high > 10) {
    atRiskStudents.push({
      name: "Multiple Students",
      lastAccessed: riskWeek,
      reason: "Low engagement (medium/high stress levels)",
    });
  }

  lowProgressGroups.forEach((group) => {
    atRiskStudents.push({
      name: group.groupName,
      lastAccessed: riskWeek,
      reason: "Did not make sufficient progress",
    });
  });

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </header>

      {/* SIDEBAR NAV */}
      <nav className={`side-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/instructor/my-teaching">My Teaching</NavLink></li>
          <li><NavLink to="/instructor/class-analytics">Class Analytics</NavLink></li>
          <li><NavLink to="/instructor/student-list">Student List</NavLink></li>
          <li><NavLink to="/instructor/recommendations">Send Recommendations</NavLink></li>
          <li><NavLink to="/instructor/survey" className="active">Create Survey</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><span className="nav-logout-link" onClick={() => setShowLogoutModal(true)}>Logout</span></li>
        </ul>
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <section className="dashboard-hero">
          <h1>📊 Class Analytics for {selectedCourse}</h1>
          <div className="course-selector">
            <label htmlFor="course">Course:</label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option>International Project Management (IPM)</option>
              <option>Current topics in Computer Science (CTCS) </option>
            </select>
          </div>
        </section>

        <div className="charts-row">
          {/* Attendance */}
          <div className="chart-box">
            <h3>Lecture Attendance - {attendanceWeek}</h3>
            <select value={attendanceWeek} onChange={(e) => setAttendanceWeek(e.target.value)}>
              {weeks.map((week) => (
                <option key={week} value={week}>{week}</option>
              ))}
            </select>
            <Chart
              type="bar"
              height={260}
              options={{
                chart: { id: "attendance-bar" },
                xaxis: { categories: attendanceCategories },
                colors: ["#007bff"],
                plotOptions: { bar: { columnWidth: "50%" } },
                tooltip: { y: { formatter: (val) => `${val}%` } },
              }}
              series={[{ name: "Attendance %", data: attendanceDataForWeek }]}
            />
          </div>

          {/* Stress */}
          <div className="chart-box">
            <h3>Stress Level - {stressWeek}</h3>
            <select value={stressWeek} onChange={(e) => setStressWeek(e.target.value)}>
              {weeks.map((week) => (
                <option key={week} value={week}>{week}</option>
              ))}
            </select>
            {totalStressStudents > 0 ? (
              <>
                <Chart
                  key={stressWeek} 
                  type="pie"
                  height={230}
                  options={{
                    labels: stressPieLabels,
                    colors: stressColors,
                    legend: { position: "bottom" },
                    tooltip: { y: { formatter: (val) => `${val} students` } },
                    dataLabels: {
                      formatter: (val, opts) => {
                        const count = stressPieSeries[opts.seriesIndex];
                        return `${val.toFixed(1)}% (${count})`;
                      },
                    },
                  }}
                  series={stressPieSeries}
                />
                <p style={{ textAlign: "center", marginTop: "0.5rem", fontWeight: "600" }}>
                  Total: {totalStressStudents} students
                </p>
              </>
            ) : (
              <p>No data available for {stressWeek}</p>
            )}
          </div>
        </div>

        {/* Group Progress */}
        <div className="chart-box">
          <h3>Group Progress - {groupWeek}</h3>
          <select value={groupWeek} onChange={(e) => setGroupWeek(e.target.value)}>
            {weeks.map((week) => (
              <option key={week} value={week}>{week}</option>
            ))}
          </select>
          {showGroupProgress ? (
            <Chart
              type="bar"
              height={250}
              options={{
                chart: { id: "group-progress-bar" },
                xaxis: {
                  min: 0,
                  max: 100,
                  categories: groupProgressData.map(g => g.groupName),
                  title: { text: "Groups" }
                },
                yaxis: {
                  min: 0,
                  max: 100,
                },
                colors: ["#17a2b8"],
                plotOptions: { bar: { horizontal: true, distributed: true } },
                tooltip: { y: { formatter: (val) => `${val}%` } },
                dataLabels: { enabled: true },
              }}
              series={[{ name: "Progress", data: groupProgressData.map(g => g.progress) }]}
            />
          ) : (
            <p>No progress data available for {groupWeek}.</p>
          )}
        </div>

        {/* At-Risk Students / Groups */}
        <div className="chart-box">
          <h3>🚨 At-Risk Students / Groups — {riskWeek}</h3>
          <select value={riskWeek} onChange={(e) => setRiskWeek(e.target.value)}>
            {weeks.map((week) => (
              <option key={week} value={week}>{week}</option>
            ))}
          </select>
          <table className="risk-table">
            <thead>
              <tr>
                <th>Student/Group</th>
                <th>Week</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.length > 0 ? (
                atRiskStudents.map((entry, idx) => (
                  <tr key={idx}>
                    <td>{entry.name}</td>
                    <td>{entry.lastAccessed}</td>
                    <td>{entry.reason}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No risks detected for {riskWeek}.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h2>Do you want to logout?</h2>
            <div className="logout-buttons">
              <button className="yes-button" onClick={handleLogout}>Yes</button>
              <button className="no-button" onClick={() => setShowLogoutModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">&copy; 2025 Unilytics. All rights reserved.</footer>
    </div>
  );
}

export default ClassAnalytics;
