// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [faculties, setFaculties] = useState([]);
  const [hods, setHods] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [editingFacultyId, setEditingFacultyId] = useState(null);
  const [editingHodId, setEditingHodId] = useState(null);
  const [facultyData, setFacultyData] = useState({
    facultyId: "",
    name: "",
    dob: "",
    department: "",
    designation: "",
    email: "",
    phone: ""
  });
  const [hodData, setHodData] = useState({
    hodId: "",
    name: "",
    dob: "",
    department: "",
    designation: "",
    email: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFaculties();
    fetchHods();
  }, []);

  const isValidPhone = (phone) => /^\d{10}$/.test(phone);

  const fetchFaculties = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/admin/faculties");
      setFaculties(res.data);
    } catch {
      setError("Error fetching faculties");
    }
  };

  const fetchHods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/admin/hods");
      setHods(res.data);
    } catch {
      setError("Error fetching HODs");
    }
  };

  const handleAddFaculty = async () => {
    if (!facultyData.facultyId || !facultyData.name || !facultyData.dob || !facultyData.department || !facultyData.designation || !facultyData.email || !facultyData.phone) {
      setError("Please fill all the fields.");
      return;
    }

    if (!isValidPhone(facultyData.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      const payload = {
        ...facultyData,
        facultyId: Number(facultyData.facultyId),
      };
      await axios.post("http://localhost:5000/api/auth/admin/add/faculty", payload);
      setMessage("Faculty added successfully");
      setFacultyData({ facultyId: "", name: "", dob: "", department: "", designation: "", email: "", phone: "" });
      setError("");
      fetchFaculties();
    } catch (err) {
      setError("Error adding faculty: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAddHod = async () => {
    if (!hodData.hodId || !hodData.name || !hodData.dob || !hodData.department || !hodData.designation || !hodData.email || !hodData.phone) {
      setError("Please fill all the fields.");
      return;
    }

    if (!isValidPhone(hodData.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      const payload = {
        ...hodData,
        hodId: Number(hodData.hodId),
      };
      await axios.post("http://localhost:5000/api/auth/admin/add/hod", payload);
      setMessage("HOD added successfully");
      setHodData({ hodId: "", name: "", dob: "", department: "", designation: "", email: "", phone: "" });
      setError("");
      fetchHods();
    } catch (err) {
      setError("Error adding HOD: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditFaculty = (faculty) => {
    setFacultyData(faculty);
    setEditingFacultyId(faculty._id);
    setMessage("");
    setError("");
  };

  const handleUpdateFaculty = async () => {
    if (!editingFacultyId) return;
    try {
      await axios.put(`http://localhost:5000/api/auth/admin/update/faculty/${editingFacultyId}`, facultyData);
      setMessage("Faculty updated successfully");
      setEditingFacultyId(null);
      setFacultyData({ facultyId: "", name: "", dob: "", department: "", designation: "", email: "", phone: "" });
      fetchFaculties();
    } catch (err) {
      setError("Error updating faculty: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditHod = (hod) => {
    setHodData(hod);
    setEditingHodId(hod._id);
    setMessage("");
    setError("");
  };

  const handleUpdateHod = async () => {
    if (!editingHodId) return;
    try {
      await axios.put(`http://localhost:5000/api/auth/admin/update/hod/${editingHodId}`, hodData);
      setMessage("HOD updated successfully");
      setEditingHodId(null);
      setHodData({ hodId: "", name: "", dob: "", department: "", designation: "", email: "", phone: "" });
      fetchHods();
    } catch (err) {
      setError("Error updating HOD: " + (err.response?.data?.message || err.message));
    }
  };
  const handleDeleteFaculty = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/delete/faculty/${id}`);
        setMessage("Faculty deleted successfully");
        fetchFaculties();
      } catch (err) {
        setError("Error deleting faculty: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDeleteHod = async (id) => {
    if (window.confirm("Are you sure you want to delete this HOD?")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/delete/hod/${id}`);
        setMessage("HOD deleted successfully");
        fetchHods();
      } catch (err) {
        setError("Error deleting HOD: " + (err.response?.data?.message || err.message));
      }
    }
  };
  const filteredFaculties = faculties.filter(f =>
    (f.department || "").toLowerCase().includes(departmentFilter.toLowerCase())
  );

  const filteredHods = hods.filter(h =>
    (h.department || "").toLowerCase().includes(departmentFilter.toLowerCase())
  );

  return (
    <div className="adminDashboard">
      <div className="form-box">
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <input
          type="text"
          placeholder="Filter by Department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="filter-input"
        />

        {/* Faculty Section */}
        <section className="faculty-section">
          <h3>Faculties</h3>
          <button onClick={fetchFaculties} className="view-button">View Faculties</button>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>DOB</th><th>Department</th><th>Designation</th><th>Email</th><th>Phone</th><th className="action-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculties.map((f, i) => (
                  <tr key={i}>
                    <td>{f.facultyId}</td>
                    <td>{f.name}</td>
                    <td>{f.dob}</td>
                    <td>{f.department}</td>
                    <td>{f.designation}</td>
                    <td>{f.email}</td>
                    <td>{f.phone}</td>
                    <td className="action-buttons">
                      <button onClick={() => handleEditFaculty(f)} className="edit-button">Edit</button>
                      <button onClick={() => handleDeleteFaculty(f._id)} className="delete-button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4>{editingFacultyId ? "Edit Faculty" : "Add New Faculty"}</h4>
          <div className="input-group">
            <input type="text" placeholder="Faculty ID" value={facultyData.facultyId} onChange={e => setFacultyData({ ...facultyData, facultyId: e.target.value })} />
            <input type="text" placeholder="Name" value={facultyData.name} onChange={e => setFacultyData({ ...facultyData, name: e.target.value })} />
          </div>
          <div className="input-group">
            <input type="date" value={facultyData.dob} onChange={e => setFacultyData({ ...facultyData, dob: e.target.value })} />
            <input type="text" placeholder="Department" value={facultyData.department} onChange={e => setFacultyData({ ...facultyData, department: e.target.value })} />
          </div>
          <div className="input-group">
            <input type="text" placeholder="Designation" value={facultyData.designation} onChange={e => setFacultyData({ ...facultyData, designation: e.target.value })} />
            <input type="email" placeholder="Email" value={facultyData.email} onChange={e => setFacultyData({ ...facultyData, email: e.target.value })} />
          </div>
          <div className="input-group">
            <input type="text" placeholder="Phone (10 digits)" value={facultyData.phone} onChange={e => setFacultyData({ ...facultyData, phone: e.target.value })} />
            <button onClick={editingFacultyId ? handleUpdateFaculty : handleAddFaculty} className={editingFacultyId ? "update-button" : "add-button"}>
              {editingFacultyId ? "Update Faculty" : "Add Faculty"}
            </button>
          </div>
        </section>

        {/* HOD Section */}
        <section className="hod-section">
          <h3>HODs</h3>
          <button onClick={fetchHods} className="view-button">View HODs</button>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>DOB</th><th>Department</th><th>Designation</th><th>Email</th><th>Phone</th><th className="action-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHods.map((h, i) => (
                  <tr key={i}>
                    <td>{h.hodId}</td>
                    <td>{h.name}</td>
                    <td>{h.dob}</td>
                    <td>{h.department}</td>
                    <td>{h.designation}</td>
                    <td>{h.email}</td>
                    <td>{h.phone}</td>
                    <td className="action-buttons">
                      <button onClick={() => handleEditHod(h)} className="edit-button">Edit</button>
                      <button onClick={() => handleDeleteHod(h._id)} className="delete-button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h4>{editingHodId ? "Edit HOD" : "Add New HOD"}</h4>
          <div className="input-group">
            <input type="text" placeholder="HOD ID" value={hodData.hodId} onChange={e => setHodData({ ...hodData, hodId: e.target.value })} />
            <input type="text" placeholder="Name" value={hodData.name} onChange={e => setHodData({ ...hodData, name: e.target.value })} />
          </div>
          <div className="input-group">
            <input type="date" value={hodData.dob} onChange={e => setHodData({ ...hodData, dob: e.target.value })} />
            <input type="text" placeholder="Department" value={hodData.department} onChange={e => setHodData({ ...hodData, department: e.target.value })} />
          </div>
          <div className="input-group">
            <input type="text" placeholder="Designation" value={hodData.designation} onChange={e => setHodData({ ...hodData, designation: e.target.value })} />
            <input type="email" placeholder="Email" value={hodData.email} onChange={e => setHodData({ ...hodData, email: e.target.value })} />
          </div>
          <div className="input-group">
            <input type="text" placeholder="Phone (10 digits)" value={hodData.phone} onChange={e => setHodData({ ...hodData, phone: e.target.value })} />
            <button onClick={editingHodId ? handleUpdateHod : handleAddHod} className={editingHodId ? "update-button" : "add-button"}>
              {editingHodId ? "Update HOD" : "Add HOD"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}