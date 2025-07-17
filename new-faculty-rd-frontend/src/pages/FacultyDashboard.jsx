// FacultyDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FacultyDashboard.css";
import { useFaculty } from "../contexts/FacultyContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.min.css'; // Ensure correct path
export default function FacultyDashboard() {
    const navigate = useNavigate();
    const { facultyName, notifications } = useFaculty();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    console.log("Notifications in FacultyDashboard (on render):", notifications);
    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
    };
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {facultyName || "Faculty"}!</h1>
                <div className="notification-area">
                    <div className="notification-icon-container" onClick={toggleNotifications}>
                        <FontAwesomeIcon
                            icon={faBell}
                            className="notification-icon"
                        />
                        {notifications && notifications.length > 0 && (
                            <span className="notification-badge">{notifications.length}</span>
                        )}
                    </div>
                    {isNotificationsOpen && notifications && notifications.length > 0 && (
                        <div className="notifications-dropdown">
                            <h3>Notifications:</h3>
                            <ul>
                                {notifications.map((notification, index) => (
                                    <li key={index}>
                                        <p>{notification.message}</p>
                                        <small>{new Date(notification.timestamp).toLocaleString()}</small>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {isNotificationsOpen && (!notifications || notifications.length === 0) && (
                        <div className="notifications-dropdown">
                            <p>No notifications.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="dashboard-content">
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button onClick={() => navigate("/faculty/my-entries")}>My Entries</button>
                    <button onClick={() => navigate("/faculty/add-research")}>Add Research</button>
                </div>
            </div>
        </div>
    );
}