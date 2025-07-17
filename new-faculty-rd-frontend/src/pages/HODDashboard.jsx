import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "../styles/HODDashboard.css";
const HODDashboard = () => {
  const [faculties, setFaculties] = useState([]);
  const [researches, setResearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hodDataStr = localStorage.getItem("hodData");
        if (!hodDataStr) {
          console.log("No HOD data found in localStorage.");
          setLoading(false);
          return;
        }
        const hodData = JSON.parse(hodDataStr);
        const dept = hodData.department;
        if (!dept) {
          console.log("HOD data missing 'department' field.");
          setLoading(false);
          return;
        }
        setDepartment(dept);
        console.log("Department being used for API calls:", dept);
        const facultyResponse = await axios.get(
          `http://localhost:5000/api/faculty/department/${encodeURIComponent(dept)}`
        );
        console.log("Faculty Response Data:", facultyResponse.data);
        setFaculties(facultyResponse.data);
        const researchResponse = await axios.get(
          `http://localhost:5000/api/hod/${encodeURIComponent(dept)}/researches`
        );
        if (researchResponse.data && researchResponse.data.success) {
          console.log("Research Response Data:", researchResponse.data.data);
          setResearches(researchResponse.data.data);
        } else {
          setResearches([]);
          console.error("Error fetching research submissions:", researchResponse.data ? researchResponse.data.message : "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleReview = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/hod/review/${id}`, { status: "Reviewed" });
      alert("Marked as Reviewed");
      setResearches(researches.map((r) =>
        r._id === id ? { ...r, status: "Reviewed" } : r
      ));
      console.log(`Notification sent (conceptually) for research ID: ${id}`);
    } catch (error) {
      console.error("Error reviewing research:", error);
    }
  };
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/hod/review/${id}`, { status: "Approved" });
      alert("Marked as Approved");
      setResearches(researches.map((r) =>
        r._id === id ? { ...r, status: "Approved" } : r
      ));
    } catch (error) {
      console.error("Error approving research:", error);
    }
  };
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(researches);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Research_Submissions");
    XLSX.writeFile(wb, "Research_Submissions.xlsx");
  };
  return (
    <div className="hodDashboard-container">
      <h1>HOD Dashboard</h1>
      <h2>Department: {department || "N/A"}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>Faculties:</h3>
          {faculties.length === 0 ? (
            <p className="no-faculties">No faculties found in this department.</p>
          ) : (
            <table className="hodDashboard-table">
              <thead>
                <tr>
                  <th>Faculty ID</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {faculties.map((faculty) => (
                  <tr key={faculty._id}>
                    <td>{faculty.facultyId}</td>
                    <td>{faculty.name}</td>
                    <td>{faculty.designation}</td>
                    <td>{faculty.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h3>Research Submissions:</h3>
          <div className="download-buttons">
            <button onClick={exportExcel}>Download Excel</button>
          </div>
          {researches.length === 0 ? (
            <p className="no-research">No research submissions found for this department.</p>
          ) : (
            <table className="hodDashboard-table">
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>File</th>
                  <th>Marks</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Impact Factor</th>
                  <th>Journal Quality</th>
                  <th>ISBN</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {researches.map((research) => (
                  <tr key={research._id}>
                    <td className="faculty-name-cell">{research.facultyName || "Unknown"}</td>
                    <td>{research.title}</td>
                    <td>{research.type}</td>
                    <td>
                      {research.fileUrl ? (
                        <a
                          href={`http://localhost:5000${research.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View File
                        </a>
                      ) : (
                        "No file"
                      )}
                    </td>
                    <td>{research.score}</td>
                    <td>{new Date(research.date).toLocaleDateString()}</td>
                    <td>{research.status || "Pending"}</td>
                    <td>{research.impactFactor || "-"}</td>
                    <td>{research.journalQuality || "-"}</td>
                    <td>{research.isbn || "-"}</td>
                    <td>
                      <div className="review-btn-container">
                        <button
                          className="review-btn"
                          onClick={() => handleReview(research._id)}
                          disabled={research.status === "Reviewed" || research.status === "Approved"}
                        >
                          Review
                        </button>
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(research._id)}
                          disabled={research.status === "Reviewed" || research.status === "Approved"}
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};
export default HODDashboard;