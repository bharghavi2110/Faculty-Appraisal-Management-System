import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [dob, setDob] = useState("");
  const { role } = useParams();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (id && dob) {
      alert(`${role} logged in successfully`);
      navigate("/"); // navigate to dashboard later
    } else {
      alert("Fill all fields!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{role.toUpperCase()} Login</h2>
        <input
          type="text"
          placeholder={`${role} ID`}
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
