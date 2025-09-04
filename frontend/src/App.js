// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Grades from "./pages/Grades"; 
import Performance from "./pages/Performance";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Recommendations from "./pages/Recommendations";
import CourseContent from "./pages/CourseContent";
import MyTeaching from "./instructor/MyTeaching";
import InstructorCourseContent from "./instructor/InstructorCourseContent";
import ClassAnalytics from "./instructor/ClassAnalytics";
import StudentList from "./instructor/StudentList";
import SendRecommendations from "./instructor/SendRecommendations";
import AdminDashboard from "./admin/AdminDashboard";
import ManageUsers from "./admin/ManageUsers";
import ManagePrograms from './admin/ManagePrograms';
import ProgramDetails from "./admin/ProgramDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/course/:courseId" element={<CourseContent />} />
        <Route path="/instructor/my-teaching" element={<MyTeaching />} />
        <Route path="/instructor/course/:courseId" element={<InstructorCourseContent />} />
        <Route path="/instructor/class-analytics" element={<ClassAnalytics />} />
        <Route path="/instructor/student-list" element={<StudentList />} />
        <Route path="/instructor/recommendations" element={<SendRecommendations />} /> 
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-programs" element={<ManagePrograms />} />
        <Route path="/admin/manage-programs/:id" element={<ProgramDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
