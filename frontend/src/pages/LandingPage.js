// src/pages/LandingPage.js
import React from "react";
import "../App.css";
import logo from "../assets/unilytics_logo.png";
import studentImage from "../assets/student.jpg";

function LandingPage() {
  return (
    <div className="App">
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
        <button
          className="login-btn"
          onClick={() => (window.location.href = "/login")}
        >
          LOGIN
        </button>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h1>Empower Your Academic Journey</h1>
          <p>
            Unilytics provides secure, GDPR-compliant learning analytics for students and instructors.
            <br />
            Track progress, well-being, and engagement all in one insightful platform.
          </p>
        </div>
        <div className="hero-image">
          <img src={studentImage} alt="Student" />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Insightful Dashboards</h3>
          <p>Visualize student performance and engagement in real time.</p>
        </div>
        <div className="feature-card">
          <h3>Predictive Analytics</h3>
          <p>Identify at-risk students and intervene proactively.</p>
        </div>
        <div className="feature-card">
          <h3>Secure and Compliant</h3>
          <p>We follow strict privacy and security protocols.</p>
        </div>
      </section>

      <footer className="footer">
        &copy; 2025 Unilytics. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
