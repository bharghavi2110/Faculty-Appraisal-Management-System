import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import FacultyDashboard from "./pages/FacultyDashboard";
import MyEntries from "./pages/MyEntries";
import AddResearch from "./pages/AddResearch";
import AdminDashboard from "./pages/AdminDashboard";
import HODDashboard from "./pages/HODDashboard";
import { FacultyProvider } from "./contexts/FacultyContext";  // Import the FacultyProvider
function App() {
  return (
    <FacultyProvider>  {/* Wrap your app in FacultyProvider */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/my-entries" element={<MyEntries />} />
        <Route path="/faculty/add-research" element={<AddResearch />} />
        <Route path="/hod/dashboard" element={<HODDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </FacultyProvider>
  );
}
export default App;
