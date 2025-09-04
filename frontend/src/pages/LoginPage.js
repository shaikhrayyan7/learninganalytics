// src/pages/LoginPage.js
import React, { useState } from "react";
import "./LoginPage.css";
import logo from "../assets/unilytics_logo.png";
import loginBg from "../assets/login.jpg";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // still needed for UI

  const handleLogin = (e) => {
    e.preventDefault();

    // Mock login logic
    const lowerEmail = email.toLowerCase();

    if (lowerEmail === "john@student-dhbw.de") {
      localStorage.setItem("email", email);
      localStorage.setItem("role", "student");
      navigate("/dashboard");
    } else if (lowerEmail === "drsmith@instructor-dhbw.de") {
      localStorage.setItem("email", email);
      localStorage.setItem("role", "instructor");
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Use a valid student or instructor email.");
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${loginBg})` }}>
      <header className="navbar">
        <img src={logo} alt="Unilytics Logo" className="logo" />
      </header>

      <div className="login-overlay">
        <div className="login-box">
          <img src={logo} alt="Unilytics Logo" className="login-logo" />
          <h2>Login to Unilytics</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>

      <footer className="footer">&copy; 2025 Unilytics. All rights reserved.</footer>
    </div>
  );
}

export default LoginPage;
