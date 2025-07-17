import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFaculty } from "../contexts/FacultyContext";
export default function LoginPage() {
  const [id, setId] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();
  const { setFacultyName, setFacultyId, setNotifications } = useFaculty();
  const handleDobChange = (e) => {
    setDob(e.target.value);
  };
  const handleLogin = async () => {
    if (id && dob) {
      console.log("Date of Birth being sent:", dob); // Verify the format
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          id,
          dob: dob, // Send the 'dob' string directly
        });
        console.log("Login response:", res.data);
        if (res.data.success) {
          const userName = res.data.name;
          const userRole = res.data.role;
          toast.success(`Welcome, ${userName}! Redirecting...`);
          localStorage.setItem("userName", userName);
          localStorage.setItem("userRole", userRole);
          if (userRole === "faculty") {
            setFacultyName(userName);
            setFacultyId(id);
            localStorage.setItem("facultyId", id);
            console.log("Notifications from response:", res.data.notifications);
            setNotifications(res.data.notifications || []);
            console.log("Notifications in context after login:", res.data.notifications);
          }
          if (userRole === "hod") {
             localStorage.setItem("hodData", JSON.stringify({
             name: res.data.name,
             department: res.data.department,
             role: res.data.role
          }));
          }
          setTimeout(() => {
            if (userRole === "faculty") navigate("/faculty/dashboard");
            else if (userRole === "hod") navigate("/hod/dashboard");
            else if (userRole === "admin") navigate("/admin/dashboard");
            else toast.error("Invalid user role received from the server.");
          }, 1500);
        } else {
          toast.error(res.data.message || "Invalid User ID or Date of Birth");
        }
      } catch (err) {
        toast.error("Login failed. Please try again.");
      }
    } else {
      toast.warn("Please fill in all fields");
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="User ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="input-field"
        />
        <input
          type="date"
          value={dob}
          onChange={handleDobChange}
          max={new Date().toISOString().split("T")[0]}
          className="input-field"
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleLogin} className="login-button">Login</button>
      </div>
      <ToastContainer />
    </div>
  );
}