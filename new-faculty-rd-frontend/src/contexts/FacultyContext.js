import React, { createContext, useContext, useState, useEffect } from "react";
const FacultyContext = createContext();
export const FacultyProvider = ({ children }) => {
  const [facultyId, setFacultyId] = useState(localStorage.getItem("facultyId") || null);
  const [facultyName, setFacultyName] = useState(localStorage.getItem("facultyName") || "");
  const [notifications, setNotifications] = useState([]); // Add notifications state
  useEffect(() => {
    if (facultyId) {
      localStorage.setItem("facultyId", facultyId);
    } else {
      localStorage.removeItem("facultyId");
    }
  }, [facultyId]);
  useEffect(() => {
    if (facultyName) {
      localStorage.setItem("facultyName", facultyName);
    } else {
      localStorage.removeItem("facultyName");
    }
  }, [facultyName]);
  return (
    <FacultyContext.Provider
      value={{
        facultyId,
        setFacultyId,
        facultyName,
        setFacultyName,
        notifications,
        setNotifications, // Provide the setNotifications function
      }}
    >
      {children}
    </FacultyContext.Provider>
  );
};
export const useFaculty = () => useContext(FacultyContext);