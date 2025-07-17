import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RoleSelect.css";
export default function RoleSelect() {
  const navigate = useNavigate();
  return (
    <div className="role-container">
      <h1>Select Your Role</h1>
      <div className="role-buttons">
        <button onClick={() => navigate("/login/faculty")}>Faculty</button>
        <button onClick={() => navigate("/login/hod")}>HOD</button>
        <button onClick={() => navigate("/login/admin")}>Admin</button>
      </div>
    </div>
  );
}
