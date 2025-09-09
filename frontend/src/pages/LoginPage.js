// src/pages/LoginPage.js
import React, { useState } from "react";
import "./LoginPage.css";
import logo from "../assets/unilytics_logo.png";
import loginBg from "../assets/login.jpg";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.error || "Invalid credentials");
        return;
      }

      // Save user info in localStorage
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      // Role-based redirect
      if (data.role.toLowerCase() === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setLoading(false);
      alert("Cannot connect to server");
      console.error(err);
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
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <footer className="footer">&copy; 2025 Unilytics. All rights reserved.</footer>
    </div>
  );
}

export default LoginPage;
